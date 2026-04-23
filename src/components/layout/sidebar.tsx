"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MailPlus, History, Building2, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { OrgSwitcher } from "@/components/dashboard/OrgSwitcher";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Send Email", href: "/admin/send", icon: <MailPlus className="w-5 h-5" /> },
    { name: "History", href: "/admin/history", icon: <History className="w-5 h-5" /> },
    { name: "Organization", href: "/admin/organization", icon: <Building2 className="w-5 h-5" /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 border-r border-white/10 glass-card z-40 hidden md:flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-xl">
            <MailPlus className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">InoMail</span>
        </Link>
      </div>

      <OrgSwitcher />

      <div className="flex-1 px-4 py-6 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                isActive ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {link.icon}
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <Link href="/api/auth/logout" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-red-400 hover:bg-red-500/10 group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Logout</span>
        </Link>
      </div>
    </div>
  );
}
