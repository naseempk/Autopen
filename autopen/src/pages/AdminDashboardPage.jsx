import { useState, useEffect } from "react";
import { Users, FileText, Settings, LogOut, Home,MessageSquare } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const navigate = useNavigate();
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");



  useEffect(() => { 
    fetchUsers();
    fetchDocumentCount();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if token is missing
        return;
      }

      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error.response?.data || error);
    }
  };

  const fetchDocumentCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/admin/documents/count", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotalDocs(response.data.count);
    } catch (error) {
      console.error("❌ Error fetching document count:", error.response?.data || error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/login", { replace: true }); // Redirect to login
  };

  const handleDeleteUser = async (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;
  
    try {
      const token = localStorage.getItem("token");
  
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("❌ Error deleting user:", error.response?.data || error);
      alert(error.response?.data?.error || "Failed to delete user");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.patch(
        `http://localhost:5000/api/admin/users/${editingUser._id}`,
        { name: editName, email: editEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
  
      // Update local user list
      const updated = response.data.user;
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === updated._id ? updated : u))
      );
  
      setEditingUser(null); // Close modal
    } catch (error) {
      console.error("❌ Error updating user:", error.response?.data || error);
      alert(error.response?.data?.error || "Failed to update user");
    }
  };
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-lg">
        <nav className="space-y-4">
          <SidebarLink icon={<Home />} text="Dashboard" active />
          <SidebarLink icon={<FileText />} text="Documents" onClick={() => navigate("/admin-documents")} />
          <SidebarLink icon={<Settings />} text="Settings" onClick={() => navigate("/admin-settings")}/>
          <SidebarLink icon={<MessageSquare />} text="Feedback" onClick={() => navigate("/admin-feedback")} />

          <button onClick={handleLogout} className="flex items-center w-full p-2 text-left text-red-600 hover:bg-red-100 rounded">
            <LogOut className="mr-2" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <OverviewCard title="Total Users" value={users.length} />
          <OverviewCard title="Total Documents" value={totalDocs} />
        </div>

        {/* User Management Table */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <input type="text" placeholder="Search by name or email..." className="mb-4 p-2 border rounded w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="bg-white p-4 shadow rounded-lg">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.role}</td>
                      <td className="p-2">
                      <button
                      onClick={() => {
                        setEditingUser(user);
                        setEditName(user.name);
                        setEditEmail(user.email);
                      }}
                    className="text-blue-500 mr-2"
                      >
                      Edit
                      </button>

                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-500">
                        Delete
                        </button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {editingUser && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-md w-96">
      <h3 className="text-xl font-semibold mb-4">Edit User</h3>

      <label className="block mb-2">
        Name:
        <input
          className="w-full border p-2 rounded mt-1"
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
      </label>

      <label className="block mb-4">
      Email:
    <input
    className="w-full border p-2 rounded mt-1"
    type="email"
    value={editEmail}
    onChange={(e) => setEditEmail(e.target.value)}
    />
  </label>


      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setEditingUser(null)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleEditSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>   
  );

  
}

/* Sidebar Link Component */
function SidebarLink({ icon, text, active, onClick }) {
  return (
    <div
      onClick={onClick} 
      className={`flex items-center p-2 rounded cursor-pointer ${active ? "bg-indigo-200 font-bold" : "hover:bg-indigo-100"}`}
    >
      {icon} <span className="ml-2">{text}</span>
    </div>
  );
}


/* Overview Card Component */
function OverviewCard({ title, value }) {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
