import { InferSelectModel } from "drizzle-orm";
import { waitlists, members } from "@/server/db/schema";

export type WaitlistEntry = InferSelectModel<typeof waitlists>;

export type WaitlistEntryWithMember = WaitlistEntry & {
  member: InferSelectModel<typeof members>;
};
