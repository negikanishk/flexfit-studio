import { InferSelectModel } from "drizzle-orm";
import { companies } from "@/server/db/schema";

export type Company = InferSelectModel<typeof companies>;

export type CompanyWithMembers = Company & {
  employeeCount: number;
};
