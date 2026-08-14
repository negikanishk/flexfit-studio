import { z } from "zod";

export const createTrainerSchema = z.object({
  memberId: z.string(),
  specialties: z.array(z.string()).min(1, "Select at least one specialty"),
  bio: z.string().optional(),
  hourlyRate: z.number().positive().default(45.0),
});

export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;
