import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const navigate = useNavigate();

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const userData = response.data;
        setUser(userData);

        setFormData({
          name: userData.name,
          bio: userData.bio || "", // fallback if bio is missing
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Only send fields that exist
      const updatePayload = { name: formData.name };
      if (formData.bio) updatePayload.bio = formData.bio;

      const response = await axios.put("/api/user/profile", updatePayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setUser(response.data.user);
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate("/dashboard");

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Go Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            ) : (
              <p>{user.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <p>{user.email}</p>
          </div>

  

          <div className="flex justify-end">
            {isEditing ? (
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
