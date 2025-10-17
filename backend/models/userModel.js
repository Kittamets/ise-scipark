import mongoose from "mongoose";

// Create Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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

// If user model exists, use the existing one otherwise create new one
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;