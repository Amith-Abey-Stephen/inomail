"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Clock, ArrowRight, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await fetch("/api/campaigns?status=Draft");
      const data = await res.json();
      if (res.ok) {
        setDrafts(data.campaigns);
      } else {
        toast.error(data.error || "Failed to load drafts");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredDrafts = drafts.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Campaign Drafts</h1>
        <p className="text-gray-400 font-medium">Continue where you left off with your in-progress campaigns.</p>
      </div>

      {/* Search */}
      <div className="relative mb-10 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
          type="text"
          placeholder="Search drafts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all"
        />
      </div>

      {/* Drafts List */}
      <div className="space-y-4">
        {loading ? (
            <div className="py-20 flex justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        ) : filteredDrafts.map((draft, idx) => (
          <motion.div
            key={draft._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card border-white/10 bg-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-white/20 hover:bg-white/[0.07] transition-all group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0 text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-1 truncate">{draft.name}</h3>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Last saved {new Date(draft.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="w-1 h-1 rounded-full bg-gray-800" />
                <span className="truncate italic max-w-[300px]">"{draft.subject}"</span>
              </div>
            </div>

            <div className="w-full md:w-48 flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                    <span>Draft Status</span>
                    <span className="text-primary">In Progress</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }} 
                        className="h-full bg-primary" 
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                <Link 
                    href={`/admin/send?draftId=${draft._id}`}
                    className="bg-white text-black font-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                    Resume <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
          </motion.div>
        ))}

        {!loading && filteredDrafts.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No drafts found</h3>
            <p className="text-gray-500 mb-8">Start a new campaign to see your drafts here.</p>
            <Link href="/admin/send" className="bg-primary text-white px-8 py-4 rounded-2xl font-black">Create Campaign</Link>
          </div>
        )}
      </div>
    </div>
  );
}
