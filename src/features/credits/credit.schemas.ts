import { z } from "zod";

export const purchaseCreditsSchema = z.object({
  memberId: z.string(),
  credits: z.number().int().positive("Must purchase at least 1 credit"),
  amountPaid: z.number().nonnegative("Amount paid must be 0 or greater"),
});

export const adjustCorporatePoolSchema = z.object({
  companyId: z.string(),
  creditsToAdd: z.number().int().positive(),
  amountPaid: z.number().nonnegative(),
});

export type PurchaseCreditsInput = z.infer<typeof purchaseCreditsSchema>;
export type AdjustCorporatePoolInput = z.infer<typeof adjustCorporatePoolSchema>;
