import { createClient } from 'redis';

/**
 * Redis Client Configuration
 * Used for caching and session management
 */

let redisClient = null;
let isReady = false;

// Create Redis client
const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            // Stop after 3 retries (not 10) to fail faster
            return new Error('Max retries reached');
          }
          // Exponential backoff: 2^retries * 100ms
          const delay = Math.min(retries * 100, 1000);
          return delay;
        }
      }
    });

    // Event listeners
    redisClient.on('connect', () => {
      // Silent - no log
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis: Connected and ready');
      isReady = true;
    });

    redisClient.on('error', (err) => {
      // Silent - only log once during initialization
      isReady = false;
    });

    redisClient.on('end', () => {
      // Silent - no log
      isReady = false;
    });

    // Connect to Redis
    await redisClient.connect();

  } catch (error) {
    console.log('⚠️  Redis not available - Application will continue without caching');
    redisClient = null;
    isReady = false;
  }
};

// Get Redis client
const getRedisClient = () => {
  if (!redisClient || !isReady) {
    return null;
  }
  return redisClient;
};

// Check if Redis is available
const isRedisAvailable = () => {
  return redisClient && isReady;
};

// Graceful shutdown
const closeRedis = async () => {
  if (redisClient && isReady) {
    try {
      await redisClient.quit();
      console.log('✅ Redis: Connection closed gracefully');
    } catch (error) {
      console.error('❌ Error closing Redis connection:', error.message);
    }
  }
};

// Cache operations with error handling
const cacheOperations = {
  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} - Cached value or null
   */
  get: async (key) => {
    try {
      const client = getRedisClient();
      if (!client) return null;

      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Redis GET error (${key}):`, error.message);
      return null;
    }
  },

  /**
   * Set value in cache with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (default: 300)
   * @returns {Promise<boolean>} - Success status
   */
  set: async (key, value, ttl = 300) => {
    try {
      const client = getRedisClient();
      if (!client) return false;

      await client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Redis SET error (${key}):`, error.message);
      return false;
    }
  },

  /**
   * Delete key from cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - Success status
   */
  del: async (key) => {
    try {
      const client = getRedisClient();
      if (!client) return false;

      await client.del(key);
      return true;
    } catch (error) {
      console.error(`Redis DEL error (${key}):`, error.message);
      return false;
    }
  },

  /**
   * Delete multiple keys matching pattern
   * @param {string} pattern - Key pattern (e.g., 'cache:parking:*')
   * @returns {Promise<number>} - Number of keys deleted
   */
  delPattern: async (pattern) => {
    try {
      const client = getRedisClient();
      if (!client) return 0;

      const keys = await client.keys(pattern);
      if (keys.length === 0) return 0;

      await client.del(keys);
      return keys.length;
    } catch (error) {
      console.error(`Redis DEL pattern error (${pattern}):`, error.message);
      return 0;
    }
  },

  /**
   * Check if key exists
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} - Exists status
   */
  exists: async (key) => {
    try {
      const client = getRedisClient();
      if (!client) return false;

      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Redis EXISTS error (${key}):`, error.message);
      return false;
    }
  },

  /**
   * Get TTL of key
   * @param {string} key - Cache key
   * @returns {Promise<number>} - TTL in seconds (-1 if no expiry, -2 if not exists)
   */
  ttl: async (key) => {
    try {
      const client = getRedisClient();
      if (!client) return -2;

      return await client.ttl(key);
    } catch (error) {
      console.error(`Redis TTL error (${key}):`, error.message);
      return -2;
    }
  }
};

export default redisClient;
export {
  initializeRedis,
  getRedisClient,
  isRedisAvailable,
  closeRedis,
  cacheOperations
};
