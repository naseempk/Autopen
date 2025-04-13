import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Eye } from "lucide-react";

export default function AdminDraftView() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/admin/documents", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDocuments(response.data);
      } catch (error) {
        console.error("❌ Error fetching documents:", error.response?.data || error);
      }
    };

    fetchDocuments();
  }, [navigate]);

  const handleOpen = (docId) => {
    navigate(`/editor/${docId}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/drafts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error("❌ Error deleting draft:", err.response?.data || err);
      alert("Failed to delete draft.");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const title = doc.title?.toLowerCase() || "";
    const email = doc.userId?.email?.toLowerCase() || "";
    return title.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });
  
  

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin-dashboard")}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-semibold mb-6">All User Documents</h1>

      <div className="bg-white p-4 shadow rounded-lg">
      <div className="mb-4">
        <input
    type="text"
    placeholder="Search by title or user email..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="border border-gray-300 rounded px-3 py-2 w-full max-w-sm"
    />
    </div>

        {documents.length === 0 ? (
          <p className="text-gray-500">No documents available.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Title</th>
                <th className="p-2">User Name</th>
                <th className="p-2">User Email</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
            {filteredDocuments.map((doc) => (
                <tr key={doc._id} className="border-b">
                  <td className="p-2">{doc.title || "Untitled"}</td>
                  <td className="p-2">{doc.userId?.name || "Unknown"}</td>
                  <td className="p-2">{doc.userId?.email || "Unknown"}</td>
                  <td className="p-2">{new Date(doc.createdAt).toLocaleString()}</td>
                  <td className="p-2 space-x-2">
                  <button className="text-blue-600 hover:underline" onClick={() => setSelectedDoc(doc)}>
                    Open
                    </button>

                    <button className="text-red-600 hover:underline ml-4" onClick={() => handleDelete(doc._id)}>
                    Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>    
        )}

{selectedDoc && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
      <button
        className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
        onClick={() => setSelectedDoc(null)}
      >
        ×
      </button>
      <h2 className="text-xl font-semibold mb-4">{selectedDoc.title || "Untitled"}</h2>
      <p className="text-gray-600 mb-2"><strong>User:</strong> {selectedDoc.user?.name || "Unknown"} ({selectedDoc.user?.email || "Unknown"})</p>
      <p className="text-sm text-gray-400 mb-4">
        Created At: {new Date(selectedDoc.createdAt).toLocaleString()}
      </p>
      <div className="border p-4 rounded bg-gray-50 overflow-y-auto max-h-[400px] whitespace-pre-wrap">
        {selectedDoc.content}
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
