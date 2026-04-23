"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus, Check, Building2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Organization {
  _id: string;
  name: string;
  slug: string;
  plan: string;
}

export function OrgSwitcher() {
  const [open, setOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentOrgId, setCurrentOrgId] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrganizations();

    // Click outside listener
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setIsCreating(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await fetch("/api/org/list");
      const data = await res.json();
      if (data.organizations) {
        setOrganizations(data.organizations);
        if (data.activeOrganizationId) {
          setCurrentOrgId(data.activeOrganizationId);
        }
      }
    } catch (error) {
      console.error("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = async (orgId: string) => {
    if (orgId === currentOrgId) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/org/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: orgId }),
      });
      
      if (res.ok) {
        toast.success("Switched organization successfully!");
        setOpen(false);
        router.refresh();
        window.location.reload();
      } else {
        toast.error("Failed to switch organization");
      }
    } catch (error) {
      console.error("Switch failed");
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/org/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newOrgName }),
      });
      
      if (res.ok) {
        toast.success("Organization created successfully!");
        setNewOrgName("");
        setIsCreating(false);
        setOpen(false);
        router.refresh();
        window.location.reload();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create organization");
      }
    } catch (error) {
      console.error("Creation failed");
      toast.error("Failed to create organization");
    } finally {
      setSubmitting(false);
    }
  };

  const currentOrg = organizations.find(o => o._id === currentOrgId) || organizations[0];

  return (
    <div ref={containerRef} className="relative mb-6 px-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">
              {loading ? "Loading..." : currentOrg?.name || "Select Org"}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
              {currentOrg?.plan || "Free"} Plan
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 group-hover:text-white transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-4 right-4 mt-2 p-2 rounded-2xl bg-[#0F1117] border border-white/10 shadow-2xl z-50 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1 mb-2">
              {organizations.map((org) => (
                <button
                  key={org._id}
                  onClick={() => handleSwitch(org._id)}
                  disabled={submitting}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    currentOrg?._id === org._id ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-medium truncate">{org.name}</span>
                  {currentOrg?._id === org._id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>

            <div className="border-t border-white/5 pt-2 mt-2">
              {isCreating ? (
                <form onSubmit={handleCreate} className="p-1 space-y-2">
                  <input
                    autoFocus
                    required
                    type="text"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="Organization Name"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="flex-1 bg-white/5 text-gray-400 text-xs font-bold py-2 rounded-lg hover:bg-white/10"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    <Plus className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-medium">New Organization</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
