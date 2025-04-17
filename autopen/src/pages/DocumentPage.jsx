import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegFileAlt, FaEdit, FaTrash, FaHome, FaSignOutAlt } from "react-icons/fa"; // Importing icons

const DocumentPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      const userId = localStorage.getItem("userId"); 
      if (!userId) {
        console.error("User ID is missing!");
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/api/drafts/user-drafts/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDrafts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching drafts:", error);
        setLoading(false);
      }
    };
  
    fetchDrafts();
  }, []);

  const handleViewDraft = (draftId) => {
    navigate(`/viewedit/${draftId}`);
  };

  const handleEditDraft = (draftId) => {
    navigate(`/viewedit/${draftId}?edit=true`); 
  };

  const handleDeleteDraft = async (draftId) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
  
    try {
      console.log("Deleting draft:", draftId, "with token:", localStorage.getItem("token"));
      await axios.delete(`http://localhost:5000/api/drafts/delete/${draftId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      setDrafts(drafts.filter((draft) => draft._id !== draftId));
    } catch (error) {
      console.error("Error deleting draft:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header with Back to Dashboard and Logout buttons */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate("/dashboard")} 
          className="flex items-center text-gray-700 hover:text-black"
        >
          <FaHome className="text-2xl mr-2" /> Dashboard
        </button>
        <h1 className="text-3xl font-bold">My Drafts</h1>
        <button 
          onClick={handleLogout} 
          className="flex items-center text-red-500 hover:text-red-700"
        >
          <FaSignOutAlt className="text-2xl mr-2" /> Logout
        </button>
      </div>

      {loading ? (
        <p>Loading drafts...</p>
      ) : drafts.length === 0 ? (
        <p>No drafts available. Start writing your first draft!</p>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div
              key={draft._id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md hover:bg-gray-100"
            >
              <div className="flex items-center space-x-4">
                <FaRegFileAlt className="text-xl text-gray-600" />
                <div>
                  <h2 className="font-semibold text-lg">{draft.title}</h2>
                  <p className="text-gray-500 text-sm truncate w-72">
                    {draft.content.substring(0, 100)}...
                  </p>
                </div>
              </div>

              {/* Action Buttons: View, Edit, Delete */}
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleViewDraft(draft._id)} 
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button 
                  onClick={() => handleEditDraft(draft._id)} 
                  className="p-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDeleteDraft(draft._id)} 
                  className="p-2 bg-white text-black border border-black rounded hover:bg-gray-200"
                >
                  <FaTrash />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentPage;
