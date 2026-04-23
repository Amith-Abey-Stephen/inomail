"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Mail, KeyRound, Server, Loader2, CheckCircle2, ExternalLink, AlertTriangle, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

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

  const [initialSettings, setInitialSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Track dirty state
  useEffect(() => {
    if (initialSettings) {
        const isChanged = JSON.stringify(settings) !== JSON.stringify(initialSettings);
        setIsDirty(isChanged);
    }
  }, [settings, initialSettings]);

  // Handle browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/org/settings");
      const data = await res.json();
      if (res.ok) {
        const loaded = {
            name: data.settings.name || "",
            emailConfig: {
                email: data.settings.emailConfig?.email || "",
                appPassword: data.settings.emailConfig?.appPassword || "",
                smtpHost: data.settings.emailConfig?.smtpHost || "",
                smtpPort: data.settings.emailConfig?.smtpPort || 465,
                smtpUser: data.settings.emailConfig?.smtpUser || "",
                smtpPass: data.settings.emailConfig?.smtpPass || ""
            }
        };
        setSettings(loaded);
        setInitialSettings(loaded);
      } else {
        toast.error(data.error || "Failed to load settings");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (silent = false) => {
    setSaving(true);
    const toastId = !silent ? toast.loading("Saving changes...") : undefined;
    try {
      const res = await fetch("/api/org/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok) {
        setInitialSettings(settings);
        setIsDirty(false);
        if (!silent) toast.success("Settings updated successfully!", { id: toastId });
        return true;
      } else {
        if (!silent) toast.error(data.error || "Failed to update settings", { id: toastId });
        return false;
      }
    } catch (err) {
      if (!silent) toast.error("Failed to save changes", { id: toastId });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndExit = async () => {
    const success = await handleSave(true);
    if (success) {
        setIsDirty(false);
        setShowExitModal(false);
        toast.success("Settings saved!");
        // Note: Real navigation blocking in Next.js is hard without custom router.
        // We'll just close the modal here.
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl pb-20 relative">
      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowExitModal(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md glass-card p-8 rounded-[2.5rem] border-white/10 bg-[#0c0c0e] shadow-2xl text-center"
                >
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Unsaved Changes</h3>
                    <p className="text-gray-400 text-sm mb-8">You have modified your organization settings. Do you want to save them before leaving?</p>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={handleSaveAndExit}
                            className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save & Exit
                        </button>
                        <button 
                            onClick={() => { setIsDirty(false); setShowExitModal(false); }}
                            className="w-full bg-white/5 border border-white/10 text-red-400 font-bold py-4 rounded-xl hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                        >
                            Discard Changes
                        </button>
                        <button 
                            onClick={() => setShowExitModal(false)}
                            className="w-full bg-transparent text-gray-500 font-medium py-2 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 font-black">Settings</h1>
          <p className="text-gray-400 text-sm">Configure your organization and email delivery preferences.</p>
        </div>
        <div className="flex items-center gap-4">
            {isDirty && <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest animate-pulse flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> Unsaved Changes</span>}
            <button 
                onClick={() => handleSave()}
                disabled={saving || !isDirty}
                className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] disabled:opacity-50 active:scale-95 flex items-center gap-2"
            >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
            </button>
        </div>
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <KeyRound className="text-yellow-500 w-5 h-5" /> Delivery Configuration
            </h2>
          </div>
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
              
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 mb-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <KeyRound className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-400 mb-1">How to get an App Password?</h4>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">For security, Gmail requires an 'App Password' instead of your main password. Follow these steps:</p>
                    <ul className="text-[10px] text-gray-500 space-y-1 list-disc pl-4 mb-4">
                        <li>Enable **2-Step Verification** in your Google Account.</li>
                        <li>Search for **'App Passwords'** in your account settings.</li>
                        <li>Select **'Mail'** and **'Other (Custom Name)'** like 'InoMail'.</li>
                        <li>Copy the **16-character code** and paste it below.</li>
                    </ul>
                    <a 
                        href="https://myaccount.google.com/apppasswords" 
                        target="_blank" 
                        className="inline-flex items-center gap-2 text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
                    >
                        Google Security Settings <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
              </div>

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
      
      {/* Dirty state floating warning */}
      <AnimatePresence>
        {isDirty && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 bg-yellow-500 text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-yellow-400/50 backdrop-blur-xl"
            >
                <AlertTriangle className="w-6 h-6" />
                <div>
                    <p className="text-sm font-black">You have unsaved changes</p>
                    <p className="text-[10px] font-bold opacity-80">Don't forget to save before leaving.</p>
                </div>
                <div className="h-8 w-[1px] bg-black/10 mx-2" />
                <button 
                    onClick={() => handleSave()}
                    disabled={saving}
                    className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all"
                >
                    {saving ? "Saving..." : "Save Now"}
                </button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
