import mongoose from "mongoose";

const parkingSpotSchema = new mongoose.Schema({
  spotNumber: {
    type: String,
    required: true,
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingZone",
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "occupied", "reserved"],
    default: "available",
  },
});

// สร้าง Index เพื่อบังคับว่า "ในโซนเดียวกัน ห้ามมีเลขช่องจอดซ้ำกัน"
parkingSpotSchema.index({ zone: 1, spotNumber: 1 }, { unique: true });

const ParkingSpot = mongoose.models.ParkingSpot || mongoose.model("ParkingSpot", parkingSpotSchema);
export default ParkingSpot;