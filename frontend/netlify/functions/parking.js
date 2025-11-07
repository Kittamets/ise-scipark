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
    // Optional auth - some endpoints are public
    let userId = null
    const token = event.headers.authorization?.replace('Bearer ', '')
    if (token) {
      const decoded = verifyToken(token)
      if (decoded) {
        userId = decoded.userId
      }
    }

    // Connect to database
    const db = await connectToDatabase()
    const spotsCollection = db.collection('parking_spots')
    const zonesCollection = db.collection('parking_zones')
    const bookingsCollection = db.collection('bookings')

    const { httpMethod } = event
    const queryParams = event.queryStringParameters || {}

    // GET - Get parking spots
    if (httpMethod === 'GET') {
      // Get all spots
      if (!queryParams.id && !queryParams.zone) {
        const spots = await spotsCollection
          .find({})
          .sort({ name: 1 })
          .toArray()

        // Get zones for grouping
        const zones = await zonesCollection.find({}).toArray()

        // Group spots by zone
        const spotsByZone = zones.map(zone => ({
          ...zone,
          spots: spots.filter(spot => spot.zoneId === zone._id.toString())
        }))

        // Count statistics
        const totalSpots = spots.length
        const availableSpots = spots.filter(s => s.status === 'available').length
        const occupiedSpots = spots.filter(s => s.status === 'occupied').length

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            spots,
            zones: spotsByZone,
            stats: {
              total: totalSpots,
              available: availableSpots,
              occupied: occupiedSpots,
              occupancyRate: totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0
            }
          })
        }
      }

      // Get spot by ID
      if (queryParams.id) {
        const spot = await spotsCollection.findOne({
          _id: new ObjectId(queryParams.id)
        })

        if (!spot) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'ไม่พบที่จอดนี้' })
          }
        }

        // Get zone details
        const zone = await zonesCollection.findOne({
          _id: new ObjectId(spot.zoneId)
        })

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            spot: {
              ...spot,
              zoneName: zone?.name || 'Unknown Zone',
              zoneDescription: zone?.description || ''
            }
          })
        }
      }

      // Get spots by zone
      if (queryParams.zone) {
        const spots = await spotsCollection
          .find({ zoneId: queryParams.zone })
          .sort({ name: 1 })
          .toArray()

        const zone = await zonesCollection.findOne({
          _id: new ObjectId(queryParams.zone)
        })

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            spots,
            zone
          })
        }
      }
    }

    // POST - Check availability (used for real-time updates)
    if (httpMethod === 'POST') {
      const { action, spotIds } = JSON.parse(event.body || '{}')

      if (action === 'checkAvailability') {
        if (!spotIds || !Array.isArray(spotIds)) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'กรุณาระบุ spotIds' })
          }
        }

        const spots = await spotsCollection
          .find({
            _id: { $in: spotIds.map(id => new ObjectId(id)) }
          })
          .toArray()

        const availability = spots.map(spot => ({
          id: spot._id.toString(),
          name: spot.name,
          status: spot.status,
          available: spot.status === 'available'
        }))

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ availability })
        }
      }

      // Get zones
      if (action === 'getZones') {
        const zones = await zonesCollection.find({}).toArray()

        // Count spots per zone
        const zonesWithCounts = await Promise.all(
          zones.map(async (zone) => {
            const totalSpots = await spotsCollection.countDocuments({
              zoneId: zone._id.toString()
            })
            const availableSpots = await spotsCollection.countDocuments({
              zoneId: zone._id.toString(),
              status: 'available'
            })

            return {
              ...zone,
              totalSpots,
              availableSpots,
              occupiedSpots: totalSpots - availableSpots
            }
          })
        )

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ zones: zonesWithCounts })
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
    console.error('Parking API Error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' })
    }
  }
}
