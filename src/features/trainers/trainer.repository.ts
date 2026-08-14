import { db } from "@/server/db";
import { trainers, members } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { CreateTrainerInput } from "./trainer.schemas";

export class TrainerRepository {
  static async findAll() {
    const rows = await db
      .select({
        trainer: trainers,
        member: members,
      })
      .from(trainers)
      .innerJoin(members, eq(trainers.memberId, members.id));

    return rows.map((r) => ({
      ...r.trainer,
      specialties: JSON.parse(r.trainer.specialties || "[]") as string[],
      member: r.member,
    }));
  }

  static async findById(id: string) {
    const rows = await db
      .select({
        trainer: trainers,
        member: members,
      })
      .from(trainers)
      .innerJoin(members, eq(trainers.memberId, members.id))
      .where(eq(trainers.id, id));

    const r = rows[0];
    if (!r) return null;

    return {
      ...r.trainer,
      specialties: JSON.parse(r.trainer.specialties || "[]") as string[],
      member: r.member,
    };
  }

  static async create(input: CreateTrainerInput) {
    const id = `trn_${Date.now()}`;
    await db.insert(trainers)
      .values({
        id,
        memberId: input.memberId,
        specialties: JSON.stringify(input.specialties),
        bio: input.bio || null,
        hourlyRate: input.hourlyRate,
      });

    // Ensure member role is updated to trainer
    await db.update(members)
      .set({ role: "trainer" })
      .where(eq(members.id, input.memberId));

    return this.findById(id);
  }
}
