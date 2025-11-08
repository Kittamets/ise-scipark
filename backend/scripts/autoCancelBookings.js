/**
 * Auto-Cancel Bookings Script
 * ยกเลิกการจองที่ไม่เข้าจอดภายใน 30 นาที
 * 
 * ตาม Requirements: "ต้องเข้าจอดภายใน 30 นาที หลังทำการจอง
 * ไม่งั้นระบบจะยกเลิกการจองอัตโนมัติ"
 */

import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import ParkingSpot from "../models/parkingSpotModel.js";
import dotenv from "dotenv";

dotenv.config();

// เชื่อมต่อ MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Auto-Cancel Job");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

/**
 * ยกเลิกการจองที่เกิน 30 นาที
 */
export const autoCancelExpiredBookings = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    // หาการจองที่:
    // 1. status = "pending" หรือ "active"
    // 2. สร้างมากกว่า 30 นาทีแล้ว
    // 3. ยังไม่มี endTime (ยังไม่ได้เข้าจอด)
    const expiredBookings = await Booking.find({
      status: { $in: ["pending", "active"] },
      startTime: { $lt: thirtyMinutesAgo },
      endTime: null,
    })
      .populate("spot")
      .session(session);

    if (expiredBookings.length === 0) {
      console.log("✅ No expired bookings to cancel");
      await session.commitTransaction();
      return {
        success: true,
        cancelledCount: 0,
        message: "No expired bookings found",
      };
    }

    console.log(`⚠️  Found ${expiredBookings.length} expired booking(s)`);

    let cancelledCount = 0;

    for (const booking of expiredBookings) {
      // ยกเลิกการจอง
      booking.status = "cancelled";
      booking.endTime = now;
      booking.cost = 0; // ไม่มีค่าใช้จ่าย (No-show)
      booking.totalCost = 0;
      await booking.save({ session });

      // ปลดล็อคที่จอด
      if (booking.spot) {
        booking.spot.status = "available";
        await booking.spot.save({ session });
        console.log(`   ✓ Spot ${booking.spot.spotNumber} released`);
      }

      console.log(`   ✓ Booking ${booking._id} cancelled (No-show)`);
      cancelledCount++;
    }

    await session.commitTransaction();

    console.log(`✅ Successfully cancelled ${cancelledCount} booking(s)`);

    return {
      success: true,
      cancelledCount,
      message: `Cancelled ${cancelledCount} expired booking(s)`,
    };
  } catch (error) {
    await session.abortTransaction();
    console.error("❌ Auto-cancel error:", error);
    return {
      success: false,
      error: error.message,
    };
  } finally {
    session.endSession();
  }
};

/**
 * Run as standalone script
 */
const runJob = async () => {
  console.log("\n🔄 Starting Auto-Cancel Job...");
  console.log("⏰ Time:", new Date().toLocaleString("th-TH"));
  console.log("━".repeat(50));

  await connectDB();
  const result = await autoCancelExpiredBookings();

  console.log("━".repeat(50));
  console.log("Result:", result);
  console.log("\n✅ Job completed\n");

  await mongoose.connection.close();
  process.exit(0);
};

// เรียกใช้ script
if (import.meta.url === `file://${process.argv[1]}`) {
  runJob();
}

export default autoCancelExpiredBookings;
