import { z } from "zod";

export const createMembershipSchema = z.object({
  name: z.string().min(2, "Plan name must be at least 2 characters"),
  monthlyPrice: z.number().positive("Price must be greater than 0"),
  creditsPerMonth: z.number().int().min(0, "Credits per month cannot be negative"),
  description: z.string().optional(),
});

export type CreateMembershipInput = z.infer<typeof createMembershipSchema>;
