const { MongoClient, ObjectId } = require('mongodb')
const { verifyToken } = require('./utils/auth')
const { connectToDatabase } = require('./utils/db')

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    const subscriptionsCollection = db.collection('subscriptions')
    const codesCollection = db.collection('promo_codes')

    const { httpMethod } = event

    // GET - Get available tiers and user subscription
    if (httpMethod === 'GET') {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) })

      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'ไม่พบผู้ใช้' })
        }
      }

      // Get active subscription
      const subscription = await subscriptionsCollection.findOne({
        userId: new ObjectId(userId),
        status: 'active',
        expiresAt: { $gt: new Date() }
      })

      // Define tiers
      const tiers = [
        {
          id: 'iron',
          name: 'Iron',
          price: 0,
          discount: 0,
          features: [
            'จองได้ทุกโซน',
            'ประวัติการจอง 7 วัน',
            'แจ้งเตือนพื้นฐาน',
            'รองรับ 1 ยานพาหนะ'
          ]
        },
        {
          id: 'diamond',
          name: 'Diamond',
          price: 199,
          discount: 10,
          features: [
            'ส่วนลด 10% ทุกการจอง',
            'จองล่วงหน้า 7 วัน',
            'ประวัติการจอดไม่จำกัด',
            'แจ้งเตือนแบบ Real-time',
            'รองรับ 3 ยานพาหนะ',
            'จองช่องพิเศษ'
          ]
        },
        {
          id: 'predator',
          name: 'Predator',
          price: 399,
          discount: 15,
          features: [
            'ส่วนลด 15% ทุกการจอง',
            'จองล่วงหน้า 30 วัน',
            'ประวัติการจอดไม่จำกัด',
            'แจ้งเตือนแบบ Real-time',
            'รองรับยานพาหนะไม่จำกัด',
            'จองช่องพิเศษ & VIP',
            'ที่จอดแบบจองตลอด',
            'บริการช่วยเหลือ 24/7',
            'โอนสิทธิ์การจองได้'
          ]
        }
      ]

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          tiers,
          currentTier: user.rank || 'Iron',
          subscription: subscription || null,
          points: user.points || 0
        })
      }
    }

    // POST - Handle various actions
    if (httpMethod === 'POST') {
      const { action, tierId, code, paymentMethod } = JSON.parse(event.body)

      // Subscribe to tier
      if (action === 'subscribe') {
        if (!tierId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'กรุณาระบุ tier' })
          }
        }

        if (tierId === 'iron') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Iron tier เป็นแผนฟรี ไม่ต้องสมัคร' })
          }
        }

        // Check if user already has active subscription
        const existingSub = await subscriptionsCollection.findOne({
          userId: new ObjectId(userId),
          status: 'active',
          expiresAt: { $gt: new Date() }
        })

        if (existingSub && existingSub.tier === tierId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'คุณกำลังใช้งาน tier นี้อยู่แล้ว' })
          }
        }

        // Create subscription (simulate payment)
        const subscription = {
          userId: new ObjectId(userId),
          tier: tierId,
          tierName: tierId === 'diamond' ? 'Diamond' : 'Predator',
          price: tierId === 'diamond' ? 199 : 399,
          paymentMethod: paymentMethod || 'credit',
          status: 'active',
          startedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          createdAt: new Date()
        }

        await subscriptionsCollection.insertOne(subscription)

        // Update user rank
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { 
            $set: { 
              rank: subscription.tierName,
              subscriptionExpiry: subscription.expiresAt,
              updatedAt: new Date()
            } 
          }
        )

        // Cancel old subscriptions
        if (existingSub) {
          await subscriptionsCollection.updateOne(
            { _id: existingSub._id },
            { $set: { status: 'cancelled', updatedAt: new Date() } }
          )
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: `สมัคร ${subscription.tierName} สำเร็จ!`,
            subscription
          })
        }
      }

      // Redeem code
      if (action === 'redeem') {
        if (!code) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'กรุณากรอกโค้ด' })
          }
        }

        // Check if code exists and is valid
        const promoCode = await codesCollection.findOne({
          code: code.toUpperCase(),
          isActive: true,
          expiresAt: { $gt: new Date() }
        })

        if (!promoCode) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'โค้ดไม่ถูกต้องหรือหมดอายุแล้ว' })
          }
        }

        // Check if code has usage limit
        if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'โค้ดนี้ถูกใช้งานครบแล้ว' })
          }
        }

        // Check if user already used this code
        const usedCode = await codesCollection.findOne({
          code: code.toUpperCase(),
          usedBy: new ObjectId(userId)
        })

        if (usedCode) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'คุณใช้โค้ดนี้ไปแล้ว' })
          }
        }

        // Apply code benefits
        if (promoCode.type === 'subscription') {
          // Grant subscription
          const subscription = {
            userId: new ObjectId(userId),
            tier: promoCode.tier,
            tierName: promoCode.tier === 'diamond' ? 'Diamond' : 'Predator',
            price: 0,
            paymentMethod: 'promo_code',
            promoCode: code.toUpperCase(),
            status: 'active',
            startedAt: new Date(),
            expiresAt: new Date(Date.now() + (promoCode.durationDays || 30) * 24 * 60 * 60 * 1000),
            createdAt: new Date()
          }

          await subscriptionsCollection.insertOne(subscription)

          // Update user rank
          await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { 
              $set: { 
                rank: subscription.tierName,
                subscriptionExpiry: subscription.expiresAt,
                updatedAt: new Date()
              } 
            }
          )

          // Mark code as used
          await codesCollection.updateOne(
            { _id: promoCode._id },
            { 
              $inc: { usedCount: 1 },
              $push: { usedBy: new ObjectId(userId) },
              $set: { updatedAt: new Date() }
            }
          )

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              message: `แลกโค้ดสำเร็จ! คุณได้รับ ${subscription.tierName} ${promoCode.durationDays || 30} วัน`,
              subscription
            })
          }
        } else if (promoCode.type === 'points') {
          // Grant points
          await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { 
              $inc: { points: promoCode.points || 100 },
              $set: { updatedAt: new Date() }
            }
          )

          // Mark code as used
          await codesCollection.updateOne(
            { _id: promoCode._id },
            { 
              $inc: { usedCount: 1 },
              $push: { usedBy: new ObjectId(userId) },
              $set: { updatedAt: new Date() }
            }
          )

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              message: `แลกโค้ดสำเร็จ! คุณได้รับ ${promoCode.points || 100} แต้ม`,
              points: promoCode.points || 100
            })
          }
        }

        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'ประเภทโค้ดไม่ถูกต้อง' })
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
    console.error('Privileges API Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' })
    }
  }
}
