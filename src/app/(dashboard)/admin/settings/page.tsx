"use client";

import { Settings, Mail, KeyRound, Server } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
          <p className="text-gray-400 text-sm">Configure your organization and email delivery preferences.</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg">
          Save Changes
        </button>
      </div>

      <div className="glass-card p-8 rounded-3xl border-white/5 space-y-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Mail className="text-primary w-5 h-5" /> Sender Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Sender Name</label>
              <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" defaultValue="Acme Marketing" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Sender Email Address</label>
              <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" defaultValue="marketing@acme.com" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <KeyRound className="text-yellow-500 w-5 h-5" /> Delivery Configuration
          </h2>
          <p className="text-sm text-gray-400 mb-6">Connect your email provider via App Passwords or custom SMTP.</p>
          
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Gmail / Workspace App Password</h3>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-md font-medium">Recommended</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">The easiest way to send emails. Just generate an App Password from your Google Account settings.</p>
              <div>
                <input type="password" placeholder="e.g. abcd efgh ijkl mnop" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none font-mono" />
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-500 my-4">
              <div className="h-[1px] bg-white/10 flex-1"></div>
              <span className="text-sm uppercase tracking-widest font-semibold">OR</span>
              <div className="h-[1px] bg-white/10 flex-1"></div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Server className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-white">Custom SMTP Server</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">SMTP Host</label>
                  <input type="text" placeholder="smtp.mailgun.org" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">SMTP Port</label>
                  <input type="number" placeholder="465" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">SMTP Username</label>
                  <input type="text" placeholder="postmaster@domain.com" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">SMTP Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
