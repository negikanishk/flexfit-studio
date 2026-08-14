import { z } from "zod";

export const createClassSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  trainerId: z.string(),
  category: z.enum(["HIIT", "Yoga", "Pilates", "Strength", "Cycling", "Boxing"]),
  capacity: z.number().int().positive("Capacity must be greater than 0"),
  creditCost: z.number().int().positive("Credit cost must be at least 1"),
  startTime: z.string(),
  durationMinutes: z.number().int().positive().default(60),
  room: z.string().default("Studio A"),
});

export const bookClassSchema = z.object({
  classId: z.string(),
  memberId: z.string(),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string(),
  reason: z.string().optional(),
});

export const checkInMemberSchema = z.object({
  bookingId: z.string(),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type BookClassInput = z.infer<typeof bookClassSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type CheckInMemberInput = z.infer<typeof checkInMemberSchema>;
