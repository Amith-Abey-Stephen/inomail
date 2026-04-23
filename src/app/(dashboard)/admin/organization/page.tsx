"use client";

import { useState, useEffect } from "react";
import { Building2, UserPlus, Shield, Trash2, Loader2, X, Lock, Mail, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function OrganizationPage() {
  const [orgData, setOrgData] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member"
  });

  useEffect(() => {
    fetchOrgDetails();
  }, []);

  const fetchOrgDetails = async () => {
    try {
      const res = await fetch("/api/org/details");
      const data = await res.json();
      if (res.ok) {
        setOrgData(data.organization);
        setMembers(data.members);
      } else {
        toast.error(data.error || "Failed to load organization");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/org/members/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Member added successfully!");
        setShowAddModal(false);
        setFormData({ name: "", email: "", password: "", role: "Member" });
        fetchOrgDetails(); // Refresh list
      } else {
        toast.error(data.error || "Failed to add member");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Organization</h1>
          <p className="text-gray-400 text-sm">Manage your workspace members and roles.</p>
        </div>
        <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl border-white/5 bg-white/5">
            <h2 className="text-lg font-semibold text-white mb-6">Members</h2>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        {member.name}
                      </h4>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-gray-300 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                      <Shield className="w-3 h-3" /> {member.role}
                    </span>
                    <button className="text-gray-600 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border-white/5 bg-white/5">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{orgData?.name}</h2>
            <p className="text-sm text-gray-400 mb-6">{orgData?.plan} Plan • {orgData?.memberCount}/{orgData?.maxMembers} Members</p>
            
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 uppercase font-black tracking-tighter">Status</span>
                <span className="text-green-400 font-bold">Active</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 uppercase font-black tracking-tighter">Created</span>
                <span className="text-white">{new Date(orgData?.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 uppercase font-black tracking-tighter">Identifier</span>
                <span className="text-gray-500 font-mono text-[10px]">{orgData?.slug}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowAddModal(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md glass-card p-8 rounded-[2.5rem] border-white/10 bg-[#0c0c0e] shadow-2xl"
                >
                    <button onClick={() => setShowAddModal(false)} className="absolute right-6 top-6 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                    
                    <div className="mb-8">
                        <h3 className="text-2xl font-black text-white mb-2">Add New Member</h3>
                        <p className="text-gray-400 text-sm">Invite someone to collaborate in your workspace.</p>
                    </div>

                    <form onSubmit={handleAddMember} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                    placeholder="Jane Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                    placeholder="jane@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary/50 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Role</label>
                            <select 
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none transition-all appearance-none"
                            >
                                <option value="Member" className="bg-[#0c0c0e]">Member</option>
                                <option value="Admin" className="bg-[#0c0c0e]">Admin</option>
                            </select>
                        </div>

                        <button 
                            disabled={isSubmitting}
                            className="w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-5 h-5" /> Add Member</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
