import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String }, 
  otpExpires: { type: Date }, 
  isVerified: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },

  writingStreak: { type: Number, default: 0 },
  lastWrittenDate: { type: Date },
  wordsWrittenToday: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

export default User;
