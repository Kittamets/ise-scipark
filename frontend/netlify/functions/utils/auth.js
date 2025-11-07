const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const extractToken = (event) => {
  const authHeader = event.headers.authorization || event.headers.Authorization
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  
  return parts[1]
}

const authenticate = (event) => {
  const token = extractToken(event)
  if (!token) {
    throw new Error('No token provided')
  }
  
  const decoded = verifyToken(token)
  if (!decoded) {
    throw new Error('Invalid token')
  }
  
  return decoded.userId
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  extractToken,
  authenticate,
}
