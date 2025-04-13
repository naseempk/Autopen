import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AdminSettings() {
  const navigate = useNavigate();

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const handleSendMockEmail = () => {
    console.log("Mock Email Sent To All Users:");
    console.log("Subject:", emailSubject);
    console.log("Message:", emailMessage);
    alert("📨 Mock alert email 'sent' to all users!");
    setShowAlertModal(false);
    setEmailSubject("");
    setEmailMessage("");
  };

  return (
    <div className="p-6">
      {/* Back to Dashboard */}
      <button
        onClick={() => navigate("/admin-dashboard")}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-semibold mb-6">Admin Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-8">

        {/* Maintenance Mode */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Maintenance Mode</h2>
            <p className="text-sm text-gray-500">Temporarily disable site access for users.</p>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={maintenanceMode}
              onChange={() => setMaintenanceMode(!maintenanceMode)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 relative transition-colors">
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
          </label>
        </div>

        {/* Admin Alerts */}
        <div>
          <h2 className="text-lg font-medium mb-2">Send Admin Alert</h2>
          <button
            onClick={() => setShowAlertModal(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Compose Alert Email
          </button>
        </div>
      </div>

      {/* Modal for Email Alert */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
            <button
              onClick={() => setShowAlertModal(false)}
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-black"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Send Alert Email</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter subject"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Message</label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                rows="4"
                placeholder="Enter message"
              />
            </div>

            <button
              onClick={handleSendMockEmail}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
