import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    licensePlate: {
      type: String,
      required: [true, "Please provide a license plate"],
      unique: true,
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Please provide the vehicle brand"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Please provide the vehicle model"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;