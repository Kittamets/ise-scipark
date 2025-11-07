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
    default: null,
  },
  spot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingSpot",
    required: true,
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingZone",
    default: null,
  },
  floor: {
    type: String,
    default: "ชั้น 1",
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {  
    type: Date,
    default: null,
  },
  cost: {
    type: Number,
    default: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "active",
  },
}, { timestamps: true });

// Indexes for faster queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ spot: 1 });
bookingSchema.index({ startTime: -1 });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;