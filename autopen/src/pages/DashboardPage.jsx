import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, FileText, Settings, LogOut, PenTool, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setUserName(storedName);
  }, []);

  const [recentDocuments, setRecentDocuments] = useState([
    { id: 1, title: "My First Story" },
    { id: 2, title: "Thriller Draft" },
  ]);

  const openDocument = (id) => {
    console.log(`Opening document ${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white p-6 shadow-lg">
        <nav className="space-y-4">
          <SidebarLink to="/dashboard" icon={<Home />} text="Dashboard" />
          <SidebarLink to="/editor" icon={<PenTool />} text="New Project" />
          <SidebarLink to="/documents" icon={<FileText />} text="My Documents" />
          <SidebarLink to="/ai-assist" icon={<Sparkles />} text="AI Assistance" />
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
            onClick={() => navigate("/editor")} // ✅ Corrected path
          >
            Start Writing
          </button>
        </section>

        {/* Recent Documents */}
        <section>
          <h2 className="text-xl font-semibold mb-2">📂 Recent Documents</h2>
          <ul>
            {recentDocuments.map((doc) => (
              <li
                key={doc.id}
                className="p-3 bg-white shadow-sm hover:bg-gray-200 cursor-pointer rounded mb-2 transition"
                onClick={() => openDocument(doc.id)}
              >
                {doc.title}
              </li>
            ))}
          </ul>
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
