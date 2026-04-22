"use client";

import { motion } from "framer-motion";
import { Users, Mailbox, Send, AlertCircle, TrendingUp, MoreHorizontal } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Emails Sent", value: "24,592", icon: <Send className="w-5 h-5 text-blue-400" />, trend: "+12%" },
    { title: "Open Rate", value: "48.2%", icon: <Mailbox className="w-5 h-5 text-green-400" />, trend: "+2.4%" },
    { title: "Bounce Rate", value: "1.2%", icon: <AlertCircle className="w-5 h-5 text-red-400" />, trend: "-0.5%" },
    { title: "Organization Members", value: "12", icon: <Users className="w-5 h-5 text-purple-400" />, trend: "0%" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Overview</h1>
          <p className="text-gray-400 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors shadow-lg">
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl border-white/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                stat.trend.startsWith("+") ? "text-green-400 bg-green-400/10" : 
                stat.trend.startsWith("-") ? "text-red-400 bg-red-400/10" : "text-gray-400 bg-gray-400/10"
              }`}>
                {stat.trend.startsWith("+") && <TrendingUp className="w-3 h-3" />}
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border-white/5 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Campaigns</h2>
            <button className="text-gray-400 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          {/* Mock table or list */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 1 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                    <Mailbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Q3 Marketing Newsletter {i}</h4>
                    <p className="text-xs text-gray-400">Sent to 4,200 recipients</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${i === 1 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                    {i === 1 ? 'Processing' : 'Completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-white/5 min-h-[400px]">
          <h2 className="text-lg font-semibold text-white mb-6">Plan Usage</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Emails Sent (Monthly)</span>
                <span className="text-white font-medium">24,592 / 50,000</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[49%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Storage Used</span>
                <span className="text-white font-medium">2.4 GB / 10 GB</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[24%] rounded-full"></div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <h4 className="text-primary font-medium text-sm mb-2">Upgrade to Enterprise</h4>
              <p className="text-xs text-gray-400 mb-4">Get unlimited emails, dedicated queues, and custom rate limits.</p>
              <button className="w-full bg-primary text-white text-xs font-medium py-2 rounded-lg hover:bg-primary/90 transition-colors">
                View Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
