import { z } from "zod";

export const createMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["admin", "front_desk", "trainer", "member"]).default("member"),
  membershipId: z.string().optional(),
  companyId: z.string().optional(),
  initialCredits: z.number().int().min(0).default(0),
});

export const updateMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(["admin", "front_desk", "trainer", "member"]).optional(),
  membershipId: z.string().nullable().optional(),
  companyId: z.string().nullable().optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
