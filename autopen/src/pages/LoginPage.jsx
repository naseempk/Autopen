import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom"; // Use Link for navigation
import axios from "axios"; // Use axios for API calls


const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data) {
       
        console.log("Token Received:", response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId); 
        localStorage.setItem("name", response.data.name); 
        localStorage.setItem("email", formData.email); 

        setMessage("Login successful!");

        
        if (formData.email === "admin@autopen.com") {
          setTimeout(() => navigate("/admin-dashboard"), 2000); 
        } else {
          setTimeout(() => navigate("/dashboard"), 2000); 
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage(error.response?.data?.error || "Login failed. Please try again.");
    }finally{
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      {/* Back to Home Button */}
      <Link to="/" className="absolute top-4 left-4 flex items-center text-[#4F46E5] hover:text-[#4338CA]">
        <IoArrowBack className="mr-2" /> Back to Home
      </Link>

      {/* Login Form */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-[#1F2937]">
        <h2 className="text-2xl font-bold text-center">Login to AutoPen</h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#4F46E5] placeholder-[#9CA3AF]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#4F46E5] placeholder-[#9CA3AF]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4F46E5] text-white py-2 rounded-lg font-semibold hover:bg-[#4338CA]"
          >
            Login
          </button>
        </form>

        {/* Google Sign-In Button */}
        <div className="mt-4 text-center">
          <button className="w-full flex items-center justify-center border border-[#D1D5DB] py-2 rounded-lg bg-white hover:bg-gray-100">
            <FaGoogle className="mr-2 text-red-500" /> Sign in with Google
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center text-sm">
          <button
            onClick={handleForgotPassword}
            className="text-[#4F46E5] hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-2 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#22C55E] font-semibold hover:underline">
            Sign Up
          </Link>
        </div>

        {/* Display Message */}
        {message && (
          <p className="text-center mt-2 text-red-500 font-semibold">
            {message}
          </p>
        )}

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-[#4F46E5] border-opacity-75"></div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginPage;
