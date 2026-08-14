"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Dumbbell, 
  Users, 
  CalendarCheck, 
  ClipboardList, 
  UserCheck, 
  Building2, 
  BarChart3 
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Dumbbell },
  { href: "/members", label: "Members", icon: Users },
  { href: "/bookings", label: "Classes & Bookings", icon: CalendarCheck },
  { href: "/front-desk", label: "Front Desk Check-In", icon: UserCheck },
  { href: "/trainers", label: "Trainers", icon: ClipboardList },
  { href: "/companies", label: "Corporate Pools", icon: Building2 },
  { href: "/reports", label: "Revenue & Analytics", icon: BarChart3 },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-900/30">
          <Dumbbell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-50 tracking-tight">FlexFit Studio</h1>
          <p className="text-xs text-emerald-400 font-medium">Production Management</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "text-slate-500")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
            AV
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">Alex Vance</p>
            <p className="text-[10px] text-slate-400 truncate">Studio Manager (Admin)</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
