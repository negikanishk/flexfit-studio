"use client";

import React from "react";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatTimeOnly } from "@/lib";
import { UserCheck, Clock, CheckCircle2 } from "lucide-react";

export default function FrontDeskPage() {
  const utils = trpc.useUtils();
  const { data: schedule, isLoading } = trpc.frontDesk.todayOverview.useQuery();

  const checkInMutation = trpc.frontDesk.fastCheckIn.useMutation({
    onSuccess: () => {
      utils.frontDesk.todayOverview.invalidate();
    },
    onError: (err) => {
      alert(`Check-in Error: ${err.message}`);
    },
  });

  return (
    <div>
      <PageHeader
        title="Front Desk Desk Operations"
        description="Streamlined daily class check-in management and attendee verification."
      />

      <div className="space-y-8">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading daily schedule...</div>
        ) : schedule?.map((session) => (
          <Card key={session.classId} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-100">{session.title}</h3>
                  <Badge variant="info">{session.category}</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Instructor: <strong className="text-slate-200">{session.trainerName}</strong> • Room: {session.room}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium">{formatTimeOnly(session.startTime)}</span>
                </div>
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Confirmed: </span>
                  <strong className="text-emerald-400">{session.confirmedCount} / {session.capacity}</strong>
                </div>
              </div>
            </div>

            {/* Attendee Check-In Roster */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Class Attendee Roster
              </h4>
              {session.attendeeList.length === 0 ? (
                <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-800 text-xs text-slate-500 text-center">
                  No confirmed bookings for this session yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {session.attendeeList.map((attendee) => (
                    <div
                      key={attendee.bookingId}
                      className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-100 text-sm">{attendee.memberName}</p>
                        <p className="text-slate-400 text-xs">{attendee.email}</p>
                        <div className="pt-1">
                          <Badge
                            variant={
                              attendee.status === "attended"
                                ? "success"
                                : attendee.status === "confirmed"
                                ? "info"
                                : "danger"
                            }
                          >
                            {attendee.status}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        {attendee.status === "attended" ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                            <CheckCircle2 className="w-4 h-4" />
                            Checked In
                          </div>
                        ) : attendee.status === "confirmed" ? (
                          <Button
                            size="sm"
                            variant="primary"
                            className="gap-1 text-xs"
                            isLoading={checkInMutation.isPending}
                            onClick={() => checkInMutation.mutate({ bookingId: attendee.bookingId })}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Check In
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-500">{attendee.status}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
