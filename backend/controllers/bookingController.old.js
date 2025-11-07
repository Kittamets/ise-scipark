import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import ParkingSpot from "../models/parkingSpotModel.js";
import ParkingZone from "../models/parkingZoneModel.js";
import Vehicle from "../models/vehicleModel.js";

/*
    @desc   Create a new booking
    @route  POST /api/bookings
*/
export const createBooking = async (req, res) => {
  // เริ่ม Transaction Session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. รับข้อมูลจาก Client และ Middleware
    const { zoneName, licensePlate } = req.body;

    const licensePlateTrimmed = licensePlate.trim().replace(/\s/g, "");
    const userId = req.userId;
    const zoneId = await ParkingZone.findOne({ zoneName });
    const vehicleId = await Vehicle.findOne({ licensePlate: licensePlateTrimmed, userId });

    if (!zoneId || !vehicleId) {
      throw new Error("Zone and Vehicle are required to make a booking.");
    }

    // ตรวจสอบว่ารถคันนี้ไม่ได้มีการจองที่ active อยู่แล้ว
    const existingBooking = await Booking.findOne({ vehicle: vehicleId, status: 'active' }).session(session);
    if (existingBooking) {
        throw new Error("This vehicle already has an active booking.");
    }

    // 2. ค้นหาช่องจอดที่ว่างในโซนที่ต้องการ (Find)
    const availableSpot = await ParkingSpot.findOne({
      zone: zoneId,
      status: "available",
    }).session(session); // ทุกคำสั่งต้อง .session(session)

    if (!availableSpot) {
      throw new Error("Sorry, this parking zone is currently full.");
    }

    // 3. อัปเดตสถานะช่องจอดเป็น 'reserved' (ถูกจองแล้ว)
    availableSpot.status = "reserved";
    await availableSpot.save({ session });

    // 4. ดึงข้อมูลค่าบริการจาก Zone
    const zoneInfo = await ParkingZone.findById(zoneId).session(session);
    if (!zoneInfo) {
        throw new Error("Parking zone not found.");
    }

    // 5. สร้างใบจอง (Create)
    const newBooking = new Booking({
      user: userId,
      vehicle: vehicleId,
      spot: availableSpot._id,
      zone: zoneId,
      startTime: new Date(),
      status: "pending", // เปลี่ยนสถานะเป็น pending ทันที (ยังไม่ได้จ่ายเงิน)
      totalCost: zoneInfo.bookingRate, // เริ่มต้นด้วยค่าธรรมเนียมการจอง
    });

    await newBooking.save({ session });

    // 6. ถ้าทุกอย่างสำเร็จ ให้ Commit Transaction
    await session.commitTransaction();

    const vehicle = await Vehicle.findById(vehicleId);
    const parkingSpot = await ParkingSpot.findById(availableSpot._id);
    const parkingZone = await ParkingZone.findById(parkingSpot.zone);
    const arrivalTimeDate = new Date(newBooking.startTime.getTime() + 30 * 60000);

    res.status(201).json({
      success: true,
      message: "Booking created successfully!",
      data: {
        "bookingId": newBooking._id,
        "vehicle": {
            "licensePlate": vehicle.licensePlate,
            "brand": vehicle.brand,
            "model": vehicle.model,
        },
        "parking": {
            "zone": parkingZone.zoneName,
            "spotNumber": parkingSpot.spotNumber,
        },
        "fee": parkingZone.bookingRate,
        "startTime": newBooking.startTime,
        "arrivalTime": arrivalTimeDate,
      },
    });

  } catch (error) {
    // 7. หากมีข้อผิดพลาดเกิดขึ้น ให้ Abort Transaction
    await session.abortTransaction();
    res.status(400).json({
      success: false,
      message: "Failed to create booking.",
      error: error.message,
    });
  } finally {
    // 8. ปิด Session เสมอ
    session.endSession();
  }
};

/*
    @desc   Update booking status 
    @route  PUT /api/bookings/update
*/
export const updateBookingStatus = async (req, res) => {
  const { bookingId, status } = req.body;
  const validStatuses = ["active", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      success: false, 
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, message: `Booking status updated to ${status}`, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
