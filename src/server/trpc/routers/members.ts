import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { MemberService } from "@/features/members/member.service";
import { createMemberSchema, updateMemberSchema } from "@/features/members/member.schemas";

export const membersRouter = router({
  list: publicProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return MemberService.getAllMembers(input?.search);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return MemberService.getMemberDetails(input.id);
    }),

  create: publicProcedure
    .input(createMemberSchema)
    .mutation(async ({ input }) => {
      return MemberService.registerMember(input);
    }),

  update: publicProcedure
    .input(updateMemberSchema)
    .mutation(async ({ input }) => {
      return MemberService.updateMemberProfile(input);
    }),

  addCredits: publicProcedure
    .input(z.object({ memberId: z.string(), credits: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return MemberService.addPersonalCredits(input.memberId, input.credits);
    }),
});
