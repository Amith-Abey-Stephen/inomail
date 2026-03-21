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
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [testEmail, setTestEmail] = useState(() => localStorage.getItem("userTestEmail") || "");
  const [assets, setAssets] = useState([]);

  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  const handleCreateOrg = () => {
    if (!newOrgName.trim()) return;
    setOrganizations([...organizations, newOrgName]);
    setOrganization(newOrgName);
    localStorage.setItem("orgName", newOrgName);
    setNewOrgName("");
    setShowNewOrgModal(false);
    setShowOrgDropdown(false);
    toast.success(`Organization ${newOrgName} created!`);
  };

  const handleSwitchOrg = (orgName) => {
    setOrganization(orgName);
    localStorage.setItem("orgName", orgName);
    setShowOrgDropdown(false);
    toast.success(`Switched to ${orgName}`);
  };

  const permissions = JSON.parse(localStorage.getItem("userPermissions")) || {
    canSendEmails: true,
    canViewHistory: true,
    canUseTemplates: true,
    canAccessAssets: true,
  };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  const handleAssetUpload = (e, index) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const updated = [...assets];
    updated[index] = { label: `Asset ${index + 1}`, files };
    setAssets(updated);
    toast.success(`Asset ${index + 1}: ${files.length} file${files.length > 1 ? 's' : ''} added.`);
  };

  const removeAsset = (index) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const addAssetSlot = () => {
    setAssets([...assets, null]);
  };

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

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) { toast.warn("Please enter a topic/prompt first!"); return; }
    setIsGenerating(true);
    toast.info("Generating content... This can take up to 60 seconds for free AI models.");
    const systemPrompt = `You are an email template expert. Generate a production-ready HTML email based on the topic: ${aiPrompt}. Output ONLY a valid JSON object: {"subject": "...", "html": "..."} with inline CSS only. No markdown, no conversational text.`;
    try {
      const aiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
      if (!aiKey.trim()) throw new Error("No API Key configured.");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${aiKey.trim()}`, "Content-Type": "application/json", "HTTP-Referer": window.location.origin, "X-Title": "InoMail" },
        body: JSON.stringify({ model: "openrouter/free", max_tokens: 1500, messages: [{ role: "user", content: systemPrompt }] }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error("Failed connecting to OpenRouter.");
      const completion = await response.json();
      if (completion?.choices?.length > 0) {
        const content = completion.choices[0].message.content;
        const jsonStart = content.indexOf('{'); const jsonEnd = content.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const parsed = JSON.parse(content.substring(jsonStart, jsonEnd + 1));
          if (parsed.subject && parsed.html) {
            setEmailForm({ ...emailForm, subject: parsed.subject, message: parsed.html, template: parsed.html });
            toast.success("AI Generation Complete!"); setAiPrompt("");
          } else { toast.error("AI returned invalid format."); }
        } else { toast.error("AI response did not contain valid JSON."); }
      } else { toast.error("Empty response from AI."); }
    } catch(e) { toast.error(e.message || "Error generating AI content."); }
    finally { setIsGenerating(false); }
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

  const defaultTemplates = [
    { name: "Welcome Email", content: "<h2>👋 Welcome!</h2><p>Happy to have you here!</p>" },
    { name: "Promotion", content: "<h2>🔥 Limited Offer!</h2><p>Get 50% discount today!</p>" },
    { name: "Newsletter", content: "<h2>📰 Newsletter</h2><p>Here are our latest updates.</p>" },
  ];

  const [templates, setTemplates] = useState(() => {
    const drafts = JSON.parse(localStorage.getItem("sharedDrafts")) || [];
    return [...defaultTemplates, ...drafts];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const drafts = JSON.parse(localStorage.getItem("sharedDrafts")) || [];
      setTemplates([...defaultTemplates, ...drafts]);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const sidebarButtonClass = (tabId) => 
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
      activeTab === tabId ? "bg-sky-500 text-white font-bold shadow-lg shadow-sky-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };

  return (
    <div className="flex bg-slate-900 min-h-screen w-full overflow-x-hidden">

      {/* ── MOBILE OVERLAY ── */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        bg-slate-900 border-r border-slate-800
        flex flex-col shrink-0
        transition-all duration-300
        ${collapsed ? 'w-20' : 'w-64'}
        ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className={`${collapsed ? 'hidden' : 'block'} flex-1 relative`}>
            <h2 className="text-xl font-black dash-gradient cursor-pointer pl-1" onClick={() => navigate("/")} >InoMail</h2>
            <div 
              className="mt-3 flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg px-3 py-2.5 cursor-pointer transition w-full"
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            >
              <p className="text-xs text-slate-300 font-medium truncate uppercase">{organization}</p>
              <span className="text-slate-500 text-xs ml-2">▼</span>
            </div>
            
            {showOrgDropdown && (
              <div className="absolute top-[75px] left-0 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="max-h-40 overflow-y-auto">
                  {organizations.map((org, i) => (
                    <div 
                      key={i} 
                      className={`px-3 py-2.5 text-xs cursor-pointer hover:bg-slate-700 transition ${organization === org ? 'text-sky-400 font-bold bg-slate-900 border-l-2 border-sky-400' : 'text-slate-300'}`}
                      onClick={() => handleSwitchOrg(org)}
                    >
                      {org}
                    </div>
                  ))}
                </div>
                <div 
                  className="px-3 py-2.5 text-xs border-t border-slate-700 text-emerald-400 hover:bg-slate-700 cursor-pointer transition flex items-center gap-2"
                  onClick={() => setShowNewOrgModal(true)}
                >
                  <span className="text-lg leading-none">+</span> Create New
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-white shrink-0 ml-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
          </button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <button className={sidebarButtonClass("dashboard")} onClick={() => handleTabChange("dashboard")}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg>
            {!collapsed && <span>Dashboard</span>}
          </button>

          {permissions.canSendEmails && (
            <button className={sidebarButtonClass("create")} onClick={() => handleTabChange("create")}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              {!collapsed && <span>Send Email</span>}
            </button>
          )}

          {permissions.canViewHistory && (
            <button className={sidebarButtonClass("history")} onClick={() => handleTabChange("history")}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {!collapsed && <span>History</span>}
            </button>
          )}

          {permissions.canUseTemplates && (
            <button className={sidebarButtonClass("templates")} onClick={() => handleTabChange("templates")}>
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              {!collapsed && <span>Templates</span>}
            </button>
          )}

          <button className={sidebarButtonClass("settings")} onClick={() => handleTabChange("settings")}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {!collapsed && <span>Settings</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors" onClick={logout}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900/50">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMobileNavOpen(true)} className="text-slate-400 hover:text-white p-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
          </button>
          <h2 className="text-lg font-black dash-gradient">InoMail</h2>
          <div className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full border border-slate-700 truncate max-w-[120px]">{userEmail}</div>
        </div>
        {/* Desktop header */}
        <header className="hidden lg:flex bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 px-6 py-4 justify-between items-center z-10 sticky top-0">
          <div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-wide">{activeTab}</h1>
            <p className="text-sm text-slate-400">Welcome back, Team Member</p>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 text-sm font-medium text-slate-300 truncate max-w-[200px]">
            {userEmail}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          {/* Background blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full point-events-none" />

          {activeTab === "dashboard" && (
            <div className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2 glass-card bg-gradient-to-tr from-sky-500/10 to-transparent border-sky-500/20 shadow-xl p-6 md:p-8 rounded-3xl">
                  <h2 className="text-xl md:text-2xl font-black text-white mb-2">Campaign Analytics</h2>
                  <p className="text-slate-400 mb-6">Monitor your email delivery and engagement in real-time.</p>
                  <div className="flex flex-wrap gap-8">
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

                <div className="glass-card bg-slate-800 border-slate-700 flex flex-col items-center justify-center p-6 md:p-8 text-center rounded-3xl">
                  <p className="text-slate-400 text-sm uppercase tracking-widest mb-4">System Status</p>
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <div className="w-6 h-6 rounded-full bg-green-500 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                  </div>
                  <strong className="text-lg text-white font-bold">Operational</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
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
            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">🚀 Campaign Studio</h2>
                  <p className="text-slate-400 text-sm">Design, personalize, and launch your email campaigns</p>
                  <div className="flex gap-4 mt-4">
                    <div className="bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs font-medium"><span className="text-slate-400">Recipients:</span> <span className="text-white">{recipients.length}</span></div>
                  </div>
                </div>
                <button className="px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-400 hover:to-indigo-400 shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed" onClick={sendCampaign} disabled={!emailForm.subject || recipients.length === 0}>🚀 Launch Campaign</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[500px]">
                <div className="lg:col-span-3 flex flex-col gap-6">
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4">
                    <h3 className="font-semibold text-white">✍ Composer</h3>

                    {/* AI Generator */}
                    <div className="bg-slate-900/50 border border-indigo-500/30 rounded-xl p-4 flex flex-col gap-3">
                      <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">✨ AI Magic Generator</label>
                      <textarea rows="2" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none placeholder-slate-500" placeholder="E.g., A promotional email for our summer shoe collection..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
                      <button className="self-end text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/40 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50" onClick={handleAIGenerate} disabled={isGenerating || !aiPrompt.trim()}>
                        {isGenerating ? "Generating..." : "Generate Subject & Content"}
                      </button>
                    </div>

                    {/* Subject with draft chips */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Subject Line</label>
                      <input className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="High converting subject..." value={emailForm.subject} onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})} />
                    </div>
                    {templates.filter(t => t.content.includes('<')).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {templates.filter(t => t.content.includes('<')).map((t, i) => (
                          <button key={i} className="whitespace-nowrap bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition truncate max-w-[200px]" onClick={() => setEmailForm({...emailForm, subject: t.name, message: t.content, template: t.content})} title={t.name}>
                            🏷️ {t.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Content textarea */}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Email Content</label>
                      <textarea rows="6" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none font-mono text-sm leading-relaxed" placeholder="Write HTML or raw text here..." value={emailForm.message} onChange={(e) => setEmailForm({...emailForm, message: e.target.value})} />
                    </div>
                  </div>

                  {/* Audience + Assets */}
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-5">
                    <h3 className="font-semibold text-white">👥 Audience</h3>
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center relative hover:bg-slate-800/50 transition cursor-pointer">
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".xlsx,.csv" onChange={handleExcelUpload} />
                      <span className="text-3xl mb-2">📂</span>
                      <p className="text-sm font-medium text-slate-300">{recipients.length > 0 ? `✅ ${recipients.length} recipients loaded` : "Upload Contact List"}</p>
                      <p className="text-xs text-slate-500 mt-1">.csv, .xlsx</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">📎 Asset Groups</label>
                        <button onClick={addAssetSlot} className="text-xs text-sky-400 border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 px-2 py-1 rounded-lg font-medium transition">+ Add Group</button>
                      </div>
                      {assets.length === 0 && (
                        <p className="text-xs text-slate-500 italic text-center py-4">No asset groups yet. Click "+ Add Group" to start.</p>
                      )}
                      <div className="flex flex-col gap-3">
                        {assets.map((asset, idx) => (
                          <div key={idx}>
                            {asset ? (
                              <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-3 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-emerald-400">{asset.label} <span className="text-slate-500 font-normal">({asset.files.length} files)</span></span>
                                  <button onClick={() => removeAsset(idx)} className="text-xs text-red-400 hover:text-red-300">✕ Remove</button>
                                </div>
                                <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto">
                                  {asset.files.map((f, fi) => (
                                    <span key={fi} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded truncate max-w-[120px]" title={f.name}>{f.name}</span>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <label className="border-2 border-dashed border-slate-700 hover:border-sky-500/50 rounded-xl p-4 flex items-center gap-3 cursor-pointer transition">
                                <input type="file" multiple className="hidden" onChange={(e) => handleAssetUpload(e, idx)} />
                                <span className="text-xl">📁</span>
                                <div>
                                  <span className="text-xs text-slate-300 font-medium block">Asset Group {idx + 1}</span>
                                  <span className="text-[10px] text-slate-600">Click to bulk upload files</span>
                                </div>
                              </label>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="lg:col-span-2 flex flex-col">
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-0 flex flex-col h-full overflow-hidden min-h-[400px]">
                    <div className="p-4 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
                      <h3 className="font-semibold text-slate-200 flex items-center gap-2"><span className="text-sky-400">👁</span> Live Preview</h3>
                    </div>
                    <div className="flex-1 bg-white flex flex-col">
                      <div className="p-4 border-b border-gray-200 shadow-sm">
                        <h4 className="text-lg font-bold text-gray-800 truncate">{emailForm.subject || "Subject will appear here"}</h4>
                      </div>
                      <iframe className="flex-1 w-full border-0 min-h-[300px]" srcDoc={emailForm.message || "<p style='font-family:sans-serif;color:#666;padding:20px'>Email content goes here...</p>"} title="Email Preview" />
                    </div>
                  </div>
                </div>
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
                <div key={i} className="glass-card bg-slate-800 border-slate-700 flex flex-col p-6 rounded-2xl hover:-translate-y-1 hover:border-sky-500/30 transition-all duration-300 shadow-xl overflow-hidden">
                  <h4 className="text-lg font-bold text-white mb-3 text-sky-400 truncate">{t.name}</h4>
                  <div className="text-sm text-slate-400 mb-6 flex-1 bg-white border border-slate-700 rounded-xl overflow-hidden relative shadow-inner min-h-[150px]">
                    <iframe srcDoc={t.content} title={t.name} className="absolute inset-0 w-[200%] h-[200%] border-0 pointer-events-none scale-50 origin-top-left" />
                    {!t.content.includes('<') && <p className="p-4 text-slate-800">{t.content}</p>}
                  </div>
                  <button 
                    className="btn-outline w-full py-2.5 text-sm" 
                    onClick={() => { setEmailForm({ ...emailForm, subject: t.name, message: t.content, template: t.content }); setActiveTab("create"); }}
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="flex flex-col gap-6 max-w-lg">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">⚙️ Settings</h2>
                <p className="text-slate-400 text-sm">Manage your personal preferences.</p>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-5">
                <h3 className="font-semibold text-white border-b border-slate-700/50 pb-4">Test Configuration</h3>
                <p className="text-sm text-slate-400">Set your personal test email address. When you click <strong className="text-sky-400">🧪 Test</strong> in the Campaign Studio, the draft will be sent here instead of your full audience.</p>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Test Email ID</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-sky-500 outline-none"
                      placeholder="yourname@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                    <button
                      className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-900 transition shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                      onClick={() => {
                        if (!testEmail) { toast.warn("Enter an email address first."); return; }
                        localStorage.setItem("userTestEmail", testEmail);
                        toast.success("Test email saved!");
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Org Modal */}
      {showNewOrgModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] px-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Create Organization</h3>
            <p className="text-slate-400 mb-6 text-sm">Enter the name for your new workspace.</p>
            <input 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 mb-6"
              placeholder="Organization Name"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              autoFocus
            />
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => { setShowNewOrgModal(false); setNewOrgName(""); setShowOrgDropdown(false); }}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-700/50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateOrg}
                disabled={!newOrgName.trim()}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 transition-all font-medium text-sm disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;