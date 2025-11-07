import express from "express";
import {
  createBooking,
  getActiveBooking,
  completeBooking,
  cancelBooking,
  getBookingHistory,
  updateBookingStatus,
} from "../controllers/bookingControllerNew.js";
import { authenticateUser } from "../middleware/userAuth.js";

const router = express.Router();

// All booking routes require authentication
router.use(authenticateUser);

// Create new booking
router.post("/", createBooking);

// Get active booking
router.get("/active", getActiveBooking);

// Get booking history
router.get("/history", getBookingHistory);

// Complete booking
router.put("/:id/complete", completeBooking);

// Cancel booking
router.delete("/:id", cancelBooking);

// Update booking status (legacy - admin function)
router.put("/update", updateBookingStatus);

export default router;
