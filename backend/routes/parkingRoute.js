import express from "express";
import {
  getAllZones,
  getZoneById,
  getAllSpots,
  getSpotById,
  updateSpotStatus,
  getParkingStats,
  updateSpotByNumber,
  getAllParkingZones,
} from "../controllers/parkingController.js";
import { cacheMiddleware, invalidateCacheMiddleware, CACHE_DURATION } from "../middleware/cache.js";

const router = express.Router();

// Zone routes (public) - Cache for 5 minutes
router.get("/zones", cacheMiddleware(CACHE_DURATION.MEDIUM), getAllZones);
router.get("/zones/:id", cacheMiddleware(CACHE_DURATION.MEDIUM), getZoneById);

// Spot routes (public) - Cache for 1 minute (frequent updates)
router.get("/spots", cacheMiddleware(CACHE_DURATION.SHORT), getAllSpots);
router.get("/spots/:id", cacheMiddleware(CACHE_DURATION.SHORT), getSpotById);

// Stats route (public) - Cache for 1 minute
router.get("/stats", cacheMiddleware(CACHE_DURATION.SHORT), getParkingStats);

// Admin routes (should add auth middleware in production)
// Invalidate cache when spot status changes
router.put("/spots/:id/status", 
  invalidateCacheMiddleware(['cache:parking:*', 'cache:*:spots']),
  updateSpotStatus
);

// Legacy routes for compatibility
router.get("/parking-zones", getAllParkingZones);
router.put("/spots/update-by-number", updateSpotByNumber);

export default router;
