const { MongoClient, ObjectId } = require('mongodb')
const { verifyToken, hashPassword, comparePassword } = require('./utils/auth')
const { connectToDatabase } = require('./utils/db')

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
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
    const usersCollection = db.collection('users')
    const bookingsCollection = db.collection('bookings')
    const spotsCollection = db.collection('parking_spots')

    const { httpMethod } = event

    // GET - Get user profile
    if (httpMethod === 'GET') {
      const user = await usersCollection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } } // Exclude password
      )

      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'ไม่พบผู้ใช้' })
        }
      }

      // Get booking statistics
      const totalBookings = await bookingsCollection.countDocuments({
        userId: new ObjectId(userId),
        status: 'completed'
      })

      const bookings = await bookingsCollection
        .find({
          userId: new ObjectId(userId),
          status: 'completed'
        })
        .toArray()

      const totalCost = bookings.reduce((sum, booking) => sum + (booking.cost || 0), 0)

      // Calculate savings based on rank discount
      let savedAmount = 0
      if (user.rank === 'Diamond') {
        savedAmount = totalCost * 0.1 / 0.9 // 10% discount
      } else if (user.rank === 'Predator') {
        savedAmount = totalCost * 0.15 / 0.85 // 15% discount
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: {
            ...user,
            stats: {
              totalBookings,
              totalCost,
              savedAmount: Math.round(savedAmount),
              memberSince: user.createdAt
            }
          }
        })
      }
    }

    // PUT - Update user profile
    if (httpMethod === 'PUT') {
      const { name, email, phone } = JSON.parse(event.body)

      const updateData = {
        updatedAt: new Date()
      }

      if (name) updateData.name = name
      if (email) {
        // Check if email is already used by another user
        const existingUser = await usersCollection.findOne({
          email,
          _id: { $ne: new ObjectId(userId) }
        })

        if (existingUser) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'อีเมลนี้ถูกใช้งานแล้ว' })
          }
        }

        updateData.email = email
      }
      if (phone) updateData.phone = phone

      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
      )

      const updatedUser = await usersCollection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } }
      )

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'อัพเดตข้อมูลสำเร็จ',
          user: updatedUser
        })
      }
    }

    // POST - Handle various actions
    if (httpMethod === 'POST') {
      const { action } = JSON.parse(event.body)

      // Change password
      if (action === 'changePassword') {
        const { currentPassword, newPassword } = JSON.parse(event.body)

        if (!currentPassword || !newPassword) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'กรุณากรอกข้อมูลให้ครบ' })
          }
        }

        if (newPassword.length < 6) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' })
          }
        }

        // Get user with password
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) })

        if (!user) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'ไม่พบผู้ใช้' })
          }
        }

        // Verify current password
        const isValidPassword = await comparePassword(currentPassword, user.password)

        if (!isValidPassword) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'รหัสผ่านเดิมไม่ถูกต้อง' })
          }
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword)

        // Update password
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { 
            $set: { 
              password: hashedPassword,
              updatedAt: new Date()
            } 
          }
        )

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' })
        }
      }

      // Get booking history
      if (action === 'getBookingHistory') {
        const limit = parseInt(JSON.parse(event.body).limit) || 20

        const bookings = await bookingsCollection
          .find({
            userId: new ObjectId(userId)
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

            const startTime = new Date(booking.startTime)
            const endTime = booking.endTime ? new Date(booking.endTime) : new Date()
            const duration = (endTime - startTime) / (1000 * 60 * 60) // hours

            return {
              id: booking._id.toString(),
              spotName: spot?.name || 'Unknown',
              floor: spot?.floor || 'Unknown',
              date: startTime.toLocaleDateString('th-TH'),
              duration: `${Math.floor(duration)} ชม. ${Math.round((duration % 1) * 60)} นาที`,
              cost: booking.cost || 0,
              status: booking.status
            }
          })
        )

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ bookings: bookingsWithDetails })
        }
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Action ไม่ถูกต้อง' })
      }
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('Users API Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' })
    }
  }
}
