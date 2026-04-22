"use client";

import { Building2, UserPlus, Shield, Trash2 } from "lucide-react";

export default function OrganizationPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Organization</h1>
          <p className="text-gray-400 text-sm">Manage your workspace members and roles.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl border-white/5">
            <h2 className="text-lg font-semibold text-white mb-6">Members</h2>
            <div className="space-y-4">
              {[
                { name: "Admin User", email: "admin@company.com", role: "Admin", me: true },
                { name: "John Doe", email: "john@company.com", role: "Member", me: false },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        {member.name}
                        {member.me && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full">You</span>}
                      </h4>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-300 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" /> {member.role}
                    </span>
                    {!member.me && (
                      <button className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border-white/5">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Acme Inc.</h2>
            <p className="text-sm text-gray-400 mb-6">Pro Plan • 2/10 Members</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Created</span>
                <span className="text-white">Oct 24, 2023</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Organization ID</span>
                <span className="text-gray-500 font-mono text-xs">org_2abc123xyz</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
