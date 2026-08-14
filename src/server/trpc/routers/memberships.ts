import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { MembershipService } from "@/features/memberships/membership.service";
import { createMembershipSchema } from "@/features/memberships/membership.schemas";

export const membershipsRouter = router({
  list: publicProcedure.query(async () => {
    return MembershipService.getAllPlans();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return MembershipService.getPlanById(input.id);
    }),

  create: publicProcedure
    .input(createMembershipSchema)
    .mutation(async ({ input }) => {
      return MembershipService.createPlan(input);
    }),
});
