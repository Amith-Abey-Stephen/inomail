import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Users, Mailbox, Send, AlertCircle, TrendingUp, MoreHorizontal } from "lucide-react";
import connectDB from "@/lib/db/connect";
import Campaign, { ICampaign } from "@/models/Campaign";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const payload = verifyToken(token);
  if (!payload) redirect("/api/auth/logout");

  await connectDB();

  // Get User and Org
  const user = await User.findById(payload.userId);
  if (!user) redirect("/api/auth/logout");

  const org = await Organization.findById(user.organizationId);
  if (!org) redirect("/admin/settings");

  // 1. Aggregate Stats
  const campaignStats = await Campaign.aggregate([
    { $match: { organizationId: org._id } },
    {
      $group: {
        _id: null,
        totalSent: { $sum: "$stats.sent" },
        totalOpened: { $sum: "$stats.opened" },
        totalBounced: { $sum: "$stats.bounced" },
        count: { $sum: 1 }
      }
    }
  ]);

  const stats = campaignStats[0] || { totalSent: 0, totalOpened: 0, totalBounced: 0, count: 0 };
  
  const openRate = stats.totalSent > 0 ? (stats.totalOpened / stats.totalSent) * 100 : 0;
  const bounceRate = stats.totalSent > 0 ? (stats.totalBounced / stats.totalSent) * 100 : 0;

  // 2. Recent Campaigns
  const recentCampaigns = await Campaign.find({ organizationId: org._id })
    .sort({ createdAt: -1 })
    .limit(5);

  // 3. Member Count
  const memberCount = org.members.length;

  return {
    org,
    stats: {
      totalSent: stats.totalSent,
      openRate: openRate.toFixed(1),
      bounceRate: bounceRate.toFixed(1),
      memberCount,
    },
    recentCampaigns: recentCampaigns as ICampaign[]
  };
}

export default async function AdminDashboardPage() {
  const { org, stats, recentCampaigns } = await getDashboardData();

  const statCards = [
    { title: "Total Emails Sent", value: stats.totalSent.toLocaleString(), icon: <Send className="w-5 h-5 text-blue-400" />, trend: "+0%" },
    { title: "Open Rate", value: `${stats.openRate}%`, icon: <Mailbox className="w-5 h-5 text-green-400" />, trend: "+0%" },
    { title: "Bounce Rate", value: `${stats.bounceRate}%`, icon: <AlertCircle className="w-5 h-5 text-red-400" />, trend: "0%" },
    { title: "Org Members", value: stats.memberCount.toString(), icon: <Users className="w-5 h-5 text-purple-400" />, trend: "0%" },
  ];

  const maxEmails = org.rateLimit?.maxEmailsPerDay || 100;
  const usagePercent = Math.min(100, (stats.totalSent / (maxEmails * 30)) * 100);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Overview</h1>
          <p className="text-gray-400 text-sm">Dashboard for <span className="text-primary font-semibold">{org.name}</span></p>
        </div>
        <Link href="/admin/send">
          <button className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors shadow-lg">
            Create Campaign
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
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
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border-white/5 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Campaigns</h2>
            <Link href="/admin/history" className="text-gray-400 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Mailbox className="w-12 h-12 mb-4 opacity-20" />
                    <p>No campaigns found</p>
                    <Link href="/admin/send" className="text-primary hover:underline text-sm mt-2">Create your first one</Link>
                </div>
            ) : (
                recentCampaigns.map((campaign: ICampaign) => (
                    <div key={campaign._id.toString()} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            campaign.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 
                            campaign.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                        }`}>
                            <Send className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-white mb-1">{campaign.name}</h4>
                            <p className="text-xs text-gray-400">Sent to {campaign.stats.sent} recipients</p>
                        </div>
                        </div>
                        <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            campaign.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 
                            campaign.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/10 text-gray-400'
                        }`}>
                            {campaign.status}
                        </span>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-white/5 min-h-[400px]">
          <h2 className="text-lg font-semibold text-white mb-6">Plan Usage</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Emails Sent (Total)</span>
                <span className="text-white font-medium">{stats.totalSent.toLocaleString()} / {(maxEmails * 30).toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${usagePercent}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">Monthly limit based on {org.plan} plan ({maxEmails}/day)</p>
            </div>

            <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <h4 className="text-primary font-medium text-sm mb-2">Current Plan: {org.plan}</h4>
              <p className="text-xs text-gray-400 mb-4">
                {org.plan === 'Starter' ? 'Upgrade to Pro for 10x more emails and priority support.' : 
                 org.plan === 'Pro' ? 'Move to Enterprise for unlimited scale and custom limits.' : 'You are on our top-tier Enterprise plan.'}
              </p>
              <Link href="/admin/settings">
                <button className="w-full bg-primary text-white text-xs font-medium py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  {org.plan === 'Enterprise' ? 'Manage Plan' : 'Upgrade Now'}
                </button>
              </Link>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Details</h4>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Daily Limit</span>
                    <span className="text-white">{maxEmails}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Member Limit</span>
                    <span className="text-white">{org.rateLimit?.maxMembers || 1}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
