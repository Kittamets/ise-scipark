import ParkingSpot from "../models/parkingSpotModel.js";

/*
    @desc   Update parking spot status directly by its spot number
    @route  PUT /api/spots/update-by-number
*/
export const updateSpotByNumber = async (req, res) => {
  try {
    // 1. รับข้อมูลจาก body
    const { newStatus, spotNumber } = req.body;

    if (!spotNumber || !newStatus) {
      return res.status(400).json({ 
        success: false, 
        message: "Spot number and new status are required." 
      });
    }

    // ตรวจสอบว่า status ที่ส่งมาถูกต้อง
    const validStatuses = ["available", "occupied", "reserved", "unavailable"];
    if (!validStatuses.includes(newStatus)) {
        return res.status(400).json({ 
            success: false, 
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
    }

    // 2. ค้นหาและอัปเดตช่องจอดในขั้นตอนเดียวด้วย findOneAndUpdate
    // เราสมมติว่า spotNumber (เช่น "A01", "B15") นั้นไม่ซ้ำกันในระบบ
    const updatedSpot = await ParkingSpot.findOneAndUpdate(
      { spotNumber: spotNumber }, // เงื่อนไขการค้นหา: หาจาก spotNumber
      { status: newStatus },      // ข้อมูลใหม่: อัปเดต status
      { new: true }               // Option: เพื่อให้ return document ที่อัปเดตแล้วกลับมา
    );

    // 3. ตรวจสอบว่าหาช่องจอดเจอและอัปเดตสำเร็จหรือไม่
    if (!updatedSpot) {
        return res.status(404).json({
            success: false,
            message: `Parking spot with number '${spotNumber}' not found.`
        })
    }

    // 4. ส่งผลลัพธ์กลับไป
    res.status(200).json({
      success: true,
      message: `Spot '${spotNumber}' status updated to '${newStatus}' successfully.`,
      data: updatedSpot,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating spot status.",
      error: error.message,
    });
  }
};