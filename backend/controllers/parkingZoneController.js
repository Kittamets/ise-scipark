import ParkingZone from "../models/parkingZoneModel.js";

/*
    @desc   Get all parking zones with selected fields
    @route  GET /api/parking-zones
*/
export const getAllParkingZones = async (req, res) => {
  try {
    const zones = await ParkingZone.find({}).select(
      "zoneName totalSpots hourlyRate bookingRate -_id"
    );

    // ส่งข้อมูลกลับไปให้ client
    res.status(200).json({
      success: true,
      count: zones.length,
      data: zones,
    });

  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: "Server error", 
        error: error.message 
    });
  }
};