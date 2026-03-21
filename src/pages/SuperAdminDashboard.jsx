import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (role !== "superadmin") navigate("/login");
  }, [role, navigate]);

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@mail.com", role: "user", status: "Active" },
    { id: 2, name: "Emma Smith", email: "emma@mail.com", role: "admin", status: "Active" },
  ]);

  const [orgs, setOrgs] = useState([
    { id: 1, name: "InoTech", users: 12, status: "Active" },
    { id: 2, name: "NextGen", users: 7, status: "Active" },
  ]);

  const [campaigns, setCampaigns] = useState([
    { id: 1, name: "Summer Sale", org: "InoTech", status: "Sent" },
    { id: 2, name: "Winter Offer", org: "NextGen", status: "Draft" },
  ]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex bg-slate-900 h-screen w-full overflow-hidden text-slate-50">
      <aside className={`user-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="p-6 border-b border-slate-800 flex flex-col">
          <h2 className="text-2xl font-black dash-gradient cursor-pointer" onClick={() => navigate("/")} >InoMail</h2>
          {!collapsed && <p className="text-xs text-slate-500 font-medium truncate uppercase mt-1">SuperAdmin Control</p>}
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
            {!collapsed && "Overview"}
          </button>

          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            {!collapsed && "All Users"}
          </button>

          <button className={activeTab === "organizations" ? "active" : ""} onClick={() => setActiveTab("organizations")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            {!collapsed && "Organizations"}
          </button>

          <button className={activeTab === "campaigns" ? "active" : ""} onClick={() => setActiveTab("campaigns")}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            {!collapsed && "Campaigns"}
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-auto" onClick={logout}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            {!collapsed && "Logout"}
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-slate-900/50 relative">
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 z-10 sticky top-0">
          <div>
            <h1 className="dash-gradient">SUPERADMIN CENTER</h1>
            <p >Global platform management & control</p>
          </div>
          <div className="admin-search-box">
             <input
              type="text"
              placeholder="Search global records..."
              className="admin-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="p-6 lg:p-10 space-y-8 overflow-y-auto w-full">
            <div className="dashboard-hero">
              <div className="hero-left">
                <h2>Platform Statistics</h2>
                <p className="hero-sub">Aggregate insights across all registered organizations.</p>
                <div className="hero-metrics">
                  <div className="hero-metric">
                    <span>Revenue</span>
                    <strong className="dash-success">₹42.8k</strong>
                  </div>
                  <div className="hero-metric">
                    <span>Server Load</span>
                    <strong>12%</strong>
                  </div>
                </div>
              </div>
              <div className="hero-status-card">
                <p>Global System</p>
                <div className="status-indicator"></div>
                <strong>Healthy</strong>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card bg-slate-800 border-slate-700 p-6 flex flex-col">
                <h4>Total Users</h4>
                <p>{users.length}</p>
                <span className="kpi-sub">+4 this month</span>
              </div>
              <div className="glass-card bg-slate-800 border-slate-700 p-6 flex flex-col">
                <h4>Organizations</h4>
                <p>{orgs.length}</p>
                <span className="kpi-sub">Verified entities</span>
              </div>
              <div className="glass-card bg-slate-800 border-slate-700 p-6 flex flex-col">
                <h4>Active Campaigns</h4>
                <p>{campaigns.length}</p>
                <span className="kpi-sub">Real-time load</span>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs follow the same pattern... */}
        {(activeTab === "users" || activeTab === "organizations" || activeTab === "campaigns") && (
          <div className="glass-card">
            <h3 >{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h3>
            <table className="w-full text-left border-collapse mt-6">
              <thead>
                {activeTab === "users" ? (
                  <tr className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"><th className="pb-4 font-semibold px-4">Name</th><th className="pb-4 font-semibold px-4">Email</th><th className="pb-4 font-semibold px-4">Role</th><th className="pb-4 font-semibold px-4">Status</th></tr>
                ) : activeTab === "organizations" ? (
                  <tr className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"><th className="pb-4 font-semibold px-4">Org Name</th><th className="pb-4 font-semibold px-4">Users</th><th className="pb-4 font-semibold px-4">Status</th></tr>
                ) : (
                  <tr className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"><th className="pb-4 font-semibold px-4">Name</th><th className="pb-4 font-semibold px-4">Org</th><th className="pb-4 font-semibold px-4">Status</th></tr>
                )}
              </thead>
              <tbody className="text-slate-300">
                {activeTab === "users" && users.map((u, i) => (
                  <tr key={i}>
                    <td className="py-4 px-4">{u.name}</td>
                    <td className="py-4 px-4">{u.email}</td>
                    <td className="py-4 px-4"><span className="admin-role">{u.role}</span></td>
                    <td className="py-4 px-4"><span className={`admin-status ${u.status === 'Active' ? 'active' : 'pending'}`}>{u.status}</span></td>
                  </tr>
                ))}
                {activeTab === "organizations" && orgs.map((o, i) => (
                  <tr key={i}>
                    <td className="py-4 px-4">{o.name}</td>
                    <td className="py-4 px-4">{o.users} users</td>
                    <td className="py-4 px-4"><span className={`admin-status ${o.status === 'Active' ? 'active' : 'pending'}`}>{o.status}</span></td>
                  </tr>
                ))}
                {activeTab === "campaigns" && campaigns.map((c, i) => (
                  <tr key={i}>
                    <td className="py-4 px-4">{c.name}</td>
                    <td className="py-4 px-4">{c.org}</td>
                    <td className="py-4 px-4"><span className={`admin-status ${c.status === 'Sent' ? 'active' : 'pending'}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default SuperAdminDashboard;
