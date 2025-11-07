import mongoose from "mongoose";

const parkingZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  zoneName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  building: {
    type: String,
    default: "",
  },
  totalSpots: {
    type: Number,
    required: true,
  },
  hourlyRate: {
    type: Number,
    default: 20,
  },
  bookingRate: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

parkingZoneSchema.index({ zoneName: 1 });

const ParkingZone = mongoose.models.ParkingZone || mongoose.model("ParkingZone", parkingZoneSchema);
export default ParkingZone;