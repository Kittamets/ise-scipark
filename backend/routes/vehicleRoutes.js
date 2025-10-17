import express from "express";
import { addVehicle, getUserAllVehicles } from "../controllers/vehicleController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/", userAuth, getUserAllVehicles);
router.post("/", userAuth, addVehicle);

export default router;