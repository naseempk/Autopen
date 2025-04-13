import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "otp") setOtp(value);
    if (name === "newPassword") setNewPassword(value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("OTP sent to your email!");
        setStep(2);
      } else {
        setMessage(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      setMessage("Error: " + error.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("OTP verified successfully!");
        setStep(3);
      } else {
        setMessage(data.error || "Invalid or expired OTP");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      setMessage("Error: " + error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset Password error:", error);
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <a href="/" className="absolute top-4 left-4 flex items-center text-[#4F46E5] hover:text-[#4338CA]">
        <IoArrowBack className="mr-2" /> Back to Home
      </a>

      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-[#1F2937]">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

        {step === 1 && (
          <form className="mt-6" onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#4F46E5] placeholder-[#9CA3AF]"
              />
            </div>
            <button className="w-full bg-[#4F46E5] text-white py-2 rounded-lg font-semibold hover:bg-[#4338CA]">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="mt-6" onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label className="block text-sm font-medium">OTP</label>
              <input
                type="text"
                name="otp"
                placeholder="Enter the OTP"
                value={otp}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#4F46E5] placeholder-[#9CA3AF]"
              />
            </div>
            <button className="w-full bg-[#4F46E5] text-white py-2 rounded-lg font-semibold hover:bg-[#4338CA]">
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="mt-6" onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#4F46E5] placeholder-[#9CA3AF]"
              />
            </div>
            <button className="w-full bg-[#4F46E5] text-white py-2 rounded-lg font-semibold hover:bg-[#4338CA]">
              Reset Password
            </button>
          </form>
        )}

        {message && (
          <p className="text-center mt-2 text-red-500 font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;