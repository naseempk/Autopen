import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("Login API Response:", data); 
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        if (data.name) {
          localStorage.setItem("name", data.name);
        } else {
          console.error("Name is missing in API response!");
        }
        setMessage("Login successful!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Error: " + error.message);
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      
      <a href="/" className="absolute top-4 left-4 flex items-center text-[#4F46E5] hover:text-[#4338CA]">
        <IoArrowBack className="mr-2" /> Back to Home
      </a>
      
      
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
            />
          </div>
               
          <button className="w-full bg-[#4F46E5] text-white py-2 rounded-lg font-semibold hover:bg-[#4338CA]">
            Login
          </button>
        </form>   
        
        <div className="mt-4 text-center">
          <button className="w-full flex items-center justify-center border border-[#D1D5DB] py-2 rounded-lg bg-white hover:bg-gray-100">
            <FaGoogle className="mr-2 text-red-500" /> Sign in with Google
          </button>
        </div>
        
        <div className="mt-4 text-center text-sm">
          <a href="#" className="text-[#4F46E5] hover:underline">Forgot Password?</a>
        </div>
        <div className="mt-2 text-center text-sm">
          Don't have an account? <a href="SignupPage" className="text-[#22C55E] font-semibold hover:underline">Sign Up</a>
        </div>

        {message && (
          <p className="text-center mt-2 text-red-500 font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
