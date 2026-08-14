"use client";

import React from "react";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/lib";
import { DollarSign, BarChart3, TrendingUp, CreditCard } from "lucide-react";

export default function ReportsPage() {
  const { data: metrics } = trpc.reports.getMetrics.useQuery();
  const { data: transactions } = trpc.credits.getTransactionHistory.useQuery();

  return (
    <div>
      <PageHeader
        title="Revenue & Operations Analytics"
        description="Comprehensive financial reporting, membership revenue, credit pack sales, and audited transaction ledger."
      />

      {/* Revenue Stat Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Gross Revenue"
          value={formatCurrency(metrics?.totalRevenue || 0)}
          subtitle="All stream combined"
          icon={<DollarSign className="w-5 h-5" />}
          trendColor="emerald"
        />
        <StatCard
          title="Membership Revenue"
          value={formatCurrency(metrics?.membershipRevenue || 0)}
          subtitle="Recurring monthly tiers"
          icon={<TrendingUp className="w-5 h-5" />}
          trendColor="indigo"
        />
        <StatCard
          title="Credit Pack Sales"
          value={formatCurrency(metrics?.creditPurchaseRevenue || 0)}
          subtitle="Individual credit top-ups"
          icon={<CreditCard className="w-5 h-5" />}
          trendColor="amber"
        />
        <StatCard
          title="Corporate Contracts"
          value={formatCurrency(metrics?.corporateGrantRevenue || 0)}
          subtitle="Company wellness grants"
          icon={<BarChart3 className="w-5 h-5" />}
          trendColor="emerald"
        />
      </div>

      {/* Transaction Ledger Table */}
      <Card>
        <CardHeader
          title="Financial Audit & Transaction Ledger"
          subtitle="Complete record of all credit purchases, membership renewals, and corporate grants"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Credit Change</th>
                <th className="px-6 py-4 text-right">Amount ($ USD)</th>
                <th className="px-6 py-4 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {transactions?.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{t.id}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        t.type.includes("renewal") || t.type.includes("grant")
                          ? "success"
                          : t.type.includes("refund")
                          ? "info"
                          : "default"
                      }
                    >
                      {t.type.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-200">{t.description}</td>
                  <td className="px-6 py-4 text-center font-bold">
                    <span className={t.credits >= 0 ? "text-emerald-400" : "text-amber-400"}>
                      {t.credits >= 0 ? `+${t.credits}` : t.credits}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-100">
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-slate-400">
                    {formatDateTime(t.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
