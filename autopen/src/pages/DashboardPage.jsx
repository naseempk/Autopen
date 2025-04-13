import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, FileText, Settings, LogOut, PenTool, Sparkles } from "lucide-react";
import axios from "axios";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [progress, setProgress] = useState({
    streak: 0,
    dailyGoal: 500,
    wordsWrittenToday: 0,
  });

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/user/writing-progress", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const { writingStreak, dailyWordGoal, dailyWordCount } = response.data;
  
        setProgress({
          streak: writingStreak || 0,
          dailyGoal: dailyWordGoal || 500,
          wordsWrittenToday: dailyWordCount || 0,
        });
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };
  
    fetchProgress();
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleStartWriting = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not authenticated. Please log in to save drafts.");
      navigate("/login");
    } else {
      navigate("/editor");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white p-6 shadow-lg">
        <nav className="space-y-4">
          <SidebarLink to="/dashboard" icon={<Home />} text="Dashboard" />
          <SidebarLink to="/editor" icon={<PenTool />} text="New Project" />
          <SidebarLink to="/documents" icon={<FileText />} text="My Documents" />
          <SidebarLink to="/feedback" icon={<Sparkles />} text="Feedback" />
          <SidebarLink to="/settings" icon={<Settings />} text="Settings" />
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-left hover:bg-red-100 text-red-600 rounded"
          >
            <LogOut className="mr-2" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <section className="mb-6">
          <h1 className="text-2xl font-semibold">👋 Welcome Back, {userName || "User"}!</h1>
          <p className="text-gray-600 italic">"Creativity is intelligence having fun." — Albert Einstein</p>
          <button
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
            onClick={handleStartWriting}
          >
            Start Writing
          </button>
        </section>
        <section className="mt-6 space-y-6">
          {/* Writing Streak & Progress Tracker */}
          <div className="p-6 bg-white shadow-sm rounded-lg">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              🔥 <span>{progress.streak}-Day Writing Streak!</span>
            </h2>
            <div className="mt-4">
              <p className="text-gray-700">
                🎯 Daily Goal: <strong>{progress.dailyGoal} words</strong>
              </p>
              <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (progress.wordsWrittenToday / progress.dailyGoal) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="mt-2 text-gray-700">
                📊 Progress: <strong>{progress.wordsWrittenToday}/{progress.dailyGoal} words</strong>
              </p>
              <p className="mt-2 text-gray-600 italic">
                💬 "You're on fire! Keep going!"
              </p>
            </div>
          </div>

          {/* AI Writing Tips & Inspiration */}
          <div className="p-6 bg-white shadow-sm rounded-lg">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              💡 <span>Today's Writing Tip</span>
            </h2>
            <p className="mt-4 text-gray-700 italic">
              "Start your story with a strong hook to grab the reader's attention. A compelling opening sets the tone for the entire piece."
            </p>
          </div>
        </section>
      </main>

      {/* AI Assistance Panel */}
      <aside className="w-64 bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">✨ AI Assistance</h2>
        <p className="text-gray-600">Suggestions & Enhancements</p>
        <div className="mt-4 space-y-3">
          <AiButton text="🔄 Rewrite & Expand" color="bg-blue-500" />
          <AiButton text="🎭 Generate Ideas" color="bg-green-500" />
        </div>
      </aside>
    </div>
  );
}

/* Reusable Sidebar Link Component */
function SidebarLink({ to, icon, text }) {
  return (
    <Link to={to} className="flex items-center p-2 hover:bg-indigo-100 rounded transition">
      {icon} <span className="ml-2">{text}</span>
    </Link>
  );
}

/* Reusable AI Button Component */
function AiButton({ text, color }) {
  return (
    <button className={`w-full p-2 ${color} text-white rounded hover:opacity-80 transition`}>
      {text}
    </button>
  );
}
