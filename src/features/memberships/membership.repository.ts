import { db } from "@/server/db";
import { memberships } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { CreateMembershipInput } from "./membership.schemas";

export class MembershipRepository {
  static async findAll() {
    return db.select().from(memberships);
  }

  static async findById(id: string) {
    const res = await db.select().from(memberships).where(eq(memberships.id, id));
    return res[0] || null;
  }

  static async create(input: CreateMembershipInput) {
    const id = `mem_tier_${Date.now()}`;
    await db.insert(memberships)
      .values({
        id,
        name: input.name,
        monthlyPrice: input.monthlyPrice,
        creditsPerMonth: input.creditsPerMonth,
        description: input.description || null,
      });

    return this.findById(id);
  }
}
