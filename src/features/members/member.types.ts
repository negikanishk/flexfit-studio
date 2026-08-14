import { InferSelectModel } from "drizzle-orm";
import { members, memberships, companies } from "@/server/db/schema";

export type Member = InferSelectModel<typeof members>;
export type Membership = InferSelectModel<typeof memberships>;
export type Company = InferSelectModel<typeof companies>;

export type MemberWithDetails = Member & {
  membership: Membership | null;
  company: Company | null;
};
