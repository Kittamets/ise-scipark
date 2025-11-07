const { MongoClient } = require('mongodb')

let cachedDb = null

const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = client.db('scipark')
  cachedDb = db
  return db
}

module.exports = { connectToDatabase }
