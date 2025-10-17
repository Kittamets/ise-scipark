import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingSpot",
    required: true,
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingZone",
    required: true,
  },
  startTime: {
    type: Date, // เวลาที่เริ่มจอง
    required: true,
  },
  endTime: {  
    type: Date, // เวลาที่การจองสิ้นสุด (จะอัปเดตตอนรถเข้าจอด)
  },
  totalCost: {
    type: Number, // ค่าใช้จ่ายทั้งหมด
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"], // สถานะการจอง
    default: "",
  },
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;