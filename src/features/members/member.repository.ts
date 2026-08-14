import { db } from "@/server/db";
import { members, memberships, companies } from "@/server/db/schema";
import { eq, like, or } from "drizzle-orm";
import { CreateMemberInput, UpdateMemberInput } from "./member.schemas";

export class MemberRepository {
  static async findAll(searchQuery?: string) {
    if (searchQuery) {
      const q = `%${searchQuery}%`;
      return db
        .select()
        .from(members)
        .where(or(like(members.name, q), like(members.email, q), like(members.phone, q)));
    }
    return db.select().from(members);
  }

  static async findById(id: string) {
    const result = await db.select().from(members).where(eq(members.id, id));
    return result[0] || null;
  }

  static async findByIdWithDetails(id: string) {
    const member = await this.findById(id);
    if (!member) return null;

    let membership = null;
    if (member.membershipId) {
      const mRes = await db.select().from(memberships).where(eq(memberships.id, member.membershipId));
      membership = mRes[0] || null;
    }

    let company = null;
    if (member.companyId) {
      const cRes = await db.select().from(companies).where(eq(companies.id, member.companyId));
      company = cRes[0] || null;
    }

    return { ...member, membership, company };
  }

  static async create(input: CreateMemberInput) {
    const id = `usr_${Date.now()}`;
    await db.insert(members)
      .values({
        id,
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        role: input.role,
        membershipId: input.membershipId || null,
        companyId: input.companyId || null,
        personalCredits: input.initialCredits,
        status: "active",
      });

    return this.findById(id);
  }

  static async update(input: UpdateMemberInput) {
    await db.update(members)
      .set({
        ...(input.name && { name: input.name }),
        ...(input.email && { email: input.email }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.role && { role: input.role }),
        ...(input.membershipId !== undefined && { membershipId: input.membershipId }),
        ...(input.companyId !== undefined && { companyId: input.companyId }),
        ...(input.status && { status: input.status }),
      })
      .where(eq(members.id, input.id));

    return this.findById(input.id);
  }

  static async updateCredits(memberId: string, creditDelta: number) {
    const member = await this.findById(memberId);
    if (!member) throw new Error("Member not found");

    const newBalance = Math.max(0, member.personalCredits + creditDelta);
    await db.update(members)
      .set({ personalCredits: newBalance })
      .where(eq(members.id, memberId));

    return newBalance;
  }
}
