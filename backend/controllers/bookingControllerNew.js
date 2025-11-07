import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import ParkingSpot from "../models/parkingSpotModel.js";
import ParkingZone from "../models/parkingZoneModel.js";
import Vehicle from "../models/vehicleModel.js";
import User from "../models/userModel.js";

/*
    @desc   Create a new booking
    @route  POST /api/bookings
    @access Private
*/
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { spotId, vehicleId } = req.body;
    const userId = req.userId;

    if (!spotId) {
      throw new Error("กรุณาเลือกช่องจอดรถ");
    }

    // Get user data
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error("ไม่พบข้อมูลผู้ใช้");
    }

    // Check for existing active booking
    const existingBooking = await Booking.findOne({
      user: userId,
      status: "active",
    }).session(session);

    if (existingBooking) {
      throw new Error("คุณมีการจองที่ใช้งานอยู่แล้ว กรุณาปิดการจองก่อนทำรายการใหม่");
    }

    // Find the parking spot
    const spot = await ParkingSpot.findById(spotId)
      .populate("zone")
      .session(session);

    if (!spot) {
      throw new Error("ไม่พบช่องจอดรถ");
    }

    if (spot.status !== "available") {
      throw new Error("ช่องจอดรถนี้ไม่ว่างในขณะนี้");
    }

    // Get vehicle if provided
    let vehicle = null;
    if (vehicleId) {
      vehicle = await Vehicle.findOne({
        _id: vehicleId,
        userId: userId,
      }).session(session);

      if (!vehicle) {
        throw new Error("ไม่พบข้อมูลรถยนต์");
      }
    }

    // Update spot status to occupied
    spot.status = "occupied";
    await spot.save({ session });

    // Create new booking
    const newBooking = new Booking({
      user: userId,
      vehicle: vehicleId || null,
      spot: spotId,
      zone: spot.zone._id,
      zoneName: spot.zone.zoneName,
      floor: spot.floor,
      startTime: new Date(),
      status: "active",
      cost: 0, // Will be calculated when booking ends
    });

    await newBooking.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Prepare response
    const responseData = {
      bookingId: newBooking._id,
      spot: {
        id: spot._id,
        spotNumber: spot.spotNumber,
        name: spot.name,
        floor: spot.floor,
        building: spot.building,
      },
      zone: {
        id: spot.zone._id,
        name: spot.zone.zoneName,
        building: spot.zone.building,
      },
      vehicle: vehicle
        ? {
            licensePlate: vehicle.licensePlate,
            brand: vehicle.brand,
            model: vehicle.model,
          }
        : null,
      startTime: newBooking.startTime,
      status: newBooking.status,
      pricePerHour: spot.pricePerHour,
    };

    res.status(201).json({
      success: true,
      message: "สร้างการจองสำเร็จ",
      data: responseData,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Create booking error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "ไม่สามารถสร้างการจองได้",
    });
  } finally {
    session.endSession();
  }
};

