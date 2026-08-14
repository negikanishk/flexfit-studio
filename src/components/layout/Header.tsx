"use client";

import React from "react";
import { Search, Bell, Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Quick search members, classes, transactions..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full text-xs text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>System Status: <strong className="text-white">Active WAL SQLite</strong></span>
        </div>

        <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
        </button>
      </div>
    </header>
  );
};
