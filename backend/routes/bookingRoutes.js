import express from "express";
import { createBooking, updateBookingStatus} from "../controllers/bookingController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/", userAuth, createBooking);
router.put("/update", userAuth, updateBookingStatus);

// (ในอนาคตอาจจะมี GET /api/bookings เพื่อดูประวัติการจอง)

export default router;