/*
    @desc   Get active booking for current user
    @route  GET /api/bookings/active
    @access Private
*/
export const getActiveBooking = async (req, res) => {
  try {
    const userId = req.userId;

    const booking = await Booking.findOne({
      user: userId,
      status: "active",
    })
      .populate({
        path: "spot",
        select: "spotNumber name floor building pricePerHour facilities",
        populate: {
          path: "zone",
          select: "zoneName name building",
        },
      })
      .populate("vehicle", "licensePlate brand model");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบการจองที่ใช้งานอยู่",
      });
    }

    // Calculate current duration and estimated cost
    const now = new Date();
    const durationMs = now - booking.startTime;
    const durationHours = durationMs / (1000 * 60 * 60);

    const user = await User.findById(userId);
    let pricePerHour = booking.spot?.pricePerHour || 20;

    // Apply rank discount
    let discount = 0;
    if (user.rank === "Diamond") {
      discount = 0.1; // 10%
    } else if (user.rank === "Predator") {
      discount = 0.2; // 20%
    }

    // First hour free
    const chargeableHours = Math.max(0, durationHours - 1);
    const estimatedCost = Math.ceil(chargeableHours * pricePerHour * (1 - discount));

    const responseData = {
      bookingId: booking._id,
      spot: {
        spotNumber: booking.spot?.spotNumber || "N/A",
        name: booking.spot?.name || "N/A",
        floor: booking.floor || booking.spot?.floor || "N/A",
        building: booking.spot?.building || "N/A",
        facilities: booking.spot?.facilities || [],
      },
      zone: {
        name: booking.spot?.zone?.zoneName || booking.zoneName || "N/A",
        building: booking.spot?.zone?.building || "N/A",
      },
      vehicle: booking.vehicle
        ? {
            licensePlate: booking.vehicle.licensePlate,
            brand: booking.vehicle.brand,
            model: booking.vehicle.model,
          }
        : null,
      startTime: booking.startTime,
      duration: {
        hours: Math.floor(durationHours),
        minutes: Math.floor((durationHours % 1) * 60),
      },
      pricing: {
        pricePerHour,
        discount: Math.round(discount * 100),
        estimatedCost,
      },
      status: booking.status,
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Get active booking error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

/*
    @desc   Complete/End a booking
    @route  PUT /api/bookings/:id/complete
    @access Private
*/
export const completeBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.userId;

    const booking = await Booking.findOne({
      _id: id,
      user: userId,
      status: "active",
    })
      .populate("spot")
      .session(session);

    if (!booking) {
      throw new Error("ไม่พบการจองที่ใช้งานอยู่");
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error("ไม่พบข้อมูลผู้ใช้");
    }

    // Calculate cost
    const endTime = new Date();
    const durationMs = endTime - booking.startTime;
    const durationHours = durationMs / (1000 * 60 * 60);

    let pricePerHour = booking.spot?.pricePerHour || 20;

    // Apply rank discount
    let discount = 0;
    let pointsEarned = 0;

    if (user.rank === "Diamond") {
      discount = 0.1; // 10%
      pointsEarned = Math.floor(durationHours * 5); // 5 points per hour
    } else if (user.rank === "Predator") {
      discount = 0.2; // 20%
      pointsEarned = Math.floor(durationHours * 10); // 10 points per hour
    } else {
      pointsEarned = Math.floor(durationHours * 2); // 2 points per hour for Iron
    }

    // First hour free
    const chargeableHours = Math.max(0, durationHours - 1);
    const cost = Math.ceil(chargeableHours * pricePerHour * (1 - discount));

    // Update booking
    booking.endTime = endTime;
    booking.cost = cost;
    booking.status = "completed";
    await booking.save({ session });

    // Free up the parking spot
    if (booking.spot) {
      booking.spot.status = "available";
      await booking.spot.save({ session });
    }

    // Award points to user
    user.points += pointsEarned;
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "ปิดการจองสำเร็จ",
      data: {
        bookingId: booking._id,
        duration: {
          hours: Math.floor(durationHours),
          minutes: Math.floor((durationHours % 1) * 60),
        },
        cost,
        pointsEarned,
        totalPoints: user.points,
        discount: Math.round(discount * 100),
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Complete booking error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "ไม่สามารถปิดการจองได้",
    });
  } finally {
    session.endSession();
  }
};

/*
    @desc   Cancel a booking
    @route  DELETE /api/bookings/:id
    @access Private
*/
export const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.userId;

    const booking = await Booking.findOne({
      _id: id,
      user: userId,
      status: "active",
    })
      .populate("spot")
      .session(session);

    if (!booking) {
      throw new Error("ไม่พบการจองที่ใช้งานอยู่");
    }

    // Update booking status
    booking.status = "cancelled";
    booking.endTime = new Date();
    await booking.save({ session });

    // Free up the parking spot
    if (booking.spot) {
      booking.spot.status = "available";
      await booking.spot.save({ session });
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "ยกเลิกการจองสำเร็จ",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Cancel booking error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "ไม่สามารถยกเลิกการจองได้",
    });
  } finally {
    session.endSession();
  }
};

/*
    @desc   Get booking history
    @route  GET /api/bookings/history
    @access Private
*/
export const getBookingHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate({
        path: "spot",
        select: "spotNumber name floor building",
        populate: {
          path: "zone",
          select: "zoneName name building",
        },
      })
      .populate("vehicle", "licensePlate brand model")
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    const formattedBookings = bookings.map((booking) => {
      const durationMs = booking.endTime
        ? booking.endTime - booking.startTime
        : new Date() - booking.startTime;
      const durationHours = durationMs / (1000 * 60 * 60);

      return {
        id: booking._id,
        spot: {
          spotNumber: booking.spot?.spotNumber || "N/A",
          name: booking.spot?.name || "N/A",
          floor: booking.floor || booking.spot?.floor || "N/A",
          building: booking.spot?.building || "N/A",
        },
        zone: {
          name: booking.spot?.zone?.zoneName || booking.zoneName || "N/A",
          building: booking.spot?.zone?.building || "N/A",
        },
        vehicle: booking.vehicle
          ? {
              licensePlate: booking.vehicle.licensePlate,
              brand: booking.vehicle.brand,
              model: booking.vehicle.model,
            }
          : null,
        startTime: booking.startTime,
        endTime: booking.endTime,
        duration: {
          hours: Math.floor(durationHours),
          minutes: Math.floor((durationHours % 1) * 60),
        },
        cost: booking.cost || 0,
        status: booking.status,
      };
    });

    res.status(200).json({
      success: true,
      bookings: formattedBookings,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalBookings: count,
      },
    });
  } catch (error) {
    console.error("Get booking history error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

/*
    @desc   Update booking status (admin function - keeping for compatibility)
    @route  PUT /api/bookings/update
    @access Private
*/
export const updateBookingStatus = async (req, res) => {
  const { bookingId, status } = req.body;
  const validStatuses = ["active", "completed", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `สถานะไม่ถูกต้อง ต้องเป็น: ${validStatuses.join(", ")}`,
    });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบการจอง",
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `อัปเดตสถานะเป็น ${status} สำเร็จ`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};
