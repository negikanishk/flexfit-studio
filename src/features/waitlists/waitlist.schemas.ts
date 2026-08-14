import { z } from "zod";

export const joinWaitlistSchema = z.object({
  classId: z.string(),
  memberId: z.string(),
});

export const leaveWaitlistSchema = z.object({
  waitlistId: z.string(),
});

export type JoinWaitlistInput = z.infer<typeof joinWaitlistSchema>;
export type LeaveWaitlistInput = z.infer<typeof leaveWaitlistSchema>;
