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
    const bookingsCollection = db.collection('bookings')
    const spotsCollection = db.collection('parking_spots')
    const usersCollection = db.collection('users')

    const { httpMethod, path } = event
    const action = JSON.parse(event.body || '{}').action

    // GET - Get bookings
    if (httpMethod === 'GET') {
      // Get active booking
      if (path.includes('/active') || action === 'getActive') {
        const activeBooking = await bookingsCollection.findOne({
          userId: new ObjectId(userId),
          status: 'active'
        })

        if (!activeBooking) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ booking: null })
          }
        }

        // Get spot details
        const spot = await spotsCollection.findOne({
          _id: new ObjectId(activeBooking.spotId)
        })

        const bookingWithDetails = {
          ...activeBooking,
          spotName: spot?.name || 'Unknown',
          floor: spot?.floor || 'Unknown',
          price: spot?.pricePerHour || 20
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ booking: bookingWithDetails })
        }
      }

      // Get booking history
      if (path.includes('/history') || action === 'getHistory') {
        const limit = parseInt(event.queryStringParameters?.limit) || 10
        
        const bookings = await bookingsCollection
          .find({
            userId: new ObjectId(userId),
            status: { $in: ['completed', 'cancelled'] }
          })
          .sort({ createdAt: -1 })
          .limit(limit)
          .toArray()

        // Get spot details for each booking
        const bookingsWithDetails = await Promise.all(
          bookings.map(async (booking) => {
            const spot = await spotsCollection.findOne({
              _id: new ObjectId(booking.spotId)
            })
            return {
              ...booking,
              spotName: spot?.name || 'Unknown',
              floor: spot?.floor || 'Unknown'
            }
          })
        )

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ bookings: bookingsWithDetails })
        }
      }

      // Get booking by ID
      const bookingId = event.queryStringParameters?.id
      if (bookingId) {
        const booking = await bookingsCollection.findOne({
          _id: new ObjectId(bookingId),
          userId: new ObjectId(userId)
        })

        if (!booking) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'ไม่พบการจอง' })
          }
        }

        const spot = await spotsCollection.findOne({
          _id: new ObjectId(booking.spotId)
        })

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            booking: {
              ...booking,
              spotName: spot?.name || 'Unknown',
              floor: spot?.floor || 'Unknown'
            }
          })
        }
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'กรุณาระบุ action หรือ ID' })
      }
    }

    // POST - Create booking
    if (httpMethod === 'POST' && action === 'create') {
      const { spotId, floor, vehicle } = JSON.parse(event.body)

      if (!spotId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'กรุณาระบุที่จอด' })
        }
      }

      // Check if user already has active booking
      const existingBooking = await bookingsCollection.findOne({
        userId: new ObjectId(userId),
        status: 'active'
      })

      if (existingBooking) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'คุณมีการจองที่กำลังใช้งานอยู่แล้ว' })
        }
      }

      // Check if spot is available
      const spot = await spotsCollection.findOne({
        _id: new ObjectId(spotId)
      })

      if (!spot) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'ไม่พบที่จอดนี้' })
        }
      }

      if (spot.status !== 'available') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ที่จอดนี้ไม่ว่าง' })
        }
      }

      // Create booking
      const booking = {
        userId: new ObjectId(userId),
        spotId: new ObjectId(spotId),
        floor: floor || spot.floor,
        vehicle: vehicle || null,
        status: 'active',
        startTime: new Date(),
        endTime: null,
        cost: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = await bookingsCollection.insertOne(booking)

      // Update spot status
      await spotsCollection.updateOne(
        { _id: new ObjectId(spotId) },
        { 
          $set: { 
            status: 'occupied',
            updatedAt: new Date()
          } 
        }
      )

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'จองสำเร็จ',
          booking: {
            ...booking,
            _id: result.insertedId,
            spotName: spot.name
          }
        })
      }
    }

    // PUT - Update booking (cancel or complete)
    if (httpMethod === 'PUT' || httpMethod === 'POST') {
      const { bookingId, newStatus, cost } = JSON.parse(event.body)

      if (!bookingId || !newStatus) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'กรุณาระบุ bookingId และ status' })
        }
      }

      // Verify booking belongs to user
      const booking = await bookingsCollection.findOne({
        _id: new ObjectId(bookingId),
        userId: new ObjectId(userId)
      })

      if (!booking) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'ไม่พบการจอง' })
        }
      }

      if (booking.status !== 'active') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'การจองนี้ไม่ได้อยู่ในสถานะใช้งาน' })
        }
      }

      // Update booking
      const updateData = {
        status: newStatus,
        updatedAt: new Date()
      }

      if (newStatus === 'completed') {
        updateData.endTime = new Date()
        updateData.cost = cost || 0

        // Update user points
        const pointsEarned = Math.floor(cost / 10) // 10 points per 100 baht
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $inc: { points: pointsEarned } }
        )
      } else if (newStatus === 'cancelled') {
        updateData.endTime = new Date()
      }

      await bookingsCollection.updateOne(
        { _id: new ObjectId(bookingId) },
        { $set: updateData }
      )

      // Free up the spot
      await spotsCollection.updateOne(
        { _id: new ObjectId(booking.spotId) },
        { 
          $set: { 
            status: 'available',
            updatedAt: new Date()
          } 
        }
      )

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: newStatus === 'completed' ? 'จบการจองสำเร็จ' : 'ยกเลิกการจองสำเร็จ',
          booking: { ...booking, ...updateData }
        })
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Bookings API Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' })
    }
  }
}
