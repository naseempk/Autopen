import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String }, // Store the OTP
  otpExpires: { type: Date }, // Store the OTP expiry time
  isVerified: { type: Boolean, default: false }, // Mark user as verified
  createdAt: { type: Date, default: Date.now },

  writingStreak: { type: Number, default: 0 },
  lastWrittenDate: { type: Date },
  wordsWrittenToday: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

export default User;
