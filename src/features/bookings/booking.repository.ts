import { db } from "@/server/db";
import { bookings, classes, members, trainers } from "@/server/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { CreateClassInput } from "./booking.schemas";

export class BookingRepository {
  static async findAllClasses() {
    const classRows = await db
      .select({
        gymClass: classes,
        trainerMember: members,
      })
      .from(classes)
      .innerJoin(trainers, eq(classes.trainerId, trainers.id))
      .innerJoin(members, eq(trainers.memberId, members.id));

    return Promise.all(
      classRows.map(async (row) => {
        const countRes = await db
          .select({ count: sql<number>`count(*)` })
          .from(bookings)
          .where(
            and(
              eq(bookings.classId, row.gymClass.id),
              eq(bookings.status, "confirmed")
            )
          );
        const confirmedBookingsCount = Number(countRes[0]?.count || 0);
        const availableSpots = Math.max(0, row.gymClass.capacity - confirmedBookingsCount);
        return {
          ...row.gymClass,
          trainerName: row.trainerMember.name,
          confirmedBookingsCount,
          availableSpots,
          isFull: availableSpots === 0,
        };
      })
    );
  }

  static async findClassById(id: string) {
    const list = await this.findAllClasses();
    return list.find((c) => c.id === id) || null;
  }

  static async createClass(input: CreateClassInput) {
    const id = `cls_${Date.now()}`;
    await db.insert(classes)
      .values({
        id,
        title: input.title,
        description: input.description || null,
        trainerId: input.trainerId,
        category: input.category,
        capacity: input.capacity,
        creditCost: input.creditCost,
        startTime: input.startTime,
        durationMinutes: input.durationMinutes,
        room: input.room,
        status: "scheduled",
      });

    return this.findClassById(id);
  }

  static async findActiveBooking(memberId: string, classId: string) {
    const res = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.memberId, memberId),
          eq(bookings.classId, classId),
          eq(bookings.status, "confirmed")
        )
      );
    return res[0] || null;
  }

  static async createBooking(data: {
    classId: string;
    memberId: string;
    paymentType: "personal_credit" | "corporate_credit" | "membership_allowance";
    creditsDeducted: number;
  }) {
    const id = `bkg_${Date.now()}`;
    await db.insert(bookings)
      .values({
        id,
        classId: data.classId,
        memberId: data.memberId,
        status: "confirmed",
        paymentType: data.paymentType,
        creditsDeducted: data.creditsDeducted,
        bookedAt: new Date().toISOString(),
      });

    return this.findBookingById(id);
  }

  static async findBookingById(id: string) {
    const res = await db.select().from(bookings).where(eq(bookings.id, id));
    return res[0] || null;
  }

  static async findAllMemberBookings(memberId?: string) {
    let query = db
      .select({
        booking: bookings,
        gymClass: classes,
        member: members,
      })
      .from(bookings)
      .innerJoin(classes, eq(bookings.classId, classes.id))
      .innerJoin(members, eq(bookings.memberId, members.id));

    if (memberId) {
      query = query.where(eq(bookings.memberId, memberId)) as typeof query;
    }

    const rows = await query.orderBy(desc(bookings.bookedAt));
    return rows.map((r) => ({
      ...r.booking,
      gymClass: r.gymClass,
      member: r.member,
    }));
  }

  static async cancelBooking(bookingId: string) {
    await db.update(bookings)
      .set({
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
      })
      .where(eq(bookings.id, bookingId));
  }

  static async markCheckedIn(bookingId: string) {
    await db.update(bookings)
      .set({
        status: "attended",
        checkInTime: new Date().toISOString(),
      })
      .where(eq(bookings.id, bookingId));
  }
}
