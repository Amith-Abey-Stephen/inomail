import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "../utils/toast";
import * as XLSX from "xlsx";
import { OpenRouter } from "@openrouter/sdk";

function AdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const adminEmail = localStorage.getItem("email") || "admin@inomail.com";

  const [activeTab, setActiveTab] = useState("dashboard");
  const [recipients, setRecipients] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [organizations, setOrganizations] = useState([
    { id: 1, name: "InoMail Organization" },
    { id: 2, name: "Acme Corp" },
  ]);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [assets, setAssets] = useState([]);

  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
    template: "",
  });

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("User");
  const [attachment, setAttachment] = useState(null);

  // Organization settings + SMTP config
  const [orgSettings, setOrgSettings] = useState({
    name: "InoMail Organization",
    email: adminEmail,
    address: "",
    logo: null,
    senderName: "InoMail",
    replyTo: adminEmail,
    apiKey: "",
    darkMode: false,
    notifications: true,
    twoFA: false,
  });

  const [smtpConfig, setSmtpConfig] = useState({
    host: "",
    port: "587",
    encryption: "TLS",
    username: "",
    password: "",
  });

  useEffect(() => {
    const savedOrg = localStorage.getItem("orgSettings");
    const savedSmtp = localStorage.getItem("smtpConfig");
    const savedDrafts = localStorage.getItem("sharedDrafts");
    
    if (savedOrg) {
      try { setOrgSettings(JSON.parse(savedOrg)); } catch (e) {}
    }
    if (savedSmtp) {
      try { setSmtpConfig(JSON.parse(savedSmtp)); } catch (e) {}
    }
    if (savedDrafts) {
      try { setDrafts(JSON.parse(savedDrafts)); } catch (e) {}
    }
    
    const handleStorageChange = () => {
      const updatedDrafts = localStorage.getItem("sharedDrafts");
      if (updatedDrafts) try { setDrafts(JSON.parse(updatedDrafts)); } catch(e){}
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (role !== "admin") navigate("/login");
  }, [role, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const saveAllSettings = () => {
    localStorage.setItem("orgSettings", JSON.stringify(orgSettings));
    localStorage.setItem("smtpConfig", JSON.stringify(smtpConfig));
    toast.success("Settings saved successfully");
  };

  const testSMTP = () => {
    if (!smtpConfig.host || !smtpConfig.username || !smtpConfig.password) {
      toast.warn("Please provide SMTP host, username and password to test connection.");
      return;
    }
    toast.success("SMTP connection successful (simulated)");
  };

  const regenerateApiKey = () => {
    const newKey = Math.random().toString(36).slice(2, 18);
    const updated = { ...orgSettings, apiKey: newKey };
    setOrgSettings(updated);
    localStorage.setItem("orgSettings", JSON.stringify(updated));
    toast.success("API key regenerated");
  };

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
      setRecipients([...new Set([...recipients, ...emails])]);
      toast.success(`${emails.length} recipients imported successfully!`);
    };
    reader.readAsBinaryString(file);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.warn("Please enter a topic/prompt first!");
      return;
    }
    
    setIsGenerating(true);
    toast.info("Generating content... This can take up to 60 seconds for free AI models.");

    const systemPrompt = `You are a senior frontend engineer and email template expert.
Your task is to generate production-ready code for:
1. A modern responsive web page UI
2. A matching HTML email template version

## REQUIREMENTS

### General
- Clean, modern UI design
- Mobile-first responsive layout
- Accessible (ARIA labels where needed)
- Semantic HTML5

### Web Page Version
- Use:
  - HTML + Tailwind CSS (CDN)
  - Minimal JS (only if necessary)

### Email Version (VERY IMPORTANT)
- Use ONLY Table-based layout and Inline CSS
- Compatible with Gmail, Outlook, Apple Mail
- No JavaScript, no external CSS
- Use bulletproof buttons

### CONTENT
- Topic: ${aiPrompt}
- Tone: Professional and modern
- Include placeholder images (via URLs) and CTA buttons

## SAFETY & GUARDRAILS
- No JS/External CSS/Forms in email version
- Ensure no broken HTML, proper tags, inline styles only
- Avoid spam trigger words. Keep content neutral and safe.
Follow best practices from modern UI design (inspired by Stripe, Apple, Linear).

Output ONLY a valid JSON object in this exact format representing just the email template:
{
  "subject": "The email subject line here",
  "html": "The full HTML email template here"
}

DO NOT wrap in markdown \`\`\`json blocks. Return raw JSON text. No conversational text before or after.`;

    try {
      const aiKey = import.meta.env.VITE_OPENROUTER_API_KEY || orgSettings.apiKey || "";

      if (!aiKey || aiKey.trim() === "") {
        throw new Error("No API Key found. Add OpenRouter API key inside Settings.");
      }

      // Add AbortController for 120s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${aiKey.trim()}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin || "http://localhost:5173",
          "X-Title": "InoMail Admin"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          max_tokens: 1500,
          messages: [{ role: "user", content: systemPrompt }]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.error("OpenRouter Error:", errText);
        throw new Error("Failed connecting to OpenRouter. Ensure your API Key is valid.");
      }

      const completion = await response.json();

      if (completion && completion.choices && completion.choices.length > 0) {
        let content = completion.choices[0].message.content;
        
        // Robust JSON extraction
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonString = content.substring(jsonStart, jsonEnd + 1);
          const parsed = JSON.parse(jsonString);
          
          if (parsed.subject && parsed.html) {
            setEmailForm({ ...emailForm, subject: parsed.subject, message: parsed.html, template: parsed.html });
            toast.success("AI Generation Complete!");
            setAiPrompt("");
          } else {
            toast.error("AI returned invalid format missing subject or html.");
          }
        } else {
          toast.error("AI response did not contain valid JSON.");
        }
      } else {
        toast.error("Failed to generate from AI (empty response).");
      }
    } catch (e) {
      console.error("SDK Error:", e);
      toast.error(e.message || "Error generating AI content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const sendCampaign = () => {
    if (!emailForm.subject || recipients.length === 0) return;

    setCampaigns([
      ...campaigns,
      {
        subject: emailForm.subject,
        count: recipients.length,
        date: new Date().toLocaleString(),
        status: "Sent",
      },
    ]);

    setRecipients([]);
    setEmailForm({ subject: "", message: "", template: "" });
    toast.success("Campaign deployed successfully!");
    setActiveTab("history");
  };

  const sendTestEmail = () => {
    if (!testEmail) {
      toast.warn("Please configure a Test Email ID in Settings first.");
      setActiveTab("settings");
      return;
    }
    if (!emailForm.subject || !emailForm.message) {
      toast.warn("Subject and content are required to send a test email.");
      return;
    }
    
    setCampaigns([
      ...campaigns,
      {
        subject: `[TEST] ${emailForm.subject}`,
        count: 1, 
        date: new Date().toLocaleString(),
        status: "Test Sent",
      },
    ]);
    
    toast.success(`Test payload delivered explicitly to ${testEmail}!`);
    setActiveTab("history");
  };

  const saveDraft = () => {
    if (!emailForm.subject) {
      toast.warn("Subject line is required to save a draft");
      return;
    }
    const currentDrafts = JSON.parse(localStorage.getItem("sharedDrafts")) || [];
    const newDraft = { name: emailForm.subject, content: emailForm.template || emailForm.message };
    
    const idx = currentDrafts.findIndex(d => d.name === newDraft.name);
    if (idx >= 0) currentDrafts[idx] = newDraft;
    else currentDrafts.push(newDraft);
    
    localStorage.setItem("sharedDrafts", JSON.stringify(currentDrafts));
    setDrafts(currentDrafts);
    toast.success("Draft saved! Available in templates for all users.");
  };

  const deleteDraft = (draftName) => {
    const filtered = drafts.filter(d => d.name !== draftName);
    localStorage.setItem("sharedDrafts", JSON.stringify(filtered));
    setDrafts(filtered);
    toast.success("Draft deleted successfully.");
  };

  const inviteMember = () => {
    if (!inviteEmail) return;
    setTeamMembers([...teamMembers, { email: inviteEmail, role: inviteRole }]);
    setInviteEmail("");
    toast.success(`Invite sent to ${inviteEmail}`);
  };

  const handleCreateOrg = () => {
    if (!newOrgName.trim()) return;
    const newOrg = { id: Date.now(), name: newOrgName };
    setOrganizations([...organizations, newOrg]);
    setOrgSettings({ ...orgSettings, name: newOrgName });
    setNewOrgName("");
    setShowNewOrgModal(false);
    setShowOrgDropdown(false);
    toast.success(`Organization ${newOrgName} created!`);
  };

  const handleSwitchOrg = (org) => {
    setOrgSettings({ ...orgSettings, name: org.name });
    setShowOrgDropdown(false);
    toast.success(`Switched to ${org.name}`);
  };

  return (
    <div className="flex bg-slate-900 h-screen w-full overflow-hidden text-slate-50">
      
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out bg-slate-900 border-r border-slate-800 flex flex-col w-64 shrink-0 shadow-2xl lg:shadow-none`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex flex-col relative w-[170px]">
            <h2 className="text-2xl font-black dash-gradient cursor-pointer pl-1" onClick={() => navigate("/")} >InoMail</h2>
            <div 
              className="mt-3 flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg px-3 py-2.5 cursor-pointer transition w-full"
              onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            >
              <p className="text-xs text-slate-300 font-medium truncate uppercase">{orgSettings.name}</p>
              <span className="text-slate-500 text-xs ml-2">▼</span>
            </div>
            
            {showOrgDropdown && (
              <div className="absolute top-[84px] left-0 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="max-h-40 overflow-y-auto">
                  {organizations.map(org => (
                    <div 
                      key={org.id} 
                      className={`px-3 py-2.5 text-xs cursor-pointer hover:bg-slate-700 transition ${orgSettings.name === org.name ? 'text-sky-400 font-bold bg-slate-900 border-l-2 border-sky-400' : 'text-slate-300'}`}
                      onClick={() => handleSwitchOrg(org)}
                    >
                      {org.name}
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
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>✕</button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: "M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" },
            { id: "send", label: "Send Email", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" },
            { id: "drafts", label: "Drafts", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
            { id: "history", label: "History", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { id: "members", label: "Members", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
            { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }
          ].map(tab => (
            <button 
              key={tab.id}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? "bg-slate-800 text-sky-400 font-medium" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`} 
              onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d={tab.icon}/>
                {tab.id === "settings" && <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>}
              </svg>
              {tab.label}
            </button>
          ))}
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-auto" onClick={logout}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-slate-900/50 relative">
        <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 p-4 md:p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/50" onClick={() => setMobileMenuOpen(true)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold dash-gradient capitalize tracking-wider">{activeTab}</h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1">Administrative Control Panel</p>
            </div>
          </div>
          <div className="text-sm font-medium text-slate-300 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 hidden md:flex">
            {adminEmail}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 space-y-6 md:space-y-8">
          
          {/* ================= DASHBOARD ================= */}
          {activeTab === "dashboard" && (
            <>
              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">📊 Organization Analytics</h2>
                  <p className="text-slate-400 mb-6 max-w-lg">Real-time insights of your email campaigns and system performance</p>
                  <div className="flex flex-wrap gap-4 md:gap-8">
                    <div>
                      <span className="text-sm text-slate-400 block mb-1">🚀 Active Campaigns</span>
                      <strong className="text-2xl font-bold text-white">{campaigns.length}</strong>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400 block mb-1">📬 Total Reach</span>
                      <strong className="text-2xl font-bold text-white">{recipients.length}</strong>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400 block mb-1">👥 Team Size</span>
                      <strong className="text-2xl font-bold text-white">{teamMembers.length}</strong>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center min-w-[200px]">
                  <p className="text-sm text-slate-400 font-medium mb-3">⚡ System Health</p>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                    </span>
                    <strong className="text-emerald-400 font-bold">Operational</strong>
                  </div>
                  <small className="text-slate-500 text-xs">SMTP • API • Queue</small>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-slate-800/40 border border-blue-500/20 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">📧</div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg">📧</div>
                    <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded-full">+12.4%</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{campaigns.length}</p>
                  <h4 className="text-slate-400 text-sm font-medium">Total Campaigns</h4>
                </div>
                <div className="bg-slate-800/40 border border-emerald-500/20 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">👥</div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg">👥</div>
                    <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-full">+8.2%</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{recipients.length}</p>
                  <h4 className="text-slate-400 text-sm font-medium">Email Recipients</h4>
                </div>
                <div className="bg-slate-800/40 border border-purple-500/20 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">🏢</div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-purple-500/20 text-purple-400 p-2 rounded-lg">🏢</div>
                    <span className="text-xs text-purple-400 font-medium bg-purple-500/10 px-2 py-1 rounded-full">+3</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{teamMembers.length}</p>
                  <h4 className="text-slate-400 text-sm font-medium">Team Members</h4>
                </div>
                <div className="bg-slate-800/40 border border-amber-500/20 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">⚡</div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-amber-500/20 text-amber-400 p-2 rounded-lg">⚡</div>
                    <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-full">LIVE</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">99.9%</p>
                  <h4 className="text-slate-400 text-sm font-medium">Success Rate</h4>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">📈 Email Performance</h3>
                    <span className="px-2.5 py-1 bg-red-500/10 text-red-400 text-xs rounded-full font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>Live</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/30">
                      <h4 className="text-2xl font-bold text-white">12,540</h4>
                      <span className="text-xs text-slate-400 font-medium">Emails Sent</span>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/30">
                      <h4 className="text-2xl font-bold text-emerald-400">98.9%</h4>
                      <span className="text-xs text-slate-400 font-medium">Open Rate</span>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/30">
                      <h4 className="text-2xl font-bold text-sky-400">76.4%</h4>
                      <span className="text-xs text-slate-400 font-medium">Click Rate</span>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/30">
                      <h4 className="text-2xl font-bold text-amber-400">0.8%</h4>
                      <span className="text-xs text-slate-400 font-medium">Bounce Rate</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col">
                  <h3 className="text-lg font-semibold text-white mb-6">🕒 Recent Activity</h3>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-slate-900 bg-sky-500 group-[.is-active]:bg-emerald-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-sm font-medium text-slate-200">New campaign deployed</p>
                        <time className="text-xs text-slate-500">2 minutes ago</time>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-slate-900 bg-sky-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-sm font-medium text-slate-200">{teamMembers.length} team members active</p>
                        <time className="text-xs text-slate-500">Today</time>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================= SEND EMAIL BUILDER ================= */}
          {activeTab === "send" && (
            <div className="flex flex-col gap-6 lg:h-full">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">🚀 Campaign Studio</h2>
                  <p className="text-slate-400 text-sm">Design, personalize, and launch enterprise emails</p>
                  <div className="flex gap-4 mt-4">
                    <div className="bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs font-medium"><span className="text-slate-400">Recipients:</span> <span className="text-white">{recipients.length}</span></div>
                    <div className="bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs font-medium"><span className="text-slate-400">Risk:</span> <span className="text-emerald-400">Low</span></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 rounded-xl border border-slate-600 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors" onClick={saveDraft}>💾 Save Draft</button>
                  <button className="px-4 py-2 rounded-xl border border-sky-500/50 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-sm font-medium transition-colors" onClick={sendTestEmail}>🧪 Test</button>
                  <button className={`px-5 py-2 rounded-xl font-bold transition-all shadow-lg ${!emailForm.subject || recipients.length === 0 ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-400 hover:to-indigo-400 shadow-sky-500/25"}`} onClick={sendCampaign} disabled={!emailForm.subject || recipients.length === 0}>🚀 Launch</button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-[500px]">
                <div className="lg:col-span-3 flex flex-col gap-6">
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-white">✍ Composer</h3>
                    </div>
                    
                    <div className="bg-slate-900/50 border border-indigo-500/30 rounded-xl p-4 flex flex-col gap-3">
                      <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">✨ AI Magic Generator</label>
                      <textarea 
                        rows="2" 
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none placeholder-slate-500" 
                        placeholder="E.g., A promotional email for our new summer shoe collection..." 
                        value={aiPrompt} 
                        onChange={(e) => setAiPrompt(e.target.value)} 
                      />
                      <button 
                        className="self-end text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/40 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50" 
                        onClick={handleAIGenerate}
                        disabled={isGenerating || !aiPrompt.trim()}
                      >
                        {isGenerating ? "Generating..." : "Generate Subject & Content"}
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Subject Line</label>
                      <input className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="High converting subject..." value={emailForm.subject} onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})} />
                    </div>
                    {drafts.length > 0 && (
                      <div className="flex flex-wrap gap-2 pb-2">
                        {drafts.map((d, i) => (
                          <button 
                            key={i} 
                            className="whitespace-nowrap bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition truncate max-w-[200px]" 
                            onClick={() => setEmailForm({...emailForm, subject: d.name, message: d.content, template: d.content})}
                            title={d.name}
                          >
                            🏷️ {d.name}
                          </button>
                        ))}
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Email Content</label>
                      <textarea rows="6" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none font-mono text-sm leading-relaxed" placeholder="Write HTML or raw text here..." value={emailForm.message} onChange={(e) => setEmailForm({...emailForm, message: e.target.value})} />
                    </div>
                  </div>
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

                <div className="lg:col-span-2 flex flex-col">
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-0 flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
                       <h3 className="font-semibold text-slate-200 flex items-center gap-2"><span className="text-sky-400">👁</span> Live Preview</h3>
                    </div>
                    <div className="flex-1 bg-white flex flex-col">
                       <div className="p-4 border-b border-gray-200 shadow-sm z-10 relative">
                         <h4 className="text-lg font-bold text-gray-800">{emailForm.subject || "Subject will appear here"}</h4>
                       </div>
                       <iframe 
                         className="flex-1 w-full border-0"
                         srcDoc={emailForm.message || "<p style='font-family:sans-serif;color:#666;padding:20px'>Email content goes here...</p>"}
                         title="Email Preview"
                       />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= HISTORY ================= */}
          {activeTab === "history" && (
            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-white font-bold text-xl">Campaign Reports</h2>
                  <p className="text-slate-400 text-sm">{campaigns.length} total campaigns</p>
                </div>
                <div className="relative w-full md:w-auto">
                  <input type="text" placeholder="Search history..." className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-sky-500 outline-none w-full md:w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <span className="absolute left-3 top-2.5 text-slate-500">🔍</span>
                </div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-800/80 border-b border-slate-700/50">
                      <tr>
                        <th className="py-4 px-6 text-xs font-semibold uppercase text-slate-400 tracking-wider">Campaign</th>
                        <th className="py-4 px-6 text-xs font-semibold uppercase text-slate-400 tracking-wider">Recipients</th>
                        <th className="py-4 px-6 text-xs font-semibold uppercase text-slate-400 tracking-wider">Status</th>
                        <th className="py-4 px-6 text-xs font-semibold uppercase text-slate-400 tracking-wider">Date</th>
                        <th className="py-4 px-6 text-right text-xs font-semibold uppercase text-slate-400 tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {campaigns.filter(c => c.subject.toLowerCase().includes(search.toLowerCase())).map((c, i) => (
                        <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg">{c.subject.charAt(0)}</div>
                              <div>
                                <p className="font-semibold text-white">{c.subject}</p>
                                <span className="text-xs text-slate-500">ID: CMP-{1000 + i}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-300 font-medium">{c.count}</td>
                          <td className="py-4 px-6"><span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium">{c.status}</span></td>
                          <td className="py-4 px-6 text-slate-400 text-sm">{c.date}</td>
                          <td className="py-4 px-6 text-right">
                            <button className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition" onClick={() => setCampaigns(campaigns.filter((_, idx) => idx !== i))}>🗑</button>
                          </td>
                        </tr>
                      ))}
                      {campaigns.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-slate-500">
                            <div className="text-4xl mb-3">📭</div>
                            No campaigns sent yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= MEMBERS ================= */}
          {activeTab === "drafts" && (
            <div className="flex flex-col gap-6 lg:h-full">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">💾 Saved Drafts</h2>
                   <p className="text-slate-400">View and manage organization-wide email drafts and templates.</p>
                 </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {drafts.length === 0 && (
                  <div className="col-span-full border-2 border-dashed border-slate-700/50 rounded-2xl p-12 text-center bg-slate-800/10">
                    <span className="text-4xl mb-4 block">📝</span>
                    <h3 className="text-xl font-medium text-white mb-2">No drafts found</h3>
                    <p className="text-slate-400 max-w-sm mx-auto">Drafts you save in the Campaign Studio will appear here for you and your team.</p>
                  </div>
                )}
                {drafts.map((d, i) => (
                  <div key={i} className="glass-card bg-slate-800 border-slate-700 flex flex-col p-6 rounded-2xl shadow-xl overflow-hidden group hover:border-sky-500/50 transition-colors">
                    <h4 className="text-lg font-bold text-white mb-3 text-sky-400 truncate">{d.name}</h4>
                    <div className="text-sm text-slate-400 mb-6 flex-1 bg-white border border-slate-700 rounded-xl overflow-hidden relative shadow-inner min-h-[150px]">
                      <iframe srcDoc={d.content} title={d.name} className="absolute inset-0 w-[200%] h-[200%] border-0 pointer-events-none scale-50 origin-top-left" />
                      {!d.content.includes('<') && <p className="p-4 text-slate-800">{d.content}</p>}
                    </div>
                    <div className="flex gap-3">
                      <button 
                        className="flex-1 bg-slate-900 border border-slate-700 hover:bg-slate-700 text-white rounded-xl py-2.5 text-sm font-medium transition" 
                        onClick={() => { setEmailForm({ ...emailForm, subject: d.name, message: d.content, template: d.content }); setActiveTab("send"); }}
                      >
                        Use Draft
                      </button>
                      <button 
                        className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 px-4 rounded-xl transition hover:scale-105 active:scale-95"
                        onClick={() => deleteDraft(d.name)}
                        title="Delete Draft"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">✉️ Invite Member</h3>
                    <p className="text-sm text-slate-400">Add someone to your organization</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <input className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-sky-500 outline-none" placeholder="Email address..." value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                    <select className="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-sky-500 outline-none w-full sm:w-32" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                      <option>User</option>
                      <option>Admin</option>
                    </select>
                    <button className="bg-sky-500 hover:bg-sky-400 text-white font-medium px-6 py-2 rounded-xl transition shadow-lg shadow-sky-500/20 disabled:opacity-50" onClick={inviteMember} disabled={!inviteEmail}>Send Invite</button>
                  </div>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-center items-center text-center gap-2">
                   <div className="text-4xl">👥</div>
                   <h3 className="text-2xl font-bold text-white mt-2">{teamMembers.length}</h3>
                   <p className="text-slate-400 text-sm font-medium">Active Team Members</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {teamMembers.map((member, i) => (
                  <div key={i} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:bg-slate-800/50 transition flex flex-col items-center text-center relative group">
                    <button className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition" onClick={() => setTeamMembers(teamMembers.filter((_, idx) => idx !== i))}>✕</button>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 p-1 mb-4">
                      <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-2xl font-bold text-white">{member.email.charAt(0).toUpperCase()}</div>
                    </div>
                    <h4 className="text-white font-bold truncate w-full">{member.email}</h4>
                    <span className="text-xs bg-slate-700/50 border border-slate-600 px-3 py-1 rounded-full text-slate-300 mt-2 font-medium">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SETTINGS ================= */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold text-white">⚙️ Organization Settings</h2>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 transition" onClick={() => toast.success("Reset successful")}>Reset</button>
                  <button className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-400 px-6 py-2 rounded-xl text-sm font-bold text-slate-900 transition shadow-lg shadow-emerald-500/20" onClick={saveAllSettings}>Save Changes</button>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-5">
                    <h3 className="font-semibold text-white border-b border-slate-700/50 pb-4">Profile</h3>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Organization Name</label>
                      <input className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-sky-500 outline-none" value={orgSettings.name} onChange={(e) => setOrgSettings({...orgSettings, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Company Email</label>
                      <input className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-sky-500 outline-none" value={orgSettings.email} onChange={(e) => setOrgSettings({...orgSettings, email: e.target.value})} />
                    </div>
                  </div>

                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-5">
                    <h3 className="font-semibold text-white border-b border-slate-700/50 pb-4">Test Configuration</h3>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Test Email ID</label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input 
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-sky-500 outline-none" 
                          placeholder="recipient@example.com" 
                          value={testEmail} 
                          onChange={(e) => setTestEmail(e.target.value)} 
                        />
                        <button 
                          className="w-full sm:w-auto bg-slate-800 border border-slate-700 hover:bg-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition whitespace-nowrap" 
                          onClick={() => {
                            if (!testEmail) toast.warn("Enter a test email address first");
                            else toast.success(`Test email sent to ${testEmail}!`);
                          }}
                        >
                          Send Test
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/50 pb-4">
                      <h3 className="font-semibold text-white">Sender Email Config</h3>
                      <button className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1.5 rounded-full font-bold transition-colors w-full sm:w-auto" onClick={testSMTP}>Verify Credentials</button>
                    </div>
                    
                    <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 text-sm text-sky-200">
                      <strong>💡 How to get an App Password (Gmail):</strong>
                      <ol className="list-decimal ml-4 mt-2 space-y-2 text-xs text-sky-300">
                        <li>
                          Click here to open: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-sky-400 underline font-bold hover:text-sky-300 break-all">https://myaccount.google.com/apppasswords</a>
                        </li>
                        <li>(Make sure you have 2-Step Verification enabled on that account).</li>
                        <li>Create a new App Password for "InoMail".</li>
                        <li>Copy the 16-character code and paste it securely below.</li>
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Sender Email ID</label>
                        <input className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-sky-500 outline-none" placeholder="your-email@gmail.com" value={smtpConfig.username} onChange={(e) => setSmtpConfig({...smtpConfig, username: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">App Password</label>
                        <input type="password" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-sky-500 outline-none" placeholder="16-character app password" value={smtpConfig.password} onChange={(e) => setSmtpConfig({...smtpConfig, password: e.target.value})} />
                      </div>
                    </div>
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

export default AdminDashboard;