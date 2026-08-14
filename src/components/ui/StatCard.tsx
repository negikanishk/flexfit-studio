import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendColor?: "emerald" | "amber" | "rose" | "indigo";
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, trendColor = "emerald" }) => {
  const colors = {
    emerald: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
    amber: "text-amber-400 bg-amber-950/40 border-amber-800/40",
    rose: "text-rose-400 bg-rose-950/40 border-rose-800/40",
    indigo: "text-indigo-400 bg-indigo-950/40 border-indigo-800/40",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-bold text-slate-50 mt-1">{value}</h4>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <div className="mt-2 inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border border-transparent">
            {trend}
          </div>
        )}
      </div>
      {icon && <div className={cn("p-3 rounded-lg border", colors[trendColor])}>{icon}</div>}
    </div>
  );
};
