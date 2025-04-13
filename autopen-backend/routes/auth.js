import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import User from "../models/User.js";

const router = express.Router();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 📌 Route to send OTP for signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

    if (existingUser) {
      // Update existing user with new OTP
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
      console.log("Updated OTP for existing user:", existingUser);
    } else {
      // Create new user with OTP
      const newUser = new User({ name, email: normalizedEmail, password, otp, otpExpires });
      await newUser.save();
      console.log("Created new user with OTP:", newUser);
    }

    // Send OTP email
    const msg = {
      to: normalizedEmail,
      from: process.env.EMAIL_USER,
      subject: "OTP Verification",
      text: `Your OTP code is ${otp}. It is valid for 15 minutes.`,
    };

    await sgMail.send(msg);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// 📌 Route to verify OTP & register user
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    console.log("OTP Verification Request Body:", req.body);

    if (!email || !otp || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ error: "User not found. Please sign up first." });
    }


    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// 📌 Route to log in user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email }, // ✅ Include email here
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    

    res.status(200).json({ 
      token, 
      userId: user._id, // Send userId in the response
      name: user.name, 
      message: "Login successful! Redirecting..." 
    });
    
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

export default router;