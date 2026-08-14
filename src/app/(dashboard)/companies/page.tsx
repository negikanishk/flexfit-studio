"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Building2, Plus } from "lucide-react";

export default function CompaniesPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [topUpCredits, setTopUpCredits] = useState(100);
  const [topUpAmount, setTopUpAmount] = useState(1000);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const utils = trpc.useUtils();
  const { data: companies, isLoading } = trpc.companies.list.useQuery();

  const topUpMutation = trpc.companies.topUpPool.useMutation({
    onSuccess: () => {
      utils.companies.list.invalidate();
      setIsTopUpOpen(false);
    },
  });

  const handleTopUp = () => {
    if (!selectedCompanyId) return;
    topUpMutation.mutate({
      companyId: selectedCompanyId,
      credits: topUpCredits,
      amountPaid: topUpAmount,
    });
  };

  return (
    <div>
      <PageHeader
        title="Corporate Accounts & Credit Pools"
        description="Manage company credit accounts, corporate wellness credit pools, employee rosters, and pool refills."
      />

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading corporate pools...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies?.map((comp) => {
            const usagePercent = Math.round(
              ((comp.creditPoolTotal - comp.creditPoolRemaining) / comp.creditPoolTotal) * 100
            );

            return (
              <Card key={comp.id} className="space-y-6 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-950/80 border border-indigo-800/60 rounded-xl text-indigo-400">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{comp.name}</h3>
                      <p className="text-xs text-slate-400">Contact: {comp.contactEmail}</p>
                    </div>
                  </div>

                  <Badge variant="info">Corporate Partner</Badge>
                </div>

                {/* Pool Usage Progress */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Credit Pool Remaining</span>
                    <strong className="text-emerald-400 font-bold">
                      {comp.creditPoolRemaining} / {comp.creditPoolTotal} credits
                    </strong>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${Math.max(5, 100 - usagePercent)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                    <span>Used: {comp.creditPoolTotal - comp.creditPoolRemaining} credits ({usagePercent}%)</span>
                    <span>Affiliated Employees: {comp.employeeCount}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Account ID: <code className="text-slate-300">{comp.id}</code></span>

                  <Button
                    size="sm"
                    variant="primary"
                    className="gap-1.5"
                    onClick={() => {
                      setSelectedCompanyId(comp.id);
                      setIsTopUpOpen(true);
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Refill Credit Pool
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Top Up Corporate Pool Modal */}
      <Modal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        title="Refill Corporate Credit Pool"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Grant additional credits to this corporate account and record payment details.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Credits to Add
            </label>
            <input
              type="number"
              min={10}
              step={10}
              value={topUpCredits}
              onChange={(e) => setTopUpCredits(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Payment Amount ($ USD)
            </label>
            <input
              type="number"
              min={0}
              step={50}
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsTopUpOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={topUpMutation.isPending}
              onClick={handleTopUp}
            >
              Confirm Pool Refill
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
