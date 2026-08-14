import { db } from "@/server/db";
import { members, companies, transactions } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export class CreditRepository {
  static async getMemberCreditDetails(memberId: string) {
    const memberRes = await db.select().from(members).where(eq(members.id, memberId));
    const member = memberRes[0];
    if (!member) return null;

    let company = null;
    if (member.companyId) {
      const compRes = await db.select().from(companies).where(eq(companies.id, member.companyId));
      company = compRes[0] || null;
    }

    return {
      personalCredits: member.personalCredits,
      company,
    };
  }

  static async recordTransaction(data: {
    memberId?: string | null;
    companyId?: string | null;
    type: "membership_renewal" | "credit_purchase" | "class_booking" | "class_cancellation_refund" | "corporate_grant" | "manual_adjustment";
    amount: number;
    credits: number;
    description: string;
  }) {
    const id = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(transactions)
      .values({
        id,
        memberId: data.memberId || null,
        companyId: data.companyId || null,
        type: data.type,
        amount: data.amount,
        credits: data.credits,
        description: data.description,
      });

    return id;
  }

  static async getTransactionHistory(memberId?: string) {
    if (memberId) {
      return db
        .select()
        .from(transactions)
        .where(eq(transactions.memberId, memberId))
        .orderBy(desc(transactions.createdAt));
    }
    return db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }
}
