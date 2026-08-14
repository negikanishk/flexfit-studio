"use client";

import React from "react";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateTime } from "@/lib";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  Clock, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverviewPage() {
  const { data: members } = trpc.members.list.useQuery();
  const { data: classes } = trpc.bookings.listClasses.useQuery();
  const { data: metrics } = trpc.reports.getMetrics.useQuery();
  const { data: bookings } = trpc.bookings.listBookings.useQuery();

  const totalMembers = members?.length || 0;
  const activeClassesCount = classes?.length || 0;
  const totalRevenue = metrics?.totalRevenue || 0;
  const attendanceRate = metrics?.attendanceRatePercentage || 0;

  return (
    <div>
      <PageHeader
        title="FlexFit Studio Dashboard"
        description="Real-time studio operations, class bookings, waitlists, and revenue performance."
        action={
          <div className="flex gap-3">
            <Link href="/front-desk">
              <Button variant="secondary" className="gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Front Desk Desk
              </Button>
            </Link>
            <Link href="/bookings">
              <Button variant="primary" className="gap-2">
                <Calendar className="w-4 h-4" />
                Book Class
              </Button>
            </Link>
          </div>
        }
      />

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Active Members"
          value={totalMembers}
          subtitle="Registered gym members"
          icon={<Users className="w-5 h-5" />}
          trendColor="emerald"
        />
        <StatCard
          title="Scheduled Classes"
          value={activeClassesCount}
          subtitle="Group sessions available"
          icon={<Calendar className="w-5 h-5" />}
          trendColor="indigo"
        />
        <StatCard
          title="YTD Total Revenue"
          value={formatCurrency(totalRevenue)}
          subtitle="Memberships + Credits"
          icon={<DollarSign className="w-5 h-5" />}
          trendColor="amber"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle="Checked-in class bookings"
          icon={<UserCheck className="w-5 h-5" />}
          trendColor="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Classes Overview Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Today's Featured Classes"
              subtitle="Current schedule and room capacities"
              action={
                <Link href="/bookings" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                  View Full Schedule <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />

            <div className="space-y-4">
              {classes?.slice(0, 4).map((cls) => (
                <div
                  key={cls.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-100">{cls.title}</h4>
                      <Badge variant="info">{cls.category}</Badge>
                      {cls.isFull && <Badge variant="warning">FULL — Waitlist Active</Badge>}
                    </div>
                    <p className="text-xs text-slate-400">
                      Instructor: <strong className="text-slate-200">{cls.trainerName}</strong> • {cls.room}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatDateTime(cls.startTime)} ({cls.durationMinutes} mins)
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-200">
                      {cls.confirmedBookingsCount} / {cls.capacity} spots
                    </div>
                    <p className="text-xs text-emerald-400 mt-1 font-medium">
                      {cls.creditCost} {cls.creditCost === 1 ? "credit" : "credits"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Live Activity & Corporate Pools Snapshot */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Recent Activity" subtitle="Real-time class bookings & check-ins" />
            <div className="space-y-3">
              {bookings?.slice(0, 5).map((b) => (
                <div key={b.id} className="text-xs border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-slate-200">{b.member.name}</span>
                    <Badge
                      variant={
                        b.status === "attended"
                          ? "success"
                          : b.status === "confirmed"
                          ? "info"
                          : "danger"
                      }
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <p className="text-slate-400 mt-1">Booked <strong className="text-slate-300">{b.gymClass.title}</strong></p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{formatDateTime(b.bookedAt)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
