import mongoose from "mongoose";

// Create Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    rank: {
      type: String,
      enum: ["Iron", "Diamond", "Predator"],
      default: "Iron",
    },
    points: {
      type: Number,
      default: 0,
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// If user model exists, use the existing one otherwise create new one
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;