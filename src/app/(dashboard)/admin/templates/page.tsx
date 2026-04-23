"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Search, Filter, MoreVertical, Eye, Copy, Trash2, ArrowRight, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (res.ok) {
        setTemplates(data.templates);
      } else {
        toast.error(data.error || "Failed to load templates");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const getTemplateColor = (idx: number) => {
    const colors = [
      "from-blue-500/20 to-indigo-500/20",
      "from-purple-500/20 to-pink-500/20",
      "from-amber-500/20 to-orange-500/20",
      "from-emerald-500/20 to-teal-500/20"
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Email Templates</h1>
          <p className="text-gray-400 font-medium">Manage and reuse your high-performing campaign designs.</p>
        </div>
        
        <Link 
            href="/admin/send"
            className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-4 rounded-2xl transition-all flex items-center gap-2 shadow-[0_0_40px_rgba(99,102,241,0.3)] active:scale-95"
        >
            <Plus className="w-5 h-5" /> Create New
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <button className="bg-white/5 border border-white/10 text-gray-400 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
            <div className="col-span-full py-20 flex justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        ) : filteredTemplates.map((template, idx) => (
          <motion.div
            key={template._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative"
          >
            <div className={`aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br ${getTemplateColor(idx)} border border-white/10 overflow-hidden relative group-hover:border-primary/30 transition-all p-8 flex flex-col`}>
              <div className="w-full h-1 bg-white/10 rounded-full mb-4" />
              <div className="w-2/3 h-1 bg-white/5 rounded-full mb-8" />
              <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 p-4 overflow-hidden relative">
                <div 
                    dangerouslySetInnerHTML={{ __html: template.htmlContent }} 
                    className="scale-50 origin-top pointer-events-none opacity-40 select-none"
                />
              </div>
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                <button className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                  <Eye className="w-5 h-5" />
                </button>
                <Link 
                    href={`/admin/send?templateId=${template._id}`}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl"
                >
                  Use <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-auto pt-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{template.category || "General"}</span>
                  <button className="text-gray-500 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 truncate">{template.name}</h3>
                <p className="text-xs text-gray-500">Created {new Date(template.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {!loading && filteredTemplates.length === 0 && search === "" && (
            <Link 
                href="/admin/send"
                className="aspect-[4/5] rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all flex flex-col items-center justify-center text-center p-8 group"
            >
                <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                    <Plus className="w-8 h-8 text-gray-600 group-hover:text-primary transition-all" />
                </div>
                <h3 className="text-lg font-bold text-gray-500 group-hover:text-white transition-all">New Template</h3>
                <p className="text-xs text-gray-600 mt-2">Start from a blank canvas</p>
            </Link>
        )}
      </div>
    </div>
  );
}
