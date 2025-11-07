const { MongoClient, ObjectId } = require('mongodb')
const { verifyToken } = require('./utils/auth')
const { connectToDatabase } = require('./utils/db')

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    // Verify authentication
    const token = event.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'ไม่พบ token การยืนยันตัวตน' })
      }
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token ไม่ถูกต้องหรือหมดอายุ' })
      }
    }

    const userId = decoded.userId

    // Connect to database
    const db = await connectToDatabase()
    const vehiclesCollection = db.collection('vehicles')

    const { httpMethod } = event

    // GET - Get all vehicles for user
    if (httpMethod === 'GET') {
      const vehicles = await vehiclesCollection
        .find({ userId: new ObjectId(userId) })
        .sort({ createdAt: -1 })
        .toArray()

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ vehicles })
      }
    }

    // POST - Add new vehicle
    if (httpMethod === 'POST') {
      const { licensePlate, brand, model, color } = JSON.parse(event.body)

      if (!licensePlate || !brand) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'กรุณากรอกข้อมูลให้ครบ (ทะเบียนและยี่ห้อ)' })
        }
      }

      // Check if license plate already exists for this user
      const existingVehicle = await vehiclesCollection.findOne({
        userId: new ObjectId(userId),
        licensePlate: licensePlate
      })

      if (existingVehicle) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ทะเบียนนี้มีอยู่ในระบบแล้ว' })
        }
      }

      const vehicle = {
        userId: new ObjectId(userId),
        licensePlate,
        brand,
        model: model || '',
        color: color || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = await vehiclesCollection.insertOne(vehicle)

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'เพิ่มยานพาหนะสำเร็จ',
          vehicle: { ...vehicle, _id: result.insertedId }
        })
      }
    }

    // PUT - Update vehicle
    if (httpMethod === 'PUT') {
      const { id, licensePlate, brand, model, color } = JSON.parse(event.body)

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'กรุณาระบุ ID ของยานพาหนะ' })
        }
      }

      // Verify vehicle belongs to user
      const vehicle = await vehiclesCollection.findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(userId)
      })

      if (!vehicle) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'ไม่พบยานพาหนะนี้' })
        }
      }

      const updateData = {
        updatedAt: new Date()
      }

      if (licensePlate) updateData.licensePlate = licensePlate
      if (brand) updateData.brand = brand
      if (model !== undefined) updateData.model = model
      if (color !== undefined) updateData.color = color

      await vehiclesCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'อัพเดตยานพาหนะสำเร็จ',
          vehicle: { ...vehicle, ...updateData }
        })
      }
    }

    // DELETE - Delete vehicle
    if (httpMethod === 'DELETE') {
      const id = event.queryStringParameters?.id || JSON.parse(event.body || '{}').id

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'กรุณาระบุ ID ของยานพาหนะ' })
        }
      }

      // Verify vehicle belongs to user
      const vehicle = await vehiclesCollection.findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(userId)
      })

      if (!vehicle) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'ไม่พบยานพาหนะนี้' })
        }
      }

      await vehiclesCollection.deleteOne({ _id: new ObjectId(id) })

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'ลบยานพาหนะสำเร็จ' })
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Vehicles API Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' })
    }
  }
}
