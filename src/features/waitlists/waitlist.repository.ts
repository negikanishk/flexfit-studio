import { db } from "@/server/db";
import { waitlists, members } from "@/server/db/schema";
import { eq, and, sql, asc } from "drizzle-orm";

export class WaitlistRepository {
  static async findByClass(classId: string) {
    const rows = await db
      .select({
        waitlist: waitlists,
        member: members,
      })
      .from(waitlists)
      .innerJoin(members, eq(waitlists.memberId, members.id))
      .where(and(eq(waitlists.classId, classId), eq(waitlists.status, "waiting")))
      .orderBy(asc(waitlists.position));

    return rows.map((r) => ({
      ...r.waitlist,
      member: r.member,
    }));
  }

  static async findActiveByMemberAndClass(memberId: string, classId: string) {
    const res = await db
      .select()
      .from(waitlists)
      .where(
        and(
          eq(waitlists.memberId, memberId),
          eq(waitlists.classId, classId),
          eq(waitlists.status, "waiting")
        )
      );
    return res[0] || null;
  }

  static async getNextInLine(classId: string) {
    const res = await db
      .select()
      .from(waitlists)
      .where(and(eq(waitlists.classId, classId), eq(waitlists.status, "waiting")))
      .orderBy(asc(waitlists.position))
      .limit(1);
    return res[0] || null;
  }

  static async add(classId: string, memberId: string) {
    const currentMax = await db
      .select({ maxPos: sql<number>`COALESCE(MAX(${waitlists.position}), 0)` })
      .from(waitlists)
      .where(and(eq(waitlists.classId, classId), eq(waitlists.status, "waiting")));

    const nextPosition = (currentMax[0]?.maxPos || 0) + 1;
    const id = `wtl_${Date.now()}`;

    await db.insert(waitlists)
      .values({
        id,
        classId,
        memberId,
        position: nextPosition,
        status: "waiting",
      });

    return id;
  }

  static async markPromoted(waitlistId: string) {
    await db.update(waitlists)
      .set({
        status: "promoted",
        promotedAt: new Date().toISOString(),
      })
      .where(eq(waitlists.id, waitlistId));
  }

  static async markCancelled(waitlistId: string) {
    await db.update(waitlists)
      .set({ status: "cancelled" })
      .where(eq(waitlists.id, waitlistId));
  }
}
