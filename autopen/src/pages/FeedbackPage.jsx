import { useState } from "react";
import axios from "axios"; // Make sure axios is installed
import { useNavigate } from "react-router-dom"; // Import useNavigate

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState(""); // Feedback input state
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(""); // Message for success or error
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle feedback submission
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setMessage("Feedback cannot be empty.");
      return;
    }
  
    setLoading(true); 
    setMessage(""); 
  
    try {
      
      const response = await axios.post("http://localhost:5000/api/feedback", { feedback });
      if (response.status === 200) {
        setMessage("Feedback submitted successfully!");
        setFeedback(""); // Clear the input
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setMessage("Error submitting feedback. Please try again later.");
    }
    setLoading(false); // Hide loading
  };
  

  // Navigate back to dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard"); // Navigate to the dashboard page
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Submit Your Feedback</h1>
      <form onSubmit={handleSubmitFeedback} className="space-y-4">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here..."
          className="w-full p-4 border rounded-lg"
          rows="6"
        />
        {message && (
          <div
            className={`p-3 rounded-lg text-center ${
              message.includes("successfully") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      {/* Button to go back to the dashboard */}
      <button
        onClick={handleBackToDashboard}
        className="mt-4 w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default FeedbackPage;
