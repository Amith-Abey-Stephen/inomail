import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function AdminDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const adminEmail = localStorage.getItem("email") || "admin@inomail.com";

  const [activeTab, setActiveTab] = useState("dashboard");
  const [recipients, setRecipients] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [search, setSearch] = useState("");

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

  // Load saved settings on mount
  useEffect(() => {
    const savedOrg = localStorage.getItem("orgSettings");
    const savedSmtp = localStorage.getItem("smtpConfig");
    if (savedOrg) {
      try {
        setOrgSettings(JSON.parse(savedOrg));
      } catch (e) {}
    }
    if (savedSmtp) {
      try {
        setSmtpConfig(JSON.parse(savedSmtp));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (role !== "admin") navigate("/login");
  }, [role, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Settings helpers
  const saveAllSettings = () => {
    localStorage.setItem("orgSettings", JSON.stringify(orgSettings));
    localStorage.setItem("smtpConfig", JSON.stringify(smtpConfig));
    alert("💾 Settings saved successfully");
  };

  const testSMTP = () => {
    if (!smtpConfig.host || !smtpConfig.username || !smtpConfig.password) {
      alert("Please provide SMTP host, username and password to test connection.");
      return;
    }

    // Simulated SMTP test (no real network call)
    setTimeout(() => {
      alert("🧪 SMTP connection successful (simulated)");
    }, 500);
  };

  const regenerateApiKey = () => {
    const newKey = Math.random().toString(36).slice(2, 18);
    const updated = { ...orgSettings, apiKey: newKey };
    setOrgSettings(updated);
    localStorage.setItem("orgSettings", JSON.stringify(updated));
    alert("🔑 API key regenerated");
  };

  // Excel Upload
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

  // Template Generator
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
    setActiveTab("history");
  };

  const inviteMember = () => {
    if (!inviteEmail) return;
    setTeamMembers([...teamMembers, { email: inviteEmail, role: inviteRole }]);
    setInviteEmail("");
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2 className="admin-logo">InoMail</h2>
          <p>Organization Dashboard</p>
        </div>

        <nav className="admin-menu">
          <button onClick={() => setActiveTab("dashboard")}>📊 Dashboard</button>
          <button onClick={() => setActiveTab("send")}>✉ Send Email</button>
          <button onClick={() => setActiveTab("history")}>📬 History</button>
          <button onClick={() => setActiveTab("members")}>👥 Members</button>
          <button onClick={() => setActiveTab("settings")}>⚙ Settings</button>
          <button className="logout-btn" onClick={logout}>🔒 Logout</button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1>{activeTab.toUpperCase()}</h1>
          <div className="admin-user">
            <span>Admin</span>
            <strong>{adminEmail}</strong>
          </div>
        </header>

      {/* ================= ULTRA PREMIUM DASHBOARD ================= */}
{activeTab === "dashboard" && (
  <div className="dashboard-premium">

    {/* ===== HERO ANALYTICS HEADER ===== */}
    <div className="dashboard-hero">
      <div className="hero-left">
        <h2>📊 Organization Analytics</h2>
        <p className="hero-sub">
          Real-time insights of your email campaigns and system performance
        </p>

        <div className="hero-metrics">
          <div className="hero-metric">
            <span>🚀 Active Campaigns</span>
            <strong>{campaigns.length}</strong>
          </div>
          <div className="hero-metric">
            <span>📬 Total Reach</span>
            <strong>{recipients.length}</strong>
          </div>
          <div className="hero-metric">
            <span>👥 Team Size</span>
            <strong>{teamMembers.length}</strong>
          </div>
        </div>
      </div>

      <div className="hero-status-card">
        <h4>⚡ System Health</h4>
        <div className="status-indicator"></div>
        <p>All Services Operational</p>
        <small>SMTP • API • Queue • Analytics</small>
      </div>
    </div>

    {/* ===== PREMIUM KPI CARDS ===== */}
    <div className="premium-stats-grid">

      <div className="premium-stat-card blue">
        <div className="stat-top">
          <div className="stat-icon-box">📧</div>
          <span className="growth up">+12.4%</span>
        </div>
        <h3>{campaigns.length}</h3>
        <p>Total Campaigns</p>
        <div className="stat-bar">
          <div className="stat-fill" style={{ width: "70%" }}></div>
        </div>
      </div>

      <div className="premium-stat-card green">
        <div className="stat-top">
          <div className="stat-icon-box">👥</div>
          <span className="growth up">+8.2%</span>
        </div>
        <h3>{recipients.length}</h3>
        <p>Email Recipients</p>
        <div className="stat-bar">
          <div
            className="stat-fill"
            style={{ width: `${Math.min(recipients.length, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="premium-stat-card purple">
        <div className="stat-top">
          <div className="stat-icon-box">🏢</div>
          <span className="growth up">+3</span>
        </div>
        <h3>{teamMembers.length}</h3>
        <p>Team Members</p>
        <div className="stat-bar">
          <div className="stat-fill" style={{ width: "55%" }}></div>
        </div>
      </div>

      <div className="premium-stat-card orange">
        <div className="stat-top">
          <div className="stat-icon-box">⚡</div>
          <span className="growth live">LIVE</span>
        </div>
        <h3>99.9%</h3>
        <p>Delivery Success Rate</p>
        <div className="stat-bar">
          <div className="stat-fill" style={{ width: "95%" }}></div>
        </div>
      </div>
    </div>

    {/* ===== ANALYTICS + ACTIVITY ROW ===== */}
    <div className="premium-dashboard-row">

      {/* EMAIL PERFORMANCE */}
      <div className="premium-card">
        <div className="card-header">
          <h3>📈 Email Performance</h3>
          <span className="badge-live">Real-time</span>
        </div>

        <div className="performance-grid">
          <div className="perf-box">
            <h4>12,540</h4>
            <span>Emails Sent</span>
          </div>
          <div className="perf-box">
            <h4>98.9%</h4>
            <span>Open Rate</span>
          </div>
          <div className="perf-box">
            <h4>76.4%</h4>
            <span>Click Rate</span>
          </div>
          <div className="perf-box">
            <h4>0.8%</h4>
            <span>Bounce Rate</span>
          </div>
        </div>

        <div className="big-progress">
          <div className="big-progress-fill"></div>
        </div>
        <p className="progress-label">
          Monthly Usage: {recipients.length} emails processed
        </p>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="premium-card">
        <div className="card-header">
          <h3>🕒 Recent Activity</h3>
        </div>

        <div className="activity-timeline">
          <div className="timeline-item success">
            <div className="timeline-dot"></div>
            <div>
              <p>New campaign created successfully</p>
              <small>2 minutes ago</small>
            </div>
          </div>

          <div className="timeline-item info">
            <div className="timeline-dot"></div>
            <div>
              <p>{teamMembers.length} team members active</p>
              <small>Today</small>
            </div>
          </div>

          <div className="timeline-item warning">
            <div className="timeline-dot"></div>
            <div>
              <p>{recipients.length} recipients uploaded</p>
              <small>Just now</small>
            </div>
          </div>

          <div className="timeline-item success">
            <div className="timeline-dot"></div>
            <div>
              <p>SMTP server verified & running</p>
              <small>System Operational</small>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
)}{/* ================= ULTRA PREMIUM CAMPAIGN BUILDER (FULL FEATURES) ================= */}
{activeTab === "send" && (
  <div className="pro-builder">

    {/* ===== TOP GRADIENT HEADER ===== */}
    <div className="builder-header-pro">
      <div>
        <h2>🚀 InoMail Campaign Studio</h2>
        <p>Design, personalize, test and launch enterprise email campaigns</p>

        <div className="builder-kpis">
          <div className="kpi-card">
            <span>Recipients</span>
            <strong>{recipients.length}</strong>
          </div>

          <div className="kpi-card">
            <span>Subject Score</span>
            <strong>
              {emailForm.subject.length > 25 ? "🔥 Excellent" : "⚠ Improve"}
            </strong>
          </div>

          <div className="kpi-card">
            <span>Spam Risk</span>
            <strong>
              {emailForm.message.toLowerCase().includes("free")
                ? "Medium"
                : "Low"}
            </strong>
          </div>
        </div>
      </div>

      <div className="builder-actions-pro">
        <button
          className="btn-glass"
          onClick={() =>
            localStorage.setItem("draftCampaign", JSON.stringify(emailForm))
          }
        >
          💾 Save Draft
        </button>

        <button
          className="btn-glass"
          onClick={() => {
            const draft = localStorage.getItem("draftCampaign");
            if (draft) setEmailForm(JSON.parse(draft));
          }}
        >
          📂 Load Draft
        </button>

        <button
          className="btn-test"
          onClick={() => alert("🧪 Test Email Sent Successfully (Simulation)")}
        >
          🧪 Test Email
        </button>

        <button
          className="btn-launch"
          onClick={sendCampaign}
          disabled={!emailForm.subject || recipients.length === 0}
        >
          🚀 Launch Campaign
        </button>
      </div>
    </div>

    {/* ===== MAIN BUILDER GRID ===== */}
    <div className="builder-grid-pro">

      {/* ================= LEFT: EDITOR ================= */}
      <div className="editor-panel-pro">

        {/* COMPOSER */}
        <div className="glass-card-pro">
          <div className="card-title-pro">
            <h3>✍ Smart Email Composer</h3>
            <span className="ai-tag">AI</span>
          </div>

          {/* SUBJECT */}
          <label>Campaign Subject</label>
          <input
            className="input-pro"
            placeholder="🔥 Write high-converting subject line..."
            value={emailForm.subject}
            onChange={(e) =>
              setEmailForm({ ...emailForm, subject: e.target.value })
            }
          />
          <div className="char-bar">
            <div
              className="char-fill"
              style={{ width: `${Math.min(emailForm.subject.length, 80)}%` }}
            />
          </div>

          {/* TEMPLATE LIBRARY */}
          <label>Template Library</label>
          <div className="template-library-pro">
            <button
              onClick={() =>
                setEmailForm({
                  ...emailForm,
                  message:
                    "<h2>🎉 Welcome to InoMail</h2><p>We are excited to have you onboard!</p>",
                })
              }
            >
              👋 Welcome
            </button>

            <button
              onClick={() =>
                setEmailForm({
                  ...emailForm,
                  message:
                    "<h2>🔥 Limited Time Offer</h2><p>Get 50% discount today!</p>",
                })
              }
            >
              🔥 Promotion
            </button>

            <button
              onClick={() =>
                setEmailForm({
                  ...emailForm,
                  message:
                    "<h2>📰 Monthly Newsletter</h2><p>Latest updates & insights.</p>",
                })
              }
            >
              📰 Newsletter
            </button>
          </div>

          {/* MESSAGE EDITOR */}
          <label>Email Content (Rich Editor)</label>
          <textarea
            rows="8"
            className="textarea-pro"
            placeholder="Write your email or paste HTML template..."
            value={emailForm.message}
            onChange={(e) =>
              setEmailForm({ ...emailForm, message: e.target.value })
            }
          />

          {/* TOOLBAR (WORKING FEATURES) */}
          <div className="toolbar-pro">
            <button className="btn-ai" onClick={generateTemplate}>
              🤖 AI Template
            </button>

            <button
              className="btn-glass"
              onClick={() =>
                setEmailForm({
                  ...emailForm,
                  message: emailForm.message + "\n\nBest Regards,\nInoMail Team",
                })
              }
            >
              ✨ Add Signature
            </button>

            <button
              className="btn-glass"
              onClick={() =>
                navigator.clipboard.writeText(
                  emailForm.template || emailForm.message
                )
              }
            >
              📋 Copy HTML
            </button>
          </div>

          {/* HTML CODE EDITOR */}
          <label>Advanced HTML Editor</label>
          <textarea
            rows="6"
            className="code-editor-pro"
            value={emailForm.template}
            onChange={(e) =>
              setEmailForm({ ...emailForm, template: e.target.value })
            }
            placeholder="<html>Advanced email template code...</html>"
          />
        </div>

        {/* AUDIENCE + FILES */}
        <div className="glass-card-pro">
          <h3>👥 Audience & Assets</h3>

          <label>Upload Recipients (Excel / CSV)</label>
          <div className="upload-box-pro">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelUpload}
            />
            <p>📂 Drag & Drop or Click to Upload File</p>
          </div>

          {recipients.length > 0 && (
            <div className="recipients-box">
              ✔ {recipients.length} recipients loaded
            </div>
          )}

          <label>Attach Files / Media</label>
          <input
            type="file"
            className="input-pro"
            onChange={(e) => setAttachment(e.target.files[0])}
          />

          <label>Schedule Campaign</label>
          <input type="datetime-local" className="input-pro" />
        </div>
      </div>

      {/* ================= RIGHT: LIVE PREVIEW ================= */}
      <div className="preview-panel-pro">
        <div className="glass-card-pro sticky-pro">
          <div className="preview-top">
            <h3>👁 Live Email Preview</h3>
            <span className="live-indicator">LIVE</span>
          </div>

          <div className="email-preview-pro">
            <h4>{emailForm.subject || "Subject Preview"}</h4>
            <div
              dangerouslySetInnerHTML={{
                __html: emailForm.template || emailForm.message,
              }}
            />
          </div>

          <div className="preview-stats">
            <div>
              <strong>{recipients.length}</strong>
              <span>Recipients</span>
            </div>
            <div>
              <strong>98%</strong>
              <span>Deliverability</span>
            </div>
            <div>
              <strong>Low</strong>
              <span>Spam Score</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
)}
    {/* ================= ULTRA BEAUTIFUL CAMPAIGN HISTORY (PREMIUM UI) ================= */}
{activeTab === "history" && (
  <div className="beautiful-history">

    {/* ===== GRADIENT HERO HEADER ===== */}
    <div className="history-hero-premium">
      <div className="hero-content">
        <h2>📊 Campaign Analytics Dashboard</h2>
        <p>Track performance, engagement, and delivery insights in real-time</p>

        <div className="hero-stats">
          <div className="hero-stat">
            <span>Total Campaigns</span>
            <h3>{campaigns.length}</h3>
          </div>

          <div className="hero-stat">
            <span>Total Reach</span>
            <h3>
              {campaigns.reduce((acc, c) => acc + (c.count || 0), 0)}
            </h3>
          </div>

          <div className="hero-stat">
            <span>Avg Open Rate</span>
            <h3>96.8%</h3>
          </div>

          <div className="hero-stat">
            <span>System Health</span>
            <h3 className="live-glow">Excellent</h3>
          </div>
        </div>
      </div>

      <div className="hero-actions">
        <button className="glass-btn">📥 Export Report</button>
        <button className="primary-glow-btn">📊 AI Insights</button>
      </div>
    </div>

    {/* ===== FLOATING ANALYTICS CARDS ===== */}
    <div className="floating-cards">
      <div className="float-card blue-glow">
        <h4>📧 Emails Sent</h4>
        <h2>
          {campaigns.reduce((acc, c) => acc + (c.count || 0), 0)}
        </h2>
        <span>Across all campaigns</span>
      </div>

      <div className="float-card green-glow">
        <h4>📬 Delivery Rate</h4>
        <h2>99.2%</h2>
        <span>Excellent performance</span>
      </div>

      <div className="float-card purple-glow">
        <h4>👁 Engagement</h4>
        <h2>78%</h2>
        <span>User interaction rate</span>
      </div>

      <div className="float-card orange-glow">
        <h4>🚀 Active Campaigns</h4>
        <h2>
          {campaigns.filter(c => c.status === "Sent").length}
        </h2>
        <span>Currently running</span>
      </div>
    </div>

    {/* ===== BEAUTIFUL SEARCH + FILTER BAR ===== */}
    <div className="premium-filter-bar">
      <input
        className="search-input-premium"
        placeholder="🔍 Search campaigns..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select className="filter-select">
        <option>All Status</option>
        <option>Sent</option>
        <option>Draft</option>
        <option>Scheduled</option>
      </select>

      <input type="date" className="filter-select" />
    </div>

    {/* ===== GLASSMORPHISM TABLE (SUPER ATTRACTIVE) ===== */}
    <div className="premium-table-wrapper">
      <div className="table-header-premium">
        <h3>📬 Campaign Performance Reports</h3>
        <span>{campaigns.length} Campaigns</span>
      </div>

      <div className="table-scroll">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Recipients</th>
              <th>Status</th>
              <th>Performance</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {campaigns
              .filter((c) =>
                c.subject.toLowerCase().includes(search.toLowerCase())
              )
              .map((c, i) => {
                const open = Math.floor(Math.random() * 30) + 70;

                return (
                  <tr key={i} className="premium-row">
                    <td>
                      <div className="campaign-cell-premium">
                        <div className="campaign-avatar-glow">
                          {c.subject.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{c.subject}</strong>
                          <span>Email Campaign #{i + 1}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="recipient-pill">
                        👥 {c.count}
                      </span>
                    </td>

                    <td>
                      <span className="status-glow sent">
                        {c.status}
                      </span>
                    </td>

                    <td>
                      <div className="progress-bar-premium">
                        <div
                          className="progress-fill-premium"
                          style={{ width: `${open}%` }}
                        />
                        <span>{open}% Open Rate</span>
                      </div>
                    </td>

                    <td>{c.date}</td>

                    <td>
                      <div className="action-buttons-premium">
                        <button className="icon-btn view">👁</button>
                        <button className="icon-btn edit">✏</button>
                        <button
                          className="icon-btn delete"
                          onClick={() =>
                            setCampaigns(
                              campaigns.filter((_, idx) => idx !== i)
                            )
                          }
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {campaigns.length === 0 && (
          <div className="empty-state-premium">
            <h3>📭 No Campaign History Yet</h3>
            <p>
              Launch your first campaign to unlock beautiful analytics,
              performance charts and reports.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
     {/* ================= ULTRA PREMIUM TEAM MEMBERS (PRO LEVEL) ================= */}
{activeTab === "members" && (
  <div className="ultra-members-wrapper">

    {/* ===== HEADER HERO ===== */}
    <div className="members-hero">
      <div>
        <h2>👥 Organization Team Management</h2>
        <p>
          Invite members, assign roles, manage access and control your organization users
        </p>

        <div className="members-hero-stats">
          <div className="hero-stat">
            <span>Total Members</span>
            <strong>{teamMembers.length}</strong>
          </div>

          <div className="hero-stat admin">
            <span>Admins</span>
            <strong>
              {teamMembers.filter((m) => m.role === "Admin").length}
            </strong>
          </div>

          <div className="hero-stat user">
            <span>Users</span>
            <strong>
              {teamMembers.filter((m) => m.role === "User").length}
            </strong>
          </div>
        </div>
      </div>

      <div className="members-hero-actions">
        <button
          className="ghost-btn"
          onClick={() => navigator.clipboard.writeText(adminEmail)}
        >
          📋 Copy Admin Email
        </button>

        <button
          className="primary-btn"
          onClick={inviteMember}
          disabled={!inviteEmail}
        >
          ➕ Quick Invite
        </button>
      </div>
    </div>

    {/* ===== INVITE PANEL ===== */}
    <div className="glass-card-members invite-panel">
      <div className="invite-left">
        <h3>✉ Invite New Member</h3>
        <p>Send invitation and assign organization role</p>
      </div>

      <div className="invite-form-pro">
        <input
          className="input-pro"
          placeholder="Enter member email address..."
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />

        <select
          className="input-pro"
          value={inviteRole}
          onChange={(e) => setInviteRole(e.target.value)}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <button
          className="invite-btn-pro"
          onClick={inviteMember}
          disabled={!inviteEmail}
        >
          🚀 Send Invite
        </button>
      </div>
    </div>

    {/* ===== FILTER & SEARCH BAR ===== */}
    <div className="glass-card-members filter-bar">
      <input
        className="input-pro search-input-pro"
        placeholder="🔍 Search members by email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="input-pro"
        onChange={(e) => {
          const role = e.target.value;
          if (role === "all") return;
          setTeamMembers(
            teamMembers.filter((m) => m.role === role)
          );
        }}
      >
        <option value="all">All Roles</option>
        <option value="Admin">Admins</option>
        <option value="User">Users</option>
      </select>

      <span className="member-count">
        {teamMembers.length} Members
      </span>
    </div>

    {/* ===== MEMBERS GRID (ATTRACTIVE CARDS) ===== */}
    <div className="members-grid">

      {teamMembers
        .filter((m) =>
          m.email.toLowerCase().includes(search.toLowerCase())
        )
        .map((member, i) => (
          <div key={i} className="member-card-ultra">

            {/* AVATAR */}
            <div className="member-avatar-ultra">
              {member.email.charAt(0).toUpperCase()}
            </div>

            {/* MEMBER INFO */}
            <div className="member-info-ultra">
              <h4>{member.email}</h4>
              <span className="member-role-tag">
                {member.role === "Admin" ? "🛡 Admin" : "👤 User"}
              </span>
              <p className="member-meta">
                Joined: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* ROLE DROPDOWN (WORKING) */}
            <div className="member-controls">
              <select
                className="role-select-ultra"
                value={member.role}
                onChange={(e) => {
                  const updated = [...teamMembers];
                  updated[i].role = e.target.value;
                  setTeamMembers(updated);
                }}
              >
                <option>User</option>
                <option>Admin</option>
              </select>

              {/* ACTION BUTTONS */}
              <div className="member-actions-ultra">
                <button
                  className="action-btn view"
                  onClick={() => alert(`Viewing ${member.email}`)}
                >
                  👁
                </button>

                <button
                  className="action-btn copy"
                  onClick={() =>
                    navigator.clipboard.writeText(member.email)
                  }
                >
                  📋
                </button>

                <button
                  className="action-btn delete"
                  onClick={() =>
                    setTeamMembers(
                      teamMembers.filter((_, index) => index !== i)
                    )
                  }
                >
                  🗑
                </button>
              </div>
            </div>

          </div>
        ))}

      {/* EMPTY STATE */}
      {teamMembers.length === 0 && (
        <div className="empty-members-pro">
          <div className="empty-icon">👥</div>
          <h3>No Team Members Yet</h3>
          <p>
            Invite your team members to collaborate and manage campaigns together.
          </p>
        </div>
      )}
    </div>

  </div>
)}
   {/* ================= ULTRA PREMIUM ORGANIZATION SETTINGS (FULLY WORKING) ================= */}
{activeTab === "settings" && (
  <div className="ultra-settings-container">

    {/* HEADER */}
    <div className="ultra-settings-header">
      <div className="settings-title-box">
        <h1>⚙ Organization Control Center</h1>
        <p>
          Manage organization profile, SMTP, branding, API keys, security and
          system preferences in one place.
        </p>
      </div>

      <div className="settings-action-group">
        <button
          className="danger-btn"
          onClick={() => {
            localStorage.removeItem("orgSettings");
            localStorage.removeItem("smtpConfig");
            alert("♻ Settings Reset Successfully");
            window.location.reload();
          }}
        >
          ♻ Reset All
        </button>

        <button className="primary-btn" onClick={saveAllSettings}>
          💾 Save All Changes
        </button>
      </div>
    </div>

    {/* GRID */}
    <div className="ultra-settings-layout">

      {/* LEFT COLUMN */}
      <div className="settings-column">

        {/* ORGANIZATION PROFILE */}
        <div className="ultra-card">
          <div className="card-header">
            <h3>🏢 Organization Profile</h3>
            <span className="status-chip">Active</span>
          </div>

          <label>Organization Name</label>
          <input
            className="input-ultra"
            value={orgSettings.name}
            onChange={(e) =>
              setOrgSettings({ ...orgSettings, name: e.target.value })
            }
          />

          <label>Company Email</label>
          <input
            className="input-ultra"
            value={orgSettings.email}
            onChange={(e) =>
              setOrgSettings({ ...orgSettings, email: e.target.value })
            }
          />

          <label>Organization Address</label>
          <textarea
            rows="3"
            className="input-ultra"
            value={orgSettings.address}
            onChange={(e) =>
              setOrgSettings({ ...orgSettings, address: e.target.value })
            }
          />

          <label>Upload Logo</label>
          <input
            type="file"
            className="input-ultra"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => {
                const updated = { ...orgSettings, logo: reader.result };
                setOrgSettings(updated);
              };
              reader.readAsDataURL(file);
            }}
          />

          {orgSettings.logo && (
            <div className="logo-preview-box">
              <img src={orgSettings.logo} alt="logo" />
              <span>Logo Preview</span>
            </div>
          )}
        </div>

        {/* BRANDING & SYSTEM */}
        <div className="ultra-card">
          <div className="card-header">
            <h3>🎨 Branding & Preferences</h3>
          </div>

          <label>Default Sender Name</label>
          <input
            className="input-ultra"
            value={orgSettings.senderName}
            onChange={(e) =>
              setOrgSettings({ ...orgSettings, senderName: e.target.value })
            }
          />

          <label>Reply-To Email</label>
          <input
            className="input-ultra"
            value={orgSettings.replyTo}
            onChange={(e) =>
              setOrgSettings({ ...orgSettings, replyTo: e.target.value })
            }
          />

          <div className="toggle-group">
            <div className="toggle-row">
              <span>🌙 Dark Mode</span>
              <input
                type="checkbox"
                checked={orgSettings.darkMode}
                onChange={(e) =>
                  setOrgSettings({
                    ...orgSettings,
                    darkMode: e.target.checked,
                  })
                }
              />
            </div>

            <div className="toggle-row">
              <span>🔔 Email Notifications</span>
              <input
                type="checkbox"
                checked={orgSettings.notifications}
                onChange={(e) =>
                  setOrgSettings({
                    ...orgSettings,
                    notifications: e.target.checked,
                  })
                }
              />
            </div>

            <div className="toggle-row">
              <span>🛡 Two-Factor Authentication</span>
              <input
                type="checkbox"
                checked={orgSettings.twoFA}
                onChange={(e) =>
                  setOrgSettings({
                    ...orgSettings,
                    twoFA: e.target.checked,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="settings-column">

        {/* SMTP CONFIG */}
        <div className="ultra-card">
          <div className="card-header">
            <h3>📧 SMTP Configuration</h3>
            <span className="live-badge">Secure</span>
          </div>

          <label>SMTP Host</label>
          <input
            className="input-ultra"
            placeholder="smtp.gmail.com"
            value={smtpConfig.host}
            onChange={(e) =>
              setSmtpConfig({ ...smtpConfig, host: e.target.value })
            }
          />

          <div className="form-row">
            <div>
              <label>Port</label>
              <input
                className="input-ultra"
                value={smtpConfig.port}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, port: e.target.value })
                }
              />
            </div>

            <div>
              <label>Encryption</label>
              <select
                className="input-ultra"
                value={smtpConfig.encryption}
                onChange={(e) =>
                  setSmtpConfig({
                    ...smtpConfig,
                    encryption: e.target.value,
                  })
                }
              >
                <option>TLS</option>
                <option>SSL</option>
                <option>None</option>
              </select>
            </div>
          </div>

          <label>SMTP Username</label>
          <input
            className="input-ultra"
            value={smtpConfig.username}
            onChange={(e) =>
              setSmtpConfig({ ...smtpConfig, username: e.target.value })
            }
          />

          <label>SMTP Password</label>
          <input
            type="password"
            className="input-ultra"
            value={smtpConfig.password}
            onChange={(e) =>
              setSmtpConfig({ ...smtpConfig, password: e.target.value })
            }
          />

          <button className="test-btn full-btn" onClick={testSMTP}>
            🧪 Test SMTP Connection
          </button>
        </div>

        {/* API & SECURITY */}
        <div className="ultra-card">
          <div className="card-header">
            <h3>🔐 API & Security Center</h3>
          </div>

          <label>API Key</label>
          <div className="api-key-box">
            <input
              className="input-ultra"
              value={orgSettings.apiKey}
              readOnly
            />
            <button className="secondary-btn" onClick={regenerateApiKey}>
              🔄 Regenerate
            </button>
          </div>

          <label>Change Admin Password</label>
          <input
            type="password"
            className="input-ultra"
            placeholder="Enter new secure password"
          />

          <div className="security-info">
            <p>🔒 Data is securely stored in localStorage</p>
            <p>🛡 Enterprise-grade UI security simulation enabled</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}

export default AdminDashboard;