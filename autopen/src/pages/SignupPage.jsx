import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Signup successful!");
        setTimeout(() => navigate("/login"), 2000); // Redirect after success
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="text-[#4F46E5] hover:text-indigo-700 flex items-center mb-4"
        >
          ← Back to Home
        </button>

        {/* Signup Title */}
        <h2 className="text-2xl font-semibold text-[#1F2937] text-center">
          Create an Account
        </h2>

        {/* Signup Form */}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#4F46E5] placeholder-[#9CA3AF]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#4F46E5] placeholder-[#9CA3AF]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#4F46E5] placeholder-[#9CA3AF]"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#4F46E5] placeholder-[#9CA3AF]"
            required
          />

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-[#4F46E5] text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </form>

        {/* Sign up with Google */}
        <div className="mt-4">
          <button className="w-full border border-[#D1D5DB] py-2 rounded-md flex items-center justify-center gap-2">
            <FaGoogle className="mr-2 text-red-500" />
            Sign up with Google
          </button>
        </div>

        {/* Links Below Form */}
        <p className="text-center mt-4 text-[#1F2937]">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#22C55E] hover:text-green-700 font-semibold"
          >
            Login
          </button>
        </p>

        {/* Display Message */}
        {message && (
          <p className="text-center mt-2 text-red-500 font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
