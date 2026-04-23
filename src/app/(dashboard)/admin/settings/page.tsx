"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Mail, KeyRound, Server, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    name: "",
    emailConfig: {
      email: "",
      appPassword: "",
      smtpHost: "",
      smtpPort: 465,
      smtpUser: "",
      smtpPass: ""
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/org/settings");
      const data = await res.json();
      if (res.ok) {
        setSettings({
            name: data.settings.name || "",
            emailConfig: {
                email: data.settings.emailConfig?.email || "",
                appPassword: data.settings.emailConfig?.appPassword || "",
                smtpHost: data.settings.emailConfig?.smtpHost || "",
                smtpPort: data.settings.emailConfig?.smtpPort || 465,
                smtpUser: data.settings.emailConfig?.smtpUser || "",
                smtpPass: data.settings.emailConfig?.smtpPass || ""
            }
        });
      } else {
        toast.error(data.error || "Failed to load settings");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading("Saving changes...");
    try {
      const res = await fetch("/api/org/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Settings updated successfully!", { id: toastId });
      } else {
        toast.error(data.error || "Failed to update settings", { id: toastId });
      }
    } catch (err) {
      toast.error("Failed to save changes", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
          <p className="text-gray-400 text-sm">Configure your organization and email delivery preferences.</p>
        </div>
        <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] disabled:opacity-50 active:scale-95 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] border-white/10 bg-white/5 space-y-8 shadow-2xl">
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Mail className="text-primary w-5 h-5" /> Sender Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Organization Name</label>
              <input 
                type="text" 
                value={settings.name}
                onChange={(e) => setSettings({...settings, name: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-all" 
                placeholder="e.g. Acme Marketing" 
              />
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Default Sender Email</label>
              <input 
                type="email" 
                value={settings.emailConfig.email}
                onChange={(e) => setSettings({...settings, emailConfig: {...settings.emailConfig, email: e.target.value}})}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:outline-none transition-all" 
                placeholder="marketing@acme.com" 
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <KeyRound className="text-yellow-500 w-5 h-5" /> Delivery Configuration
          </h2>
          <p className="text-sm text-gray-400 mb-6">Connect your email provider via App Passwords or custom SMTP.</p>
          
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" className="w-4 h-4" alt="Gmail" />
                    Gmail / Workspace App Password
                </h3>
                <span className="bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Recommended</span>
              </div>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">The most reliable way to send. Generate an App Password from your Google Security settings to bypass SMTP restrictions.</p>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                <input 
                    type="password" 
                    value={settings.emailConfig.appPassword}
                    onChange={(e) => setSettings({...settings, emailConfig: {...settings.emailConfig, appPassword: e.target.value}})}
                    placeholder="e.g. abcd efgh ijkl mnop" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-12 py-4 text-white focus:border-primary/50 focus:outline-none font-mono text-sm" 
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-800 my-8">
              <div className="h-[1px] bg-white/5 flex-1"></div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-black">Advanced SMTP Settings</span>
              <div className="h-[1px] bg-white/5 flex-1"></div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    <Server className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Custom SMTP Server</h3>
                    <p className="text-xs text-gray-500">For Mailgun, SendGrid, or custom hosting.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">SMTP Host</label>
                  <input 
                    type="text" 
                    value={settings.emailConfig.smtpHost}
                    onChange={(e) => setSettings({...settings, emailConfig: {...settings.emailConfig, smtpHost: e.target.value}})}
                    placeholder="smtp.mailgun.org" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-primary/50 outline-none text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">SMTP Port</label>
                  <input 
                    type="number" 
                    value={settings.emailConfig.smtpPort}
                    onChange={(e) => setSettings({...settings, emailConfig: {...settings.emailConfig, smtpPort: parseInt(e.target.value)}})}
                    placeholder="465" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-primary/50 outline-none text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">SMTP Username</label>
                  <input 
                    type="text" 
                    value={settings.emailConfig.smtpUser}
                    onChange={(e) => setSettings({...settings, emailConfig: {...settings.emailConfig, smtpUser: e.target.value}})}
                    placeholder="postmaster@domain.com" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-primary/50 outline-none text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">SMTP Password</label>
                  <input 
                    type="password" 
                    value={settings.emailConfig.smtpPass}
                    onChange={(e) => setSettings({...settings, emailConfig: {...settings.emailConfig, smtpPass: e.target.value}})}
                    placeholder="••••••••" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-primary/50 outline-none text-sm" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
