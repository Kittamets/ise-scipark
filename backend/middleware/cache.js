import { cacheOperations, isRedisAvailable } from '../config/redis.js';

/**
 * Cache Middleware
 * Caches GET requests and serves from cache when available
 */

/**
 * Create cache middleware with custom duration
 * @param {number} duration - Cache duration in seconds (default: 300 = 5 minutes)
 * @param {function} keyGenerator - Optional custom key generator function
 * @returns {function} - Express middleware
 */
export const cacheMiddleware = (duration = 300, keyGenerator = null) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip if Redis is not available
    if (!isRedisAvailable()) {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = keyGenerator 
        ? keyGenerator(req)
        : `cache:${req.originalUrl || req.url}`;

      // Try to get from cache
      const cachedData = await cacheOperations.get(cacheKey);

      if (cachedData) {
        console.log(`✅ Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      console.log(`❌ Cache MISS: ${cacheKey}`);

      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (data) => {
        // Cache the response
        cacheOperations.set(cacheKey, data, duration)
          .then(() => console.log(`💾 Cached: ${cacheKey} (TTL: ${duration}s)`))
          .catch(err => console.error(`Cache SET error: ${err.message}`));

        // Send response
        return originalJson(data);
      };

      next();

    } catch (error) {
      console.error('Cache middleware error:', error.message);
      next(); // Continue without cache
    }
  };
};

/**
 * Cache invalidation middleware
 * Invalidates cache patterns after successful mutations
 */
export const invalidateCacheMiddleware = (patterns) => {
  return async (req, res, next) => {
    // Skip if Redis is not available
    if (!isRedisAvailable()) {
      return next();
    }

    try {
      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json to invalidate cache after response
      res.json = async (data) => {
        // Send response first
        const result = originalJson(data);

        // Invalidate cache patterns asynchronously
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const patternArray = Array.isArray(patterns) ? patterns : [patterns];
          
          for (const pattern of patternArray) {
            const count = await cacheOperations.delPattern(pattern);
            if (count > 0) {
              console.log(`🗑️  Invalidated ${count} cache entries: ${pattern}`);
            }
          }
        }

        return result;
      };

      next();

    } catch (error) {
      console.error('Cache invalidation error:', error.message);
      next();
    }
  };
};

/**
 * Predefined cache durations
 */
export const CACHE_DURATION = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 900,        // 15 minutes
  HOUR: 3600,       // 1 hour
  DAY: 86400        // 24 hours
};

/**
 * Cache key generators for common patterns
 */
export const cacheKeyGenerators = {
  /**
   * Generate key with user ID
   */
  withUser: (req) => {
    const userId = req.userId || req.user?._id || 'anonymous';
    return `cache:user:${userId}:${req.originalUrl || req.url}`;
  },

  /**
   * Generate key with query params
   */
  withQuery: (req) => {
    const queryString = new URLSearchParams(req.query).toString();
    return `cache:${req.path}${queryString ? '?' + queryString : ''}`;
  },

  /**
   * Generate key for parking zones
   */
  parkingZones: (req) => {
    return `cache:parking:zones`;
  },

  /**
   * Generate key for parking spots by zone
   */
  parkingSpots: (req) => {
    const zoneId = req.params.id || req.params.zoneId;
    return `cache:parking:zone:${zoneId}:spots`;
  },

  /**
   * Generate key for user bookings
   */
  userBookings: (req) => {
    const userId = req.userId || req.user?._id;
    return `cache:user:${userId}:bookings`;
  }
};

/**
 * Helper: Clear all cache
 */
export const clearAllCache = async () => {
  try {
    if (!isRedisAvailable()) {
      return 0;
    }

    const count = await cacheOperations.delPattern('cache:*');
    console.log(`🗑️  Cleared ${count} cache entries`);
    return count;
  } catch (error) {
    console.error('Clear cache error:', error.message);
    return 0;
  }
};

/**
 * Helper: Get cache statistics
 */
export const getCacheStats = async () => {
  try {
    if (!isRedisAvailable()) {
      return { available: false };
    }

    const { getRedisClient } = await import('../config/redis.js');
    const client = getRedisClient();
    
    if (!client) {
      return { available: false };
    }

    const info = await client.info('stats');
    const keys = await client.dbSize();

    return {
      available: true,
      totalKeys: keys,
      info: info
    };
  } catch (error) {
    console.error('Cache stats error:', error.message);
    return { available: false, error: error.message };
  }
};

export default cacheMiddleware;
