import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");

  /* ===== AUTH ===== */
  useEffect(() => {
    if (role !== "superadmin") navigate("/login");
  }, [role, navigate]);

  /* ===== USERS ===== */
  const [users, setUsers] = useState([
    {
      name: "Akhil",
      email: "akhil@gmail.com",
      role: "user",
      status: "Active",
      lastLogin: "2 hours ago",
    },
    {
      name: "Admin One",
      email: "admin@inomail.com",
      role: "admin",
      status: "Active",
      lastLogin: "Yesterday",
    },
    {
      name: "Admin Two",
      email: "admin2@inomail.com",
      role: "admin",
      status: "Blocked",
      lastLogin: "5 days ago",
    },
  ]);

  const [logs, setLogs] = useState([
    "Super Admin logged in",
    "Admin Two blocked",
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    status: "Active",
  });

  /* ===== STATS ===== */
  const totalUsers = users.filter(u => u.role === "user").length;
  const totalAdmins = users.filter(u => u.role === "admin").length;
  const activeAccounts = users.filter(u => u.status === "Active").length;
  const blockedAccounts = users.filter(u => u.status === "Blocked").length;

  /* ===== FILTER ===== */
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ===== ACTIONS ===== */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const openCreate = () => {
    setForm({ name: "", email: "", role: "user", status: "Active" });
    setEditIndex(null);
    setShowForm(true);
  };

  const saveUser = () => {
    if (!form.name || !form.email) {
      alert("All fields required");
      return;
    }

    if (editIndex !== null) {
      const updated = [...users];
      updated[editIndex] = form;
      setUsers(updated);
      setLogs(prev => [`Updated ${form.email}`, ...prev]);
    } else {
      setUsers([...users, { ...form, lastLogin: "Never" }]);
      setLogs(prev => [`Created ${form.email}`, ...prev]);
    }

    setShowForm(false);
  };

  const editUser = (index) => {
    setForm(users[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const deleteUser = (index) => {
    if (window.confirm("Delete this account?")) {
      setLogs(prev => [`Deleted ${users[index].email}`, ...prev]);
      setUsers(users.filter((_, i) => i !== index));
    }
  };

  const toggleStatus = (index) => {
    const updated = [...users];
    updated[index].status =
      updated[index].status === "Active" ? "Blocked" : "Active";
    setUsers(updated);
    setLogs(prev => [`Status changed for ${updated[index].email}`, ...prev]);
  };

  const loginAs = (user) => {
    localStorage.setItem("email", user.email);
    localStorage.setItem("role", user.role);
    navigate(user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
  };

  return (
    <div className="super-wrapper">

      {/* SIDEBAR */}
      <aside className="super-sidebar">
        <h2 className="logo">InoMail</h2>
        <p className="subtitle">Super Admin</p>

        <button onClick={() => setActiveTab("overview")} className={activeTab==="overview"?"active":""}>📊 Overview</button>
        <button onClick={() => setActiveTab("users")} className={activeTab==="users"?"active":""}>👥 Users</button>
        <button onClick={() => setActiveTab("logs")} className={activeTab==="logs"?"active":""}>📜 Audit Logs</button>
        <button onClick={() => setActiveTab("settings")} className={activeTab==="settings"?"active":""}>⚙ Settings</button>

        <button className="logout-btn" onClick={logout}>Logout</button>
      </aside>

      {/* MAIN */}
      <main className="super-main">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="stats-grid">
              <div className="stat-card blue"><h4>Total Users</h4><p>{totalUsers}</p></div>
              <div className="stat-card purple"><h4>Total Admins</h4><p>{totalAdmins}</p></div>
              <div className="stat-card green"><h4>Active</h4><p>{activeAccounts}</p></div>
              <div className="stat-card red"><h4>Blocked</h4><p>{blockedAccounts}</p></div>
            </div>

            <div className="health-grid">
              <div className="health-card">📧 SMTP: Connected</div>
              <div className="health-card">📦 Storage: 62%</div>
              <div className="health-card">🚀 Queue: Running</div>
            </div>
          </>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <div className="super-header">
              <input
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="primary-btn" onClick={openCreate}>+ Create User</button>
            </div>

            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={i}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td className={u.status==="Active"?"success":"warning"}>{u.status}</td>
                      <td>{u.lastLogin}</td>
                      <td>
                        <button onClick={()=>editUser(i)}>Edit</button>
                        <button onClick={()=>toggleStatus(i)}>Toggle</button>
                        <button onClick={()=>loginAs(u)}>Login As</button>
                        <button className="danger" onClick={()=>deleteUser(i)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* AUDIT LOGS */}
        {activeTab === "logs" && (
          <div className="logs-card">
            <h2>Audit Logs</h2>
            <ul>
              {logs.map((log, i) => <li key={i}>{log}</li>)}
            </ul>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="settings-card">
            <h2>Platform Settings</h2>
            <label>Maintenance Mode</label>
            <select><option>Disabled</option><option>Enabled</option></select>

            <label>Default Role</label>
            <select><option>User</option><option>Admin</option></select>

            <button className="primary-btn">Save Settings</button>
          </div>
        )}

        {/* MODAL */}
        {showForm && (
          <div className="modal-backdrop">
            <div className="modal-card">
              <h2>{editIndex!==null?"Edit User":"Create User"}</h2>

              <input placeholder="Name" value={form.name}
                onChange={e=>setForm({...form,name:e.target.value})} />
              <input placeholder="Email" value={form.email}
                onChange={e=>setForm({...form,email:e.target.value})} />
              <select value={form.role}
                onChange={e=>setForm({...form,role:e.target.value})}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>

              <div className="modal-actions">
                <button className="primary-btn" onClick={saveUser}>Save</button>
                <button className="secondary-btn" onClick={()=>setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default SuperAdminDashboard;
