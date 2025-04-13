import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/feedbacks", {
            headers: { Authorization: `Bearer ${token}` },
          });          
          setFeedbacks(response.data);

      } catch (err) {
        console.error("❌ Error fetching feedbacks:", err.response?.data || err);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/feedbacks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
    } catch (err) {
      console.error("❌ Error deleting feedback:", err.response?.data || err);
    }
  };

  const filtered = feedbacks.filter((fb) =>
    fb.feedback.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/admin-dashboard")}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-semibold mb-4">User Feedback</h1>

      <input
        type="text"
        placeholder="Search feedback..."
        className="border px-3 py-2 mb-4 w-full rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white shadow rounded-lg p-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No feedbacks found.</p>
        ) : (
          <ul className="space-y-4">
            {filtered.map((fb) => (
              <li
                key={fb._id}
                className="p-4 border rounded flex justify-between items-start"
              >
                <div>
                  <p className="text-gray-800">{fb.feedback}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(fb.submittedAt).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => handleDelete(fb._id)}>
                  <Trash2 className="text-red-500 hover:text-red-700" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
