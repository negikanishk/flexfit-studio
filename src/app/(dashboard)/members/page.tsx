"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { getRoleBadgeVariant } from "@/lib";
import { Search, CreditCard } from "lucide-react";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [creditsToAdd, setCreditsToAdd] = useState(5);
  const [isAddCreditOpen, setIsAddCreditOpen] = useState(false);

  const utils = trpc.useUtils();
  const { data: members, isLoading } = trpc.members.list.useQuery({ search });

  const addCreditsMutation = trpc.members.addCredits.useMutation({
    onSuccess: () => {
      utils.members.list.invalidate();
      setIsAddCreditOpen(false);
    },
  });

  const handleGrantCredits = () => {
    if (!selectedMemberId) return;
    addCreditsMutation.mutate({
      memberId: selectedMemberId,
      credits: creditsToAdd,
    });
  };

  return (
    <div>
      <PageHeader
        title="Member Roster & Accounts"
        description="View registered gym members, membership tiers, corporate affiliations, and credit balances."
        action={
          <div className="flex gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search member name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        }
      />

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Member Name</th>
                <th className="px-6 py-4">Email & Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Personal Credits</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Loading members...
                  </td>
                </tr>
              ) : members?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No members match your search criteria.
                  </td>
                </tr>
              ) : (
                members?.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-100 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 flex items-center justify-center font-bold text-xs">
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div>{m.name}</div>
                        <span className="text-[10px] text-slate-500">ID: {m.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>{m.email}</div>
                      <div className="text-slate-500">{m.phone || "No phone listed"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getRoleBadgeVariant(m.role)}>{m.role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={m.status === "active" ? "success" : "danger"}>
                        {m.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-400">
                      {m.personalCredits}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        onClick={() => {
                          setSelectedMemberId(m.id);
                          setIsAddCreditOpen(true);
                        }}
                      >
                        <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                        Grant Credits
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Grant Credits Modal */}
      <Modal
        isOpen={isAddCreditOpen}
        onClose={() => setIsAddCreditOpen(false)}
        title="Grant Personal Credits"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Select the number of credits to add to this member&apos;s personal balance.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Credit Amount
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={creditsToAdd}
              onChange={(e) => setCreditsToAdd(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsAddCreditOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={addCreditsMutation.isPending}
              onClick={handleGrantCredits}
            >
              Add {creditsToAdd} Credits
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
