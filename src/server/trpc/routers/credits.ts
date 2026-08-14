import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { CreditService } from "@/features/credits/credit.service";
import { CreditRepository } from "@/features/credits/credit.repository";
import { purchaseCreditsSchema } from "@/features/credits/credit.schemas";

export const creditsRouter = router({
  getAvailable: publicProcedure
    .input(z.object({ memberId: z.string() }))
    .query(async ({ input }) => {
      return CreditService.getAvailableCredits(input.memberId);
    }),

  purchase: publicProcedure
    .input(purchaseCreditsSchema)
    .mutation(async ({ input }) => {
      return CreditService.purchaseCredits(input.memberId, input.credits, input.amountPaid);
    }),

  getTransactionHistory: publicProcedure
    .input(z.object({ memberId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return CreditRepository.getTransactionHistory(input?.memberId);
    }),
});
