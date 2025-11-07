const { connectToDatabase } = require('./utils/db')
const { hashPassword, comparePassword, generateToken, authenticate } = require('./utils/auth')
const { ObjectId } = require('mongodb')

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const db = await connectToDatabase()
    const body = JSON.parse(event.body || '{}')
    const action = body.action

    // Register
    if (action === 'register') {
      const { email, username, password, phone } = body

      // Validation
      if (!email || !username || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' }),
        }
      }

      // Check if user exists
      const existingUser = await db.collection('users').findOne({ 
        $or: [{ email }, { username }] 
      })
      
      if (existingUser) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'User already exists' }),
        }
      }

      // Hash password
      const hashedPassword = await hashPassword(password)

      // Create user
      const result = await db.collection('users').insertOne({
        email,
        username,
        password: hashedPassword,
        phone: phone || '',
        name: username,
        rank: 'Iron',
        points: 0,
        vehicles: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const token = generateToken(result.insertedId.toString())

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'User registered successfully',
          token,
          user: {
            id: result.insertedId,
            email,
            username,
            name: username,
            rank: 'Iron',
            points: 0,
          },
        }),
      }
    }

    // Login
    if (action === 'login') {
      const { username, password } = body

      if (!username || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing credentials' }),
        }
      }

      // Find user
      const user = await db.collection('users').findOne({
        $or: [{ email: username }, { username }],
      })

      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid credentials' }),
        }
      }

      // Verify password
      const isValid = await comparePassword(password, user.password)
      if (!isValid) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid credentials' }),
        }
      }

      const token = generateToken(user._id.toString())

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            name: user.name,
            rank: user.rank,
            points: user.points,
          },
        }),
      }
    }

    // Verify token
    if (action === 'verify') {
      const userId = authenticate(event)
      
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
      
      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' }),
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            name: user.name,
            rank: user.rank,
            points: user.points,
          },
        }),
      }
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid action' }),
    }

  } catch (error) {
    console.error('Auth error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    }
  }
}
