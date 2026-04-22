"use client";

import { History, Search, Filter, Mailbox, ArrowRight } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Campaign History</h1>
          <p className="text-gray-400 text-sm">View and track all your past and currently queued campaigns.</p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border-white/5">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-full md:w-96 focus-within:border-primary/50 transition-colors">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by campaign name or subject..."
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
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Mailbox className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Q{i} Newsletter</div>
                        <div className="text-xs text-gray-500">Subject: Updates for Q{i}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${i === 1 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                      {i === 1 ? 'Processing' : 'Completed'}
                    </span>
                  </td>
                  <td className="p-4">
                    {i === 1 ? '1,200 / 4,200' : '4,200 / 4,200'}
                  </td>
                  <td className="p-4">
                    {i === 1 ? '12.4%' : '48.2%'}
                  </td>
                  <td className="p-4">
                    {new Date().toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-primary hover:text-primary/80 transition-colors flex items-center justify-end gap-1 text-xs font-medium">
                      View Report <ArrowRight className="w-3 h-3" />
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
