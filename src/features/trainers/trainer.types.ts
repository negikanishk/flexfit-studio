import { InferSelectModel } from "drizzle-orm";
import { trainers, members } from "@/server/db/schema";

export type Trainer = InferSelectModel<typeof trainers>;
export type TrainerWithMember = Trainer & {
  member: InferSelectModel<typeof members>;
};
