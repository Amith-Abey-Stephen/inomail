import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function UserDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userEmail = localStorage.getItem("email");
  const organization = localStorage.getItem("orgName") || "My Organization";

  /* ================= PERMISSIONS (ORG CONTROL) ================= */
  const permissions = JSON.parse(localStorage.getItem("userPermissions")) || {
    canSendEmails: true,
    canViewHistory: true,
    canUseTemplates: true,
    canAccessAssets: true,
  };

  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (role !== "user") navigate("/login");
  }, [role, navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ================= CAMPAIGNS ================= */
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

  /* ================= CREATE CAMPAIGN ================= */
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    content: "",
  });

  const createCampaign = () => {
    if (!permissions.canSendEmails) {
      alert("🚫 Email sending disabled by organization");
      return;
    }

    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) {
      alert("All fields are required");
      return;
    }

    setCampaigns([
      ...campaigns,
      {
        ...newCampaign,
        emails: Math.floor(Math.random() * 2000),
        status: "Draft",
        date: new Date().toLocaleDateString(),
      },
    ]);

    setNewCampaign({ name: "", subject: "", content: "" });
    setActiveTab("history");
  };

  /* ================= TEMPLATES ================= */
  const templates = [
    {
      name: "Welcome Email",
      content: "🎉 Welcome to our platform! We're happy to have you.",
    },
    {
      name: "Promotion",
      content: "🔥 Limited Offer! Get 50% discount today!",
    },
    {
      name: "Newsletter",
      content: "📰 Here are our latest updates and news.",
    },
  ];

  /* ================= ASSETS ================= */
  const [assets, setAssets] = useState([]);
  const handleAssetUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAssets([...assets, file.name]);
  };

  return (
    <div className="user-wrapper">
      {/* SIDEBAR */}
      <aside className="user-sidebar">
        <div>
          <h2 className="logo">InoMail</h2>
          <p className="org">{organization}</p>
        </div>

        <nav className="user-menu">
          <button onClick={() => setActiveTab("dashboard")}>📊 Dashboard</button>

          {permissions.canSendEmails && (
            <button onClick={() => setActiveTab("create")}>✉ Send Email</button>
          )}

          {permissions.canViewHistory && (
            <button onClick={() => setActiveTab("history")}>📁 History</button>
          )}

          {permissions.canUseTemplates && (
            <button onClick={() => setActiveTab("templates")}>🧩 Templates</button>
          )}

          {permissions.canAccessAssets && (
            <button onClick={() => setActiveTab("assets")}>📦 Assets</button>
          )}
        </nav>

        <button className="logout-btn" onClick={logout}>
          🔒 Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="user-main">
        {/* TOPBAR */}
        <div className="user-topbar">
          <h1>{activeTab.toUpperCase()}</h1>
          <div className="user-profile">
            <span>Team Member</span>
            <strong>{userEmail}</strong>
          </div>
        </div>

        {/* ================= ULTRA ATTRACTIVE DASHBOARD ================= */}
{activeTab === "dashboard" && (
  <div className="ultra-dashboard">

    {/* ===== HERO HEADER ===== */}
    <div className="dashboard-hero">
      <div className="hero-left">
        <h2>🚀 Team Member Dashboard</h2>
        <p className="hero-sub">
          Welcome back! Monitor campaigns, templates, and assets in real-time.
        </p>

        <div className="hero-badges">
          <span className="badge success">Active</span>
          <span className="badge info">Team Access</span>
          <span className="badge glow">Live System</span>
        </div>
      </div>

      <div className="hero-right">
        <div className="user-glass-card">
          <h4>👤 Logged in</h4>
          <strong>{userEmail}</strong>
          <p>{organization}</p>
        </div>
      </div>
    </div>

    {/* ===== PREMIUM KPI CARDS ===== */}
    <div className="dashboard-grid premium-grid">

      <div className="kpi-card blue">
        <div className="kpi-icon">📊</div>
        <div>
          <h4>Total Campaigns</h4>
          <p>{campaigns.length}</p>
          <span className="kpi-sub">Created campaigns</span>
        </div>
      </div>

      <div className="kpi-card green">
        <div className="kpi-icon">📧</div>
        <div>
          <h4>Email Access</h4>
          <p>
            {permissions.canSendEmails ? "Allowed" : "Restricted"}
          </p>
          <span className="kpi-sub">Permission status</span>
        </div>
      </div>

      <div className="kpi-card purple">
        <div className="kpi-icon">🧩</div>
        <div>
          <h4>Templates</h4>
          <p>{templates.length}</p>
          <span className="kpi-sub">Available templates</span>
        </div>
      </div>

      <div className="kpi-card orange">
        <div className="kpi-icon">📦</div>
        <div>
          <h4>Assets Library</h4>
          <p>{assets.length}</p>
          <span className="kpi-sub">Uploaded files</span>
        </div>
      </div>
    </div>

    {/* ===== SYSTEM + ACTIVITY ROW ===== */}
    <div className="dashboard-row">

      {/* SYSTEM STATUS CARD */}
      <div className="glass-card system-card">
        <div className="card-header">
          <h3>⚡ System Status</h3>
          <span className="live-dot"></span>
        </div>

        <div className="status-grid">
          <div className="status-box">
            <strong>SMTP</strong>
            <span className="status ok">Operational</span>
          </div>

          <div className="status-box">
            <strong>Email Queue</strong>
            <span className="status ok">Running</span>
          </div>

          <div className="status-box">
            <strong>Templates</strong>
            <span className="status ok">Loaded</span>
          </div>

          <div className="status-box">
            <strong>Assets</strong>
            <span className="status ok">Active</span>
          </div>
        </div>

        <div className="usage-bar">
          <div
            className="usage-fill"
            style={{ width: `${Math.min(campaigns.length * 10, 100)}%` }}
          />
        </div>
        <small>Usage Activity Level</small>
      </div>

      {/* RECENT ACTIVITY TIMELINE */}
      <div className="glass-card activity-card-pro">
        <h3>🕒 Recent Activity</h3>

        <div className="timeline">
          <div className="timeline-item success">
            <span className="dot"></span>
            <div>
              <p>Campaign created successfully</p>
              <small>Just now</small>
            </div>
          </div>

          <div className="timeline-item info">
            <span className="dot"></span>
            <div>
              <p>{templates.length} email templates available</p>
              <small>Today</small>
            </div>
          </div>

          <div className="timeline-item warning">
            <span className="dot"></span>
            <div>
              <p>{assets.length} assets in library</p>
              <small>Live sync</small>
            </div>
          </div>

          <div className="timeline-item success">
            <span className="dot"></span>
            <div>
              <p>System running smoothly</p>
              <small>All services operational</small>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
)}

        {/* ================= ULTRA PREMIUM CREATE EMAIL ================= */}
{activeTab === "create" && permissions.canSendEmails && (
  <div className="create-campaign-pro">

    {/* HEADER */}
    <div className="create-hero">
      <div>
        <h2>🚀 Campaign Studio</h2>
        <p>
          Design, preview and launch professional email campaigns with smart tools
        </p>

        <div className="create-stats">
          <div className="stat-chip">
            📊 Campaigns: <strong>{campaigns.length}</strong>
          </div>
          <div className="stat-chip">
            🧩 Templates: <strong>{templates.length}</strong>
          </div>
          <div className="stat-chip">
            📦 Assets: <strong>{assets.length}</strong>
          </div>
        </div>
      </div>

      <div className="ai-status">
        <span className="ai-badge">AI Optimizer</span>
        <small>
          Subject Strength:{" "}
          {newCampaign.subject.length > 25 ? "🔥 Strong" : "⚠ Improve"}
        </small>
      </div>
    </div>

    {/* MAIN GRID */}
    <div className="create-grid">

      {/* LEFT: FORM BUILDER */}
      <div className="glass-form-card">
        <h3>✍ Email Composer</h3>

        {/* CAMPAIGN NAME */}
        <label>Campaign Name</label>
        <input
          className="input-pro"
          placeholder="Eg: Summer Promotion Campaign"
          value={newCampaign.name}
          onChange={(e) =>
            setNewCampaign({ ...newCampaign, name: e.target.value })
          }
        />

        {/* SUBJECT */}
        <label>Email Subject</label>
        <input
          className="input-pro"
          placeholder="🔥 Write a high-converting subject line..."
          value={newCampaign.subject}
          onChange={(e) =>
            setNewCampaign({ ...newCampaign, subject: e.target.value })
          }
        />

        {/* SUBJECT PROGRESS */}
        <div className="subject-bar">
          <div
            className="subject-fill"
            style={{
              width: `${Math.min(newCampaign.subject.length * 2, 100)}%`,
            }}
          />
        </div>

        {/* TEMPLATE QUICK BUTTONS */}
        <label>Quick Templates</label>
        <div className="template-quick">
          <button
            onClick={() =>
              setNewCampaign({
                ...newCampaign,
                content: "👋 Welcome! Thank you for joining our platform.",
              })
            }
          >
            👋 Welcome
          </button>

          <button
            onClick={() =>
              setNewCampaign({
                ...newCampaign,
                content: "🔥 Limited Time Offer! Get 30% OFF today!",
              })
            }
          >
            🔥 Promotion
          </button>

          <button
            onClick={() =>
              setNewCampaign({
                ...newCampaign,
                content: "📰 Here are our latest updates and news.",
              })
            }
          >
            📰 Newsletter
          </button>
        </div>

        {/* EMAIL CONTENT */}
        <label>Email Content</label>
        <textarea
          rows="8"
          className="textarea-pro"
          placeholder="Write your email content or paste HTML template..."
          value={newCampaign.content}
          onChange={(e) =>
            setNewCampaign({ ...newCampaign, content: e.target.value })
          }
        />

        {/* ACTION BUTTONS */}
        <div className="create-actions">
          <button
            className="secondary-btn"
            onClick={() =>
              setNewCampaign({ name: "", subject: "", content: "" })
            }
          >
            🧹 Clear
          </button>

          <button className="primary-btn glow-btn" onClick={createCampaign}>
            🚀 Launch Campaign
          </button>
        </div>
      </div>

      {/* RIGHT: LIVE PREVIEW */}
      <div className="preview-card">
        <div className="preview-header">
          <h3>👁 Live Preview</h3>
          <span className="live-badge">LIVE</span>
        </div>

        <div className="email-preview">
          <h4>
            {newCampaign.subject || "Subject Preview"}
          </h4>
          <p>
            {newCampaign.content ||
              "Your email content will appear here in real-time preview."}
          </p>
        </div>

        <div className="preview-stats">
          <div>
            <strong>98%</strong>
            <span>Deliverability</span>
          </div>
          <div>
            <strong>Low</strong>
            <span>Spam Score</span>
          </div>
          <div>
            <strong>AI</strong>
            <span>Optimized</span>
          </div>
        </div>
      </div>

    </div>
  </div>
)}

        {/* HISTORY */}
        {activeTab === "history" && permissions.canViewHistory && (
          <div className="content-card">
            <h2>📁 Campaign History</h2>

            <input
              className="search-box"
              placeholder="🔍 Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <table className="campaign-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {campaigns
                  .filter((c) =>
                    c.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((c, i) => (
                    <tr key={i}>
                      <td>{c.name}</td>
                      <td>{c.subject}</td>
                      <td>
                        <span className={`status ${c.status.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>{c.date}</td>
                      <td>
                        <button
                          className="preview-btn"
                          onClick={() => setPreview(c)}
                        >
                          👁 View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TEMPLATES */}
        {activeTab === "templates" && permissions.canUseTemplates && (
          <div className="template-grid">
            {templates.map((t, i) => (
              <div key={i} className="template-card">
                <h4>{t.name}</h4>
                <p>{t.content}</p>
                <button
                  className="primary-btn"
                  onClick={() =>
                    setNewCampaign({ ...newCampaign, content: t.content })
                  }
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        )}

       {/* ================= PREMIUM ASSETS LIBRARY ================= */}
{activeTab === "assets" && permissions.canAccessAssets && (
  <div className="assets-pro-wrapper">

    {/* HEADER */}
    <div className="assets-header">
      <div>
        <h2>📦 Assets Library</h2>
        <p>Manage images, documents, and campaign files in one place</p>
      </div>

      <div className="assets-stats">
        <div className="asset-stat-card">
          <span>Total Files</span>
          <strong>{assets.length}</strong>
        </div>
        <div className="asset-stat-card">
          <span>Storage Used</span>
          <strong>{(assets.length * 2).toFixed(1)} MB</strong>
        </div>
      </div>
    </div>

    {/* TOOLBAR */}
    <div className="assets-toolbar">
      <input
        className="asset-search"
        placeholder="🔍 Search assets..."
        onChange={(e) => setAssetSearch?.(e.target.value)}
      />

      <label className="upload-btn">
        ⬆ Upload Asset
        <input type="file" hidden onChange={handleAssetUpload} />
      </label>
    </div>

    {/* DRAG & DROP UPLOAD BOX */}
    <div className="upload-dropzone">
      <input type="file" onChange={handleAssetUpload} />
      <div className="drop-content">
        <div className="upload-icon">📂</div>
        <h3>Drag & Drop Files Here</h3>
        <p>Supports Images, PDF, CSV, ZIP (Max 10MB)</p>
      </div>
    </div>

    {/* ASSETS GRID */}
    <div className="assets-grid">
      {assets.length === 0 ? (
        <div className="empty-assets">
          <div className="empty-icon">📦</div>
          <h3>No Assets Uploaded</h3>
          <p>Upload files to use them in email campaigns and templates.</p>
        </div>
      ) : (
        assets.map((a, i) => {
          const ext = a.split(".").pop().toLowerCase();

          const getIcon = () => {
            if (["png", "jpg", "jpeg", "gif"].includes(ext)) return "🖼";
            if (["pdf"].includes(ext)) return "📄";
            if (["csv", "xlsx"].includes(ext)) return "📊";
            if (["zip"].includes(ext)) return "🗜";
            return "📁";
          };

          return (
            <div key={i} className="asset-card">
              <div className="asset-icon">{getIcon()}</div>

              <div className="asset-info">
                <h4>{a}</h4>
                <span className="asset-meta">
                  {ext.toUpperCase()} • {(Math.random() * 5 + 1).toFixed(1)} MB
                </span>
              </div>

              <div className="asset-actions">
                <button
                  className="asset-btn view"
                  onClick={() => alert(`Previewing: ${a}`)}
                >
                  👁
                </button>

                <button
                  className="asset-btn copy"
                  onClick={() => navigator.clipboard.writeText(a)}
                >
                  📋
                </button>

                <button
                  className="asset-btn delete"
                  onClick={() =>
                    setAssets(assets.filter((_, index) => index !== i))
                  }
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
)}

       {/* ================= ULTRA ATTRACTIVE EMAIL PREVIEW MODAL ================= */}
{preview && (
  <div className="preview-modal-backdrop">
    <div className="preview-modal-container">

      {/* TOP HEADER */}
      <div className="preview-modal-header">
        <div className="preview-header-left">
          <div className="preview-icon">📧</div>
          <div>
            <h3 className="preview-title">{preview.name}</h3>
            <span className="preview-sub">Campaign Email Preview</span>
          </div>
        </div>

        <button
          className="modal-close-btn"
          onClick={() => setPreview(null)}
        >
          ✕
        </button>
      </div>

      {/* EMAIL META INFO */}
      <div className="preview-meta-bar">
        <div className="meta-item">
          <span>From</span>
          <strong>InoMail Team &lt;no-reply@inomail.com&gt;</strong>
        </div>

        <div className="meta-item">
          <span>To</span>
          <strong>Recipients List</strong>
        </div>

        <div className="meta-item">
          <span>Subject</span>
          <strong>{preview.subject}</strong>
        </div>
      </div>

      {/* EMAIL BODY PREVIEW */}
      <div className="preview-email-body">
        <div className="email-card">
          <div className="email-header">
            <h4>{preview.subject}</h4>
            <span className="email-badge">Live Preview</span>
          </div>

          <div className="email-content">
            {preview.content ? (
              <p>{preview.content}</p>
            ) : (
              <span className="empty-text">
                No email content available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ACTION FOOTER */}
      <div className="preview-modal-footer">
        <button
          className="secondary-btn"
          onClick={() => setPreview(null)}
        >
          Cancel
        </button>

        <button
          className="primary-btn"
          onClick={() => {
            alert(`📧 Campaign "${preview.name}" Resent (Demo)`);
          }}
        >
          🚀 Resend Campaign
        </button>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}

export default UserDashboard;