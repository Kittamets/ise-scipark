import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import ParkingSpot from "../models/parkingSpotModel.js";
import ParkingZone from "../models/parkingZoneModel.js";
import Vehicle from "../models/vehicleModel.js";
import bcrypt from "bcryptjs";

/*
    @desc   Get user profile
    @route  GET /api/user/profile
    @access Private
*/
export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลผู้ใช้",
      });
    }

    // Calculate user statistics
    const totalBookings = await Booking.countDocuments({ user: userId });
    const completedBookings = await Booking.countDocuments({
      user: userId,
      status: "completed",
    });
    
    const bookings = await Booking.find({ 
      user: userId, 
      status: "completed" 
    });
    
    let totalSpent = 0;
    let totalSavings = 0;
    
    for (const booking of bookings) {
      totalSpent += booking.cost || 0;
      
      // Calculate potential savings based on rank
      if (user.rank === "Diamond") {
        totalSavings += (booking.cost || 0) * 0.1; // 10% discount
      } else if (user.rank === "Predator") {
        totalSavings += (booking.cost || 0) * 0.2; // 20% discount
      }
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone,
        rank: user.rank,
        points: user.points,
        subscriptionExpiry: user.subscriptionExpiry,
        createdAt: user.createdAt,
      },
      stats: {
        totalBookings,
        completedBookings,
        totalSpent: Math.round(totalSpent),
        totalSavings: Math.round(totalSavings),
        activeBookings: totalBookings - completedBookings,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

/*
    @desc   Update user profile
    @route  PUT /api/user/profile
    @access Private
*/
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }

    // Validate phone number format (Thai phone: 10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง (10 หลัก)",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลผู้ใช้",
      });
    }

    res.status(200).json({
      success: true,
      message: "อัปเดตข้อมูลสำเร็จ",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone,
        rank: user.rank,
        points: user.points,
        subscriptionExpiry: user.subscriptionExpiry,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

/*
    @desc   Change password
    @route  PUT /api/user/change-password
    @access Private
*/
export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกรหัสผ่านเดิมและรหัสผ่านใหม่",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลผู้ใช้",
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "รหัสผ่านเดิมไม่ถูกต้อง",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: "เปลี่ยนรหัสผ่านสำเร็จ",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

/*
    @desc   Get user booking history
    @route  GET /api/user/bookings
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

    const formattedBookings = bookings.map((booking) => ({
      id: booking._id,
      spotNumber: booking.spot?.spotNumber || "N/A",
      spotName: booking.spot?.name || "N/A",
      zoneName: booking.spot?.zone?.zoneName || booking.zoneName || "N/A",
      floor: booking.floor || booking.spot?.floor || "N/A",
      building: booking.spot?.building || booking.spot?.zone?.building || "N/A",
      vehicle: booking.vehicle
        ? {
            licensePlate: booking.vehicle.licensePlate,
            brand: booking.vehicle.brand,
            model: booking.vehicle.model,
          }
        : null,
      startTime: booking.startTime,
      endTime: booking.endTime,
      cost: booking.cost || 0,
      status: booking.status,
      createdAt: booking.createdAt,
    }));

    res.status(200).json({
      success: true,
      bookings: formattedBookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBookings: count,
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
    @desc   Get user statistics
    @route  GET /api/user/stats
    @access Private
*/
export const getUserStats = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("rank points subscriptionExpiry");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลผู้ใช้",
      });
    }

    // Get booking statistics
    const totalBookings = await Booking.countDocuments({ user: userId });
    const activeBookings = await Booking.countDocuments({
      user: userId,
      status: "active",
    });
    const completedBookings = await Booking.countDocuments({
      user: userId,
      status: "completed",
    });

    // Calculate total spent and savings
    const completedBookingsData = await Booking.find({
      user: userId,
      status: "completed",
    });

    let totalSpent = 0;
    let totalSavings = 0;

    for (const booking of completedBookingsData) {
      const cost = booking.cost || 0;
      totalSpent += cost;

      // Calculate savings based on rank
      if (user.rank === "Diamond") {
        totalSavings += cost * 0.1; // 10% discount
      } else if (user.rank === "Predator") {
        totalSavings += cost * 0.2; // 20% discount
      }
    }

    // Get most used zone
    const bookingsByZone = await Booking.aggregate([
      { $match: { user: userId, status: "completed" } },
      {
        $lookup: {
          from: "parkingspots",
          localField: "spot",
          foreignField: "_id",
          as: "spotInfo",
        },
      },
      { $unwind: "$spotInfo" },
      {
        $lookup: {
          from: "parkingzones",
          localField: "spotInfo.zone",
          foreignField: "_id",
          as: "zoneInfo",
        },
      },
      { $unwind: "$zoneInfo" },
      {
        $group: {
          _id: "$zoneInfo.zoneName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const favoriteZone = bookingsByZone.length > 0 ? bookingsByZone[0]._id : null;

    res.status(200).json({
      success: true,
      stats: {
        rank: user.rank,
        points: user.points,
        totalBookings,
        activeBookings,
        completedBookings,
        totalSpent: Math.round(totalSpent),
        totalSavings: Math.round(totalSavings),
        favoriteZone,
        subscriptionActive: user.subscriptionExpiry
          ? new Date(user.subscriptionExpiry) > new Date()
          : false,
        subscriptionExpiry: user.subscriptionExpiry,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};
