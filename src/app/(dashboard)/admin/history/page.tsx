"use client";

import { useState, useEffect } from "react";
import { History, Search, Filter, Mailbox, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function HistoryPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      if (res.ok) {
        setCampaigns(data.campaigns);
      } else {
        toast.error(data.error || "Failed to load history");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Campaign History</h1>
          <p className="text-gray-400 text-sm">View and track all your past and currently queued campaigns.</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full md:w-96 focus-within:border-primary/50 transition-colors">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Campaign</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Sent / Total</th>
                <th className="p-4 font-medium">Open Rate</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500">
                    No campaigns found.
                  </td>
                </tr>
              ) : filteredCampaigns.map((campaign) => (
                <tr key={campaign._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Mailbox className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{campaign.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">Subject: {campaign.subject}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      campaign.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      campaign.status === 'Processing' ? 'bg-blue-500/20 text-blue-400' :
                      campaign.status === 'Failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs">
                    {campaign.stats.sent} / {campaign.stats.total}
                  </td>
                  <td className="p-4">
                    {campaign.stats.total > 0 ? Math.round((campaign.stats.opened / campaign.stats.total) * 100) : 0}%
                  </td>
                  <td className="p-4 text-xs text-gray-400">
                    {new Date(campaign.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-primary hover:text-primary/80 transition-colors flex items-center justify-end gap-1 text-xs font-medium">
                      Report <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
