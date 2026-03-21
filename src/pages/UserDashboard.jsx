import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "../utils/toast";
import * as XLSX from "xlsx";

function UserDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userEmail = localStorage.getItem("email");
  
  const savedOrgs = JSON.parse(localStorage.getItem("userOrgs")) || [localStorage.getItem("orgName") || "InoMail Organization"];
  const [organizations, setOrganizations] = useState(savedOrgs);
  const [organization, setOrganization] = useState(organizations[0]);

  const [recipients, setRecipients] = useState([]);
  const [emailForm, setEmailForm] = useState({ subject: "", message: "", template: "" });
  const [attachment, setAttachment] = useState(null);

  const createNewOrg = () => {
    toast.info("Redirecting to create a new organization");
    navigate("/register");
  };

  const permissions = JSON.parse(localStorage.getItem("userPermissions")) || {
    canSendEmails: true,
    canViewHistory: true,
    canUseTemplates: true,
    canAccessAssets: true,
  };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (role !== "user") navigate("/login");
  }, [role, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [campaigns, setCampaigns] = useState([
    {
      name: "Welcome Campaign",
      subject: "Welcome to InoMail",
      content: "We are excited to have you onboard!",
      emails: 1200,
      status: "Sent",
      date: "10 Feb 2026",
    },
  ]);

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      const emails = data.map((row) => row.email).filter(Boolean);
      setRecipients(emails);
    };
    reader.readAsBinaryString(file);
  };

  const generateTemplate = () => {
    const template = `
      <h2>Hello,</h2>
      <p>This is a professional email from InoMail Organization.</p>
      <p>${emailForm.message}</p>
      <br/>
      <p>Best Regards,<br/>InoMail Team</p>
    `;
    setEmailForm({ ...emailForm, template });
  };

  const sendCampaign = () => {
    if (!permissions.canSendEmails) {
      toast.error("Email sending disabled by organization");
      return;
    }
    if (!emailForm.subject || recipients.length === 0) {
      toast.warn("Subject and recipients are required");
      return;
    }

    setCampaigns([
      ...campaigns,
      {
        name: emailForm.subject,
        subject: emailForm.subject,
        content: emailForm.message,
        emails: recipients.length,
        status: "Draft",
        date: new Date().toLocaleDateString(),
      },
    ]);

    setRecipients([]);
    setEmailForm({ subject: "", message: "", template: "" });
    toast.success("Campaign simulated successfully!");
    setActiveTab("history");
  };

  const templates = [
    { name: "Welcome Email", content: "🎉 Welcome to our platform! We're happy to have you." },
    { name: "Promotion", content: "🔥 Limited Offer! Get 50% discount today!" },
    { name: "Newsletter", content: "📰 Here are our latest updates and news." },
  ];

  const sidebarButtonClass = (tabId) => 
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
      activeTab === tabId ? "bg-sky-500 text-white font-bold shadow-lg shadow-sky-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="flex bg-slate-900 h-screen w-full overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col shrink-0 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className={`${collapsed ? 'hidden' : 'block'} flex-1`}>
            <h2 className="text-xl font-black dash-gradient cursor-pointer" onClick={() => navigate("/")}>InoMail</h2>
            <select 
               className="bg-slate-800 text-xs text-slate-300 font-medium truncate w-full mt-2 p-1.5 rounded-lg border border-slate-700 outline-none cursor-pointer hover:border-sky-500/50 transition-colors shadow-inner"
               value={organization}
               onChange={(e) => {
                 setOrganization(e.target.value);
                 localStorage.setItem("orgName", e.target.value);
                 toast.success("Switched to " + e.target.value);
               }}
            >
               {organizations.map((org, i) => <option key={i} value={org}>{org}</option>)}
            </select>
            <button className="text-[10px] uppercase tracking-wider text-sky-400 font-bold hover:text-white transition-colors mt-2" onClick={createNewOrg}>+ New Organization</button>
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-white shrink-0 ml-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
          </button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <button className={sidebarButtonClass("dashboard")} onClick={() => setActiveTab("dashboard")}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
            {!collapsed && <span>Dashboard</span>}
          </button>

          {permissions.canSendEmails && (
            <button className={sidebarButtonClass("create")} onClick={() => setActiveTab("create")}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              {!collapsed && <span>Send Email</span>}
            </button>
          )}

          {permissions.canViewHistory && (
            <button className={sidebarButtonClass("history")} onClick={() => setActiveTab("history")}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {!collapsed && <span>History</span>}
            </button>
          )}

          {permissions.canUseTemplates && (
            <button className={sidebarButtonClass("templates")} onClick={() => setActiveTab("templates")}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              {!collapsed && <span>Templates</span>}
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors" onClick={logout}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-900/50">
        <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 z-10 sticky top-0">
          <div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-wide">{activeTab}</h1>
            <p className="text-sm text-slate-400">Welcome back, Team Member</p>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 text-sm font-medium text-slate-300">
            {userEmail}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
          {/* Background blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full point-events-none" />

          {activeTab === "dashboard" && (
            <div className="space-y-8 relative z-10">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card bg-gradient-to-tr from-sky-500/10 to-transparent border-sky-500/20 shadow-xl p-8 rounded-3xl">
                  <h2 className="text-2xl font-black text-white mb-2">Campaign Analytics</h2>
                  <p className="text-slate-400 mb-8">Monitor your email delivery and engagement in real-time.</p>
                  
                  <div className="flex gap-12">
                     <div>
                       <span className="block text-sm text-slate-400 uppercase tracking-widest mb-1">Campaigns</span>
                       <strong className="text-4xl font-black text-sky-400">{campaigns.length}</strong>
                     </div>
                     <div>
                       <span className="block text-sm text-slate-400 uppercase tracking-widest mb-1">Templates</span>
                       <strong className="text-4xl font-black text-sky-400">{templates.length}</strong>
                     </div>
                  </div>
                </div>

                <div className="glass-card bg-slate-800 border-slate-700 flex flex-col items-center justify-center p-8 text-center rounded-3xl">
                  <p className="text-slate-400 text-sm uppercase tracking-widest mb-4">System Status</p>
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                     <div className="w-6 h-6 rounded-full bg-green-500 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                  </div>
                  <strong className="text-lg text-white font-bold">Operational</strong>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card bg-slate-800 border-slate-700 p-6 rounded-2xl">
                  <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Sent</h4>
                  <p className="text-4xl font-black text-white mb-2">12.8k</p>
                  <span className="text-xs text-green-400 font-semibold bg-green-500/10 px-2 py-1 rounded">+12% from last week</span>
                </div>
                <div className="glass-card bg-slate-800 border-slate-700 p-6 rounded-2xl">
                  <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Open Rate</h4>
                  <p className="text-4xl font-black text-white mb-2">94.2%</p>
                  <span className="text-xs text-sky-400 font-semibold bg-sky-500/10 px-2 py-1 rounded">Industry High</span>
                </div>
                <div className="glass-card bg-slate-800 border-slate-700 p-6 rounded-2xl">
                  <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Active Templates</h4>
                  <p className="text-4xl font-black text-white mb-2">{templates.length}</p>
                  <span className="text-xs text-purple-400 font-semibold bg-purple-500/10 px-2 py-1 rounded">Ready to use</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "create" && permissions.canSendEmails && (
            <div className="glass-card bg-slate-800 border-slate-700 max-w-4xl mx-auto rounded-3xl p-8 pt-10 relative z-10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-slate-700 pb-4">New Campaign</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Campaign Name</label>
                  <input
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none shadow-inner"
                    placeholder="Eg: Summer Sale 2026"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Subject Line</label>
                  <input
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none shadow-inner"
                    placeholder="Enter a catchy subject"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Content</label>
                  <textarea
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all outline-none shadow-inner min-h-[200px]"
                    placeholder="Write your email body..."
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                  />
                </div>
                <button className="btn-primary w-full py-4 text-lg mt-4 shadow-sky-500/20" onClick={createCampaign}>
                  Launch Campaign
                </button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="glass-card bg-slate-800 border-slate-700 rounded-3xl p-8 relative z-10 shadow-2xl overflow-hidden">
              <h3 className="text-2xl font-bold text-white mb-8">Campaign History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
                      <th className="pb-4 font-semibold px-4">Campaign Name</th>
                      <th className="pb-4 font-semibold px-4">Status</th>
                      <th className="pb-4 font-semibold px-4">Target</th>
                      <th className="pb-4 font-semibold px-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    {campaigns.map((c, i) => (
                      <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                        <td className="py-4 px-4 font-medium text-white">{c.name}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide ${c.status === 'Sent' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400">{c.emails} recipients</td>
                        <td className="py-4 px-4 text-right text-slate-400">{c.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "templates" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {templates.map((t, i) => (
                <div key={i} className="glass-card bg-slate-800 border-slate-700 flex flex-col p-6 rounded-2xl hover:-translate-y-1 hover:border-sky-500/30 transition-all duration-300 shadow-xl">
                  <h4 className="text-lg font-bold text-white mb-3 text-sky-400">{t.name}</h4>
                  <p className="text-sm text-slate-400 mb-6 flex-1 bg-slate-900 border border-slate-700 p-4 rounded-xl">{t.content}</p>
                  <button 
                    className="btn-outline w-full py-2.5 text-sm" 
                    onClick={() => { setNewCampaign({ ...newCampaign, content: t.content }); setActiveTab("create"); }}
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;