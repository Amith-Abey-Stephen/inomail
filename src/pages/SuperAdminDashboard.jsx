import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../utils/toast";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: '', id: null, type: '' });

  useEffect(() => {
    if (role !== "superadmin") navigate("/login");
  }, [role, navigate]);

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@mail.com", role: "user", status: "Active" },
    { id: 2, name: "Emma Smith", email: "emma@mail.com", role: "admin", status: "Active" },
    { id: 3, name: "Sam Wilson", email: "sam@mail.com", role: "user", status: "Banned" },
  ]);

  const [orgs, setOrgs] = useState([
    { id: 1, name: "InoTech", users: 12, plan: "Pro", expiry: "2026-12-31", status: "Verified" },
    { id: 2, name: "NextGen", users: 7, plan: "Basic", expiry: "2026-04-15", status: "Pending" },
  ]);

  const [payments, setPayments] = useState([
    { id: "INV-001", org: "InoTech", amount: "₹4,999", plan: "Pro", date: "2026-03-20", status: "Paid" },
    { id: "INV-002", org: "NextGen", amount: "₹1,999", plan: "Basic", date: "2026-03-18", status: "Failed" },
  ]);

  const [activityFeed, setActivityFeed] = useState([
    { id: 1, message: "InoTech upgraded to Pro Plan", time: "2 hours ago" },
    { id: 2, message: "New organization 'Alpha' registered", time: "5 hours ago" },
    { id: 3, message: "Campaign 'Winter Offer' flagged for bounce rate", time: "1 day ago" },
  ]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Actions (Mocks for the "powers")
  const handleUserAction = (id, action) => {
    setConfirmModal({ isOpen: true, action, id, type: 'User' });
  };
  const handleOrgAction = (id, action) => {
    setConfirmModal({ isOpen: true, action, id, type: 'Organization' });
  };

  const confirmAction = () => {
    toast.success(`${confirmModal.action} successfully applied to ${confirmModal.type} ID ${confirmModal.id}`);
    setConfirmModal({ isOpen: false, action: '', id: null, type: '' });
  };

  return (
    <div className="flex bg-slate-900 h-screen w-full overflow-hidden text-slate-50">
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40" 
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 transform 
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        bg-slate-900 border-r border-slate-800 flex flex-col
        ${collapsed ? "w-20" : "w-64"} shrink-0
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black dash-gradient cursor-pointer" onClick={() => navigate("/")} >
              {collapsed ? "IM" : "InoMail"}
            </h2>
            {!collapsed && <p className="text-xs text-slate-500 font-medium truncate uppercase mt-1">SuperAdmin Control</p>}
          </div>
          {/* Mobile close button */}
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={toggleMobileMenu}>
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <button 
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "overview" ? "bg-slate-800 text-sky-400" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`} 
            onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
            {!collapsed && "Overview"}
          </button>

          <button 
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "users" ? "bg-slate-800 text-sky-400" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`} 
            onClick={() => { setActiveTab("users"); setMobileMenuOpen(false); }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            {!collapsed && "All Users"}
          </button>

          <button 
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "organizations" ? "bg-slate-800 text-sky-400" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`} 
            onClick={() => { setActiveTab("organizations"); setMobileMenuOpen(false); }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            {!collapsed && "Organizations"}
          </button>

          <button 
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === "financials" ? "bg-slate-800 text-sky-400" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`} 
            onClick={() => { setActiveTab("financials"); setMobileMenuOpen(false); }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {!collapsed && "Financials"}
          </button>

          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-auto" onClick={logout}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            {!collapsed && "Logout"}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-900/50 relative">
        <div className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 p-4 md:p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button className="lg:hidden p-2 text-slate-300 hover:text-white" onClick={toggleMobileMenu}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold dash-gradient tracking-wider">SUPERADMIN CENTER</h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">Global platform management & control</p>
            </div>
          </div>
          <div className="relative w-full md:w-auto">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search global records..."
              className="w-full md:w-80 bg-slate-800/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 space-y-8">
          {activeTab === "overview" && (
            <>
              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Platform Statistics</h2>
                  <p className="text-slate-400 mb-6">Aggregate insights across all registered organizations.</p>
                  <div className="flex gap-6">
                    <div>
                      <span className="text-sm text-slate-400 block mb-1">Total Revenue</span>
                      <strong className="text-2xl font-bold text-emerald-400">₹42.8k</strong>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400 block mb-1">Server Load</span>
                      <strong className="text-2xl font-bold text-sky-400">12%</strong>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center min-w-[160px]">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">System Status</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <strong className="text-emerald-400 font-medium">Healthy</strong>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors">
                  <h4 className="text-slate-400 text-sm font-medium mb-2">Total Users</h4>
                  <p className="text-3xl font-bold text-white mb-1">{users.length}</p>
                  <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">+4 this month</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors">
                  <h4 className="text-slate-400 text-sm font-medium mb-2">Organizations</h4>
                  <p className="text-3xl font-bold text-white mb-1">{orgs.length}</p>
                  <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded-full">Verified entities</span>
                </div>
              </div>
              
              {/* Activity Feed */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Platform Activity</h3>
                <div className="space-y-4">
                  {activityFeed.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl">
                      <p className="text-sm text-slate-300">{activity.message}</p>
                      <span className="text-xs text-slate-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {(activeTab === "users" || activeTab === "organizations" || activeTab === "financials") && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    {activeTab === "users" && (
                      <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-4 px-6 font-medium">Name</th>
                        <th className="py-4 px-6 font-medium">Email</th>
                        <th className="py-4 px-6 font-medium">Role</th>
                        <th className="py-4 px-6 font-medium">Status</th>
                        <th className="py-4 px-6 font-medium text-right">Powers</th>
                      </tr>
                    )}
                    {activeTab === "organizations" && (
                      <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-4 px-6 font-medium">Org Name</th>
                        <th className="py-4 px-6 font-medium">Users</th>
                        <th className="py-4 px-6 font-medium">Plan</th>
                        <th className="py-4 px-6 font-medium">Expiry</th>
                        <th className="py-4 px-6 font-medium">Status</th>
                        <th className="py-4 px-6 font-medium text-right">Powers</th>
                      </tr>
                    )}
                    {activeTab === "financials" && (
                      <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-4 px-6 font-medium">Invoice ID</th>
                        <th className="py-4 px-6 font-medium">Organization</th>
                        <th className="py-4 px-6 font-medium">Plan</th>
                        <th className="py-4 px-6 font-medium">Amount</th>
                        <th className="py-4 px-6 font-medium">Date</th>
                        <th className="py-4 px-6 font-medium text-right">Status</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="text-sm text-slate-300 divide-y divide-slate-700/50">
                    {activeTab === "users" && users
                      .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
                      .map((u, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6 font-medium text-white">{u.name}</td>
                        <td className="py-4 px-6 text-slate-400">{u.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-700/50 text-slate-300 border-slate-600'}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleUserAction(u.id, "Promote")} className="text-xs bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 px-3 py-1.5 rounded-lg transition-colors">Promote</button>
                            {u.status === 'Active' ? (
                              <button onClick={() => handleUserAction(u.id, "Ban")} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-colors">Ban</button>
                            ) : (
                              <button onClick={() => handleUserAction(u.id, "Unban")} className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg transition-colors">Unban</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {activeTab === "organizations" && orgs
                      .filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
                      .map((o, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6 font-medium text-white">{o.name}</td>
                        <td className="py-4 px-6 text-slate-400">{o.users} registered</td>
                        <td className="py-4 px-6"><span className="text-xs font-medium bg-slate-700/50 text-slate-300 px-2.5 py-1 rounded-full border border-slate-600">{o.plan}</span></td>
                        <td className="py-4 px-6 text-slate-400">{o.expiry}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${o.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {o.status !== 'Verified' && (
                              <button onClick={() => handleOrgAction(o.id, "Verify")} className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg transition-colors">Verify</button>
                            )}
                            <button onClick={() => handleOrgAction(o.id, "Suspend")} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-colors">Suspend</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {activeTab === "financials" && payments
                      .filter(p => p.id.toLowerCase().includes(search.toLowerCase()) || p.org.toLowerCase().includes(search.toLowerCase()))
                      .map((p, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6 font-medium text-white">{p.id}</td>
                        <td className="py-4 px-6 text-slate-400">{p.org}</td>
                        <td className="py-4 px-6"><span className="text-xs font-medium bg-slate-700/50 text-slate-300 px-2.5 py-1 rounded-full border border-slate-600">{p.plan}</span></td>
                        <td className="py-4 px-6 text-slate-300">{p.amount}</td>
                        <td className="py-4 px-6 text-slate-400">{p.date}</td>
                        <td className="py-4 px-6 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] px-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Confirm Action</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to <strong className="text-slate-200">{confirmModal.action.toLowerCase()}</strong> this {confirmModal.type}?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, action: '', id: null, type: '' })}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 transition-all font-medium"
              >
                Confirm {confirmModal.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminDashboard;
