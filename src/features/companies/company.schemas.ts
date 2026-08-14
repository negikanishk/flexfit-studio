import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(2, "Company name required"),
  creditPoolTotal: z.number().int().positive("Initial credit pool must be positive"),
  contactEmail: z.string().email("Valid HR/contact email required"),
});

export const addCreditsToPoolSchema = z.object({
  companyId: z.string(),
  credits: z.number().int().positive(),
  amountPaid: z.number().nonnegative(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type AddCreditsToPoolInput = z.infer<typeof addCreditsToPoolSchema>;
