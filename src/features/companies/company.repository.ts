import { db } from "@/server/db";
import { companies, members } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { CreateCompanyInput } from "./company.schemas";

export class CompanyRepository {
  static async findAll() {
    const comps = await db.select().from(companies);
    const result = await Promise.all(
      comps.map(async (c) => {
        const empCountRes = await db
          .select({ count: sql<number>`count(*)` })
          .from(members)
          .where(eq(members.companyId, c.id));
        const employeeCount = Number(empCountRes[0]?.count || 0);
        return { ...c, employeeCount };
      })
    );
    return result;
  }

  static async findById(id: string) {
    const res = await db.select().from(companies).where(eq(companies.id, id));
    return res[0] || null;
  }

  static async create(input: CreateCompanyInput) {
    const id = `comp_${Date.now()}`;
    await db.insert(companies)
      .values({
        id,
        name: input.name,
        creditPoolTotal: input.creditPoolTotal,
        creditPoolRemaining: input.creditPoolTotal,
        contactEmail: input.contactEmail,
      });

    return this.findById(id);
  }

  static async deductCredits(companyId: string, credits: number) {
    const company = await this.findById(companyId);
    if (!company) throw new Error("Company not found");
    if (company.creditPoolRemaining < credits) {
      throw new Error(`Corporate pool has insufficient credits (${company.creditPoolRemaining} available)`);
    }

    await db.update(companies)
      .set({ creditPoolRemaining: company.creditPoolRemaining - credits })
      .where(eq(companies.id, companyId));

    return company.creditPoolRemaining - credits;
  }

  static async addCredits(companyId: string, credits: number) {
    const company = await this.findById(companyId);
    if (!company) throw new Error("Company not found");

    await db.update(companies)
      .set({
        creditPoolTotal: company.creditPoolTotal + credits,
        creditPoolRemaining: company.creditPoolRemaining + credits,
      })
      .where(eq(companies.id, companyId));
  }
}
