import { InferSelectModel } from "drizzle-orm";
import { memberships } from "@/server/db/schema";

export type MembershipPlan = InferSelectModel<typeof memberships>;
