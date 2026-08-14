import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { FrontDeskService } from "@/features/front-desk/front-desk.service";

export const frontDeskRouter = router({
  todayOverview: publicProcedure.query(async () => {
    return FrontDeskService.getTodayOverview();
  }),

  fastCheckIn: publicProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ input }) => {
      return FrontDeskService.fastCheckIn(input.bookingId);
    }),

  memberLookup: publicProcedure
    .input(z.object({ query: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return FrontDeskService.lookupMember(input?.query);
    }),
});
