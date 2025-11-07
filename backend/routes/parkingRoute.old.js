import express from "express";
import { getAllParkingZones } from "../controllers/parkingZoneController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/zones", userAuth, getAllParkingZones);

export default router;