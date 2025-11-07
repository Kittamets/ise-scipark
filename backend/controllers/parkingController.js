import ParkingZone from "../models/parkingZoneModel.js";
import ParkingSpot from "../models/parkingSpotModel.js";

/*
    @desc   Get all parking zones with spot availability
    @route  GET /api/parking/zones
    @access Public
*/
export const getAllZones = async (req, res) => {
  try {
    const zones = await ParkingZone.find({}).select(
      "zoneName name description building totalSpots hourlyRate"
    );

    // Get spot counts for each zone
    const zonesWithAvailability = await Promise.all(
      zones.map(async (zone) => {
        const totalSpots = await ParkingSpot.countDocuments({ zone: zone._id });
        const availableSpots = await ParkingSpot.countDocuments({
          zone: zone._id,
          status: "available",
        });
        const occupiedSpots = await ParkingSpot.countDocuments({
          zone: zone._id,
          status: "occupied",
        });

        return {
          id: zone._id,
          zoneName: zone.zoneName,
          name: zone.name,
          description: zone.description,
          building: zone.building,
          totalSpots,
          availableSpots,
          occupiedSpots,
          hourlyRate: zone.hourlyRate,
          occupancyRate: totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: zonesWithAvailability.length,
      zones: zonesWithAvailability,
    });
  } catch (error) {
    console.error("Get all zones error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

/*
    @desc   Get zone details with all spots
    @route  GET /api/parking/zones/:id
    @access Public
*/
export const getZoneById = async (req, res) => {
  try {
    const { id } = req.params;

    const zone = await ParkingZone.findById(id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบโซนจอดรถ",
      });
    }

    const spots = await ParkingSpot.find({ zone: id }).sort({ spotNumber: 1 });

    const totalSpots = spots.length;
    const availableSpots = spots.filter((s) => s.status === "available").length;
    const occupiedSpots = spots.filter((s) => s.status === "occupied").length;

    res.status(200).json({
      success: true,
      zone: {
        id: zone._id,
        zoneName: zone.zoneName,
        name: zone.name,
        description: zone.description,
        building: zone.building,
        totalSpots,
        availableSpots,
        occupiedSpots,
        hourlyRate: zone.hourlyRate,
        occupancyRate: totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0,
      },
      spots: spots.map((spot) => ({
        id: spot._id,
        spotNumber: spot.spotNumber,
        name: spot.name,
        floor: spot.floor,
        building: spot.building,
        status: spot.status,
        pricePerHour: spot.pricePerHour,
        facilities: spot.facilities,
      })),
    });
  } catch (error) {
    console.error("Get zone by ID error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

/*
    @desc   Get all parking spots
    @route  GET /api/parking/spots
    @access Public
*/
export const getAllSpots = async (req, res) => {
  try {
    const { zoneId, status, floor, building } = req.query;

    const query = {};
    if (zoneId) query.zone = zoneId;
    if (status) query.status = status;
    if (floor) query.floor = floor;
    if (building) query.building = building;

    const spots = await ParkingSpot.find(query)
      .populate("zone", "zoneName name building hourlyRate")
      .sort({ spotNumber: 1 });

    const formattedSpots = spots.map((spot) => ({
      id: spot._id,
      spotNumber: spot.spotNumber,
      name: spot.name,
      floor: spot.floor,
      building: spot.building,
      status: spot.status,
      pricePerHour: spot.pricePerHour,
      facilities: spot.facilities,
      zone: {
        id: spot.zone._id,
        zoneName: spot.zone.zoneName,
        name: spot.zone.name,
        building: spot.zone.building,
      },
    }));

    res.status(200).json({
      success: true,
      count: formattedSpots.length,
      spots: formattedSpots,
    });
  } catch (error) {
    console.error("Get all spots error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

/*
    @desc   Get spot by ID
    @route  GET /api/parking/spots/:id
    @access Public
*/
export const getSpotById = async (req, res) => {
  try {
    const { id } = req.params;

    const spot = await ParkingSpot.findById(id).populate(
      "zone",
      "zoneName name description building hourlyRate"
    );

    if (!spot) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบช่องจอดรถ",
      });
    }

    res.status(200).json({
      success: true,
      spot: {
        id: spot._id,
        spotNumber: spot.spotNumber,
        name: spot.name,
        floor: spot.floor,
        building: spot.building,
        status: spot.status,
        pricePerHour: spot.pricePerHour,
        facilities: spot.facilities,
        zone: {
          id: spot.zone._id,
          zoneName: spot.zone.zoneName,
          name: spot.zone.name,
          description: spot.zone.description,
          building: spot.zone.building,
          hourlyRate: spot.zone.hourlyRate,
        },
      },
    });
  } catch (error) {
    console.error("Get spot by ID error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

/*
    @desc   Update parking spot status
    @route  PUT /api/parking/spots/:id/status
    @access Private (Admin)
*/
export const updateSpotStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["available", "occupied", "reserved", "unavailable"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `สถานะไม่ถูกต้อง ต้องเป็น: ${validStatuses.join(", ")}`,
      });
    }

    const spot = await ParkingSpot.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!spot) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบช่องจอดรถ",
      });
    }

    res.status(200).json({
      success: true,
      message: `อัปเดตสถานะเป็น ${status} สำเร็จ`,
      spot,
    });
  } catch (error) {
    console.error("Update spot status error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

/*
    @desc   Get parking statistics
    @route  GET /api/parking/stats
    @access Public
*/
export const getParkingStats = async (req, res) => {
  try {
    const totalZones = await ParkingZone.countDocuments();
    const totalSpots = await ParkingSpot.countDocuments();
    const availableSpots = await ParkingSpot.countDocuments({ status: "available" });
    const occupiedSpots = await ParkingSpot.countDocuments({ status: "occupied" });
    const reservedSpots = await ParkingSpot.countDocuments({ status: "reserved" });

    res.status(200).json({
      success: true,
      stats: {
        totalZones,
        totalSpots,
        availableSpots,
        occupiedSpots,
        reservedSpots,
        occupancyRate: totalSpots > 0 ? Math.round((occupiedSpots / totalSpots) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Get parking stats error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

// Legacy function for compatibility
export const updateSpotByNumber = async (req, res) => {
  try {
    const { newStatus, spotNumber } = req.body;

    if (!spotNumber || !newStatus) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุหมายเลขช่องจอดและสถานะใหม่",
      });
    }

    const validStatuses = ["available", "occupied", "reserved", "unavailable"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `สถานะไม่ถูกต้อง ต้องเป็น: ${validStatuses.join(", ")}`,
      });
    }

    const updatedSpot = await ParkingSpot.findOneAndUpdate(
      { spotNumber: spotNumber },
      { status: newStatus },
      { new: true }
    );

    if (!updatedSpot) {
      return res.status(404).json({
        success: false,
        message: `ไม่พบช่องจอด '${spotNumber}'`,
      });
    }

    res.status(200).json({
      success: true,
      message: `อัปเดตสถานะช่องจอด '${spotNumber}' เป็น '${newStatus}' สำเร็จ`,
      data: updatedSpot,
    });
  } catch (error) {
    console.error("Update spot by number error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};

// Keep legacy function name
export const getAllParkingZones = getAllZones;
