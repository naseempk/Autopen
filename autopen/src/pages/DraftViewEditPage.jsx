import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa"; // Import icons

const DraftViewEditPage = () => {
  const { draftId } = useParams();
  const [searchParams] = useSearchParams();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(searchParams.get("edit") === "true");
  const [editedContent, setEditedContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/drafts/${draftId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDraft(response.data);
        setEditedContent(response.data.content); // Initialize edited content
        setLoading(false);
      } catch (error) {
        console.error("Error fetching draft:", error);
        setLoading(false);
      }
    };

    fetchDraft();
  }, [draftId]);

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/drafts/save-draft`, 
        {
          title: draft.title, 
          content: editedContent,
          aiGeneratedContent: draft.aiGeneratedContent || "", 
          grammarErrors: draft.grammarErrors || [],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,  
          },
        }
      );
      alert("Draft saved successfully!");
      setDraft(response.data.draft);  
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    }
  };
  

  if (loading) return <p>Loading draft...</p>;
  if (!draft) return <p>Draft not found.</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/documents")} // Adjust the path if needed
          className="flex items-center text-gray-700 hover:text-black"
        >
          <FaArrowLeft className="text-xl mr-2" /> Back to Documents
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold">
          {editMode ? "Edit Draft" : "View Draft"}
        </h1>
      </div>

      {/* Draft Content */}
      {editMode ? (
        <div>
          <textarea
            className="w-full h-80 p-4 border rounded mb-4"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          {/* Save Button in Edit Mode */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <FaSave className="mr-2" /> Save
          </button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">{draft.title}</h2>
          <p className="mt-2 text-gray-700 whitespace-pre-wrap">{draft.content}</p>
        </div>
      )}
    </div>
  );
};

export default DraftViewEditPage;
