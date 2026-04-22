"use client";

import { Bell, Search, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="h-20 border-b border-white/10 glass px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-gray-400 hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-64 focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 relative text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-black"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-lg border border-white/20">
          A
        </div>
      </div>
    </header>
  );
}
