import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { WaitlistService } from "@/features/waitlists/waitlist.service";
import { joinWaitlistSchema, leaveWaitlistSchema } from "@/features/waitlists/waitlist.schemas";

export const waitlistsRouter = router({
  getByClass: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ input }) => {
      return WaitlistService.getClassWaitlist(input.classId);
    }),

  join: publicProcedure
    .input(joinWaitlistSchema)
    .mutation(async ({ input }) => {
      return WaitlistService.joinWaitlist(input.classId, input.memberId);
    }),

  leave: publicProcedure
    .input(leaveWaitlistSchema)
    .mutation(async ({ input }) => {
      return WaitlistService.leaveWaitlist(input.waitlistId);
    }),
});
