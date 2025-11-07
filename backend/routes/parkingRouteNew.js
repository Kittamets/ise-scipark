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
} from "../controllers/parkingControllerNew.js";

const router = express.Router();

// Zone routes (public)
router.get("/zones", getAllZones);
router.get("/zones/:id", getZoneById);

// Spot routes (public)
router.get("/spots", getAllSpots);
router.get("/spots/:id", getSpotById);

// Stats route (public)
router.get("/stats", getParkingStats);

// Admin routes (should add auth middleware in production)
router.put("/spots/:id/status", updateSpotStatus);

// Legacy routes for compatibility
router.get("/parking-zones", getAllParkingZones);
router.put("/spots/update-by-number", updateSpotByNumber);

export default router;
