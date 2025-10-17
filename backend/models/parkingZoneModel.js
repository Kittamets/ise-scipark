import mongoose from "mongoose";

const parkingZoneSchema = new mongoose.Schema({
  zoneName: {
    type: String,
    required: true,
    unique: true, // ชื่อโซนไม่ควรซ้ำกัน
    trim: true,
  },
  totalSpots: {
    type: Number,
    required: true, // จำนวนช่องจอดทั้งหมดในโซนนี้
  },
  // เราจะคำนวณช่องที่ว่างจากการนับใน ParkingSpot แทน
  // availableSpots: Number, 
  hourlyRate: {
    type: Number,
    required: true, // ค่าบริการจอดรายชั่วโมง
    default: 10,
  },
  bookingRate: {
    type: Number,
    required: true, // ค่าธรรมเนียมการจอง
    default: 20,
  },
}, { timestamps: true });

const ParkingZone = mongoose.models.ParkingZone || mongoose.model("ParkingZone", parkingZoneSchema);
export default ParkingZone;