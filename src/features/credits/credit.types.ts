import { InferSelectModel } from "drizzle-orm";
import { transactions } from "@/server/db/schema";

export type Transaction = InferSelectModel<typeof transactions>;

export type CreditBalanceInfo = {
  personalCredits: number;
  hasCorporatePool: boolean;
  corporateRemainingCredits: number;
  companyName: string | null;
  totalAvailableCredits: number;
};
