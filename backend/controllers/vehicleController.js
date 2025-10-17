import Vehicle from "../models/vehicleModel.js";
import User from "../models/userModel.js";

/*
    @desc    Add a new vehicle for the logged-in user
    @route   POST /api/vehicles
*/
export const addVehicle = async (req, res) => {
  try {
    const { licensePlate, brand, model } = req.body;
    
    // ดึง userId จาก middleware
    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    // ตรวจสอบข้อมูลเกี่ยวกับรถว่าส่งมาครบไหม
    if (!licensePlate || !brand || !model) {
      return res.status(400).json({ success: false, message: "Please provide all vehicle details" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ตรวจสอบคนนี้มีรถที่มีป้ายทะเบียนนี้อยู่แล้วหรือไม่ ถ้ามีแล้วจะไม่สามารถลงทะเบียนซ้ำได้
    const existingVehicle = await Vehicle.findOne({ licensePlate, userId: user._id });
    if (existingVehicle) {
      return res.status(409).json({ success: false, message: "This license plate is already registered" });
    }

    const licensePlateTrimmed = licensePlate.trim().replace(/\s/g, "");

    // เพิ่มข้อมูลรถคันใหม่
    const newVehicle = new Vehicle({
      licensePlate: licensePlateTrimmed,
      brand,
      model,
      userId: user._id,
    });

    await newVehicle.save();


    res.status(201).json({ success: true, message: "Vehicle added successfully", data: {
      "licensePlate": newVehicle.licensePlate,
      "brand": newVehicle.brand,
      "model": newVehicle.model
    } });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/*
    @desc    Get all vehicles for the logged-in user
    @route   GET /api/vehicles
*/
export const getUserAllVehicles = async (req, res) => {
    try {
        // ดึง userId จาก middleware
        const userId = req.userId;
        if (!userId) {
        return res
            .status(400)
            .json({ success: false, message: "Unauthorized" });
        }

        // ค้นหาผู้ใช้จากฐานข้อมูล
        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // ค้นหารถทุกคันของผู้ใช้
        const vehicles = await Vehicle.find({ userId: user._id }).select("licensePlate brand model -_id");

        res.status(200).json({ success: true, count: vehicles.length, data: vehicles });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}