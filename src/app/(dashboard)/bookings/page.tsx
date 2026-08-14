"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDateTime } from "@/lib";
import { Clock, MapPin, Users, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function BookingsPage() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: classes } = trpc.bookings.listClasses.useQuery();
  const { data: members } = trpc.members.list.useQuery();

  const bookMutation = trpc.bookings.book.useMutation({
    onSuccess: (data) => {
      utils.bookings.listClasses.invalidate();
      utils.bookings.listBookings.invalidate();
      setIsBookModalOpen(false);
      setFeedbackMessage(data.message);
      setTimeout(() => setFeedbackMessage(null), 5000);
    },
    onError: (err) => {
      alert(`Booking Error: ${err.message}`);
    },
  });

  const selectedClass = classes?.find((c) => c.id === selectedClassId);

  const handleConfirmBooking = () => {
    if (!selectedClassId || !selectedMemberId) return;
    bookMutation.mutate({
      classId: selectedClassId,
      memberId: selectedMemberId,
    });
  };

  return (
    <div>
      <PageHeader
        title="Class Schedule & Bookings"
        description="Browse fitness classes, monitor real-time capacity limits, book spots, and handle waitlist queues."
      />

      {feedbackMessage && (
        <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-200 rounded-xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-medium">{feedbackMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes?.map((cls) => (
          <Card key={cls.id} className="flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="info">{cls.category}</Badge>
                  <h3 className="text-lg font-bold text-slate-100 mt-2">{cls.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400">{cls.creditCost}</span>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Credits</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{cls.description}</p>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDateTime(cls.startTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Instructor: <strong className="text-slate-100">{cls.trainerName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.room} ({cls.durationMinutes} mins)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Spots: </span>
                <strong className={cls.isFull ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                  {cls.availableSpots} / {cls.capacity} open
                </strong>
              </div>

              <Button
                size="sm"
                variant={cls.isFull ? "secondary" : "primary"}
                onClick={() => {
                  setSelectedClassId(cls.id);
                  setIsBookModalOpen(true);
                }}
              >
                {cls.isFull ? "Join Waitlist" : "Book Class"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Book / Waitlist Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title={selectedClass?.isFull ? "Join Class Waitlist" : "Reserve Class Spot"}
      >
        <div className="space-y-4">
          {selectedClass && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-slate-100 text-sm">{selectedClass.title}</p>
              <p className="text-slate-400">{formatDateTime(selectedClass.startTime)} • {selectedClass.room}</p>
              <p className="text-emerald-400 font-medium">Cost: {selectedClass.creditCost} Credits</p>
            </div>
          )}

          {selectedClass?.isFull && (
            <div className="p-3 bg-amber-950/60 border border-amber-800/60 rounded-lg text-xs text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>This class is currently at max capacity. Booking will automatically place member on the prioritized waitlist.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Member
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- Choose Member --</option>
              {members?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.personalCredits} credits available)
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setIsBookModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!selectedMemberId}
              isLoading={bookMutation.isPending}
              onClick={handleConfirmBooking}
            >
              {selectedClass?.isFull ? "Confirm Waitlist Position" : "Confirm Class Reservation"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
