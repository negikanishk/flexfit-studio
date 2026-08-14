"use client";

import React from "react";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib";
import { Star } from "lucide-react";

export default function TrainersPage() {
  const { data: trainers, isLoading } = trpc.trainers.list.useQuery();

  return (
    <div>
      <PageHeader
        title="Trainer Staff & Specialties"
        description="Certified fitness instructors, class schedules, specialty credentials, and hourly rates."
      />

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading trainers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trainers?.map((t) => (
            <Card key={t.id} className="space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-300 flex items-center justify-center font-bold text-base shadow-inner">
                    {t.member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{t.member.name}</h3>
                    <p className="text-xs text-slate-400">{t.member.email}</p>
                  </div>
                </div>

                <Badge variant="warning" className="gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Certified Trainer
                </Badge>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 italic">
                &ldquo;{t.bio || "Dedicated fitness specialist committed to member results."}&rdquo;
              </p>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Specialties & Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {t.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-slate-800 text-slate-200 text-xs font-medium rounded-md border border-slate-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-400">
                  Rate: <strong className="text-emerald-400 font-bold">{formatCurrency(t.hourlyRate)} / hr</strong>
                </div>
                <div className="text-slate-400">
                  Phone: <span className="text-slate-200 font-medium">{t.member.phone || "N/A"}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
