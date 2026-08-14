import { describe, it, expect, beforeAll } from "vitest";
import { BookingService } from "@/features/bookings/booking.service";
import { seedDatabase } from "@/server/db/seed";

describe("BookingService Business Logic & Capacity Limits", () => {
  beforeAll(async () => {
    await seedDatabase();
  });

  it("should list all scheduled classes with capacity information", async () => {
    const classes = await BookingService.getAllClasses();
    expect(classes.length).toBeGreaterThan(0);
    const morningHiit = classes.find((c) => c.id === "cls_hiit_morning");
    expect(morningHiit).toBeDefined();
    expect(morningHiit?.confirmedBookingsCount).toBe(3);
    expect(morningHiit?.availableSpots).toBe(0);
    expect(morningHiit?.isFull).toBe(true);
  });

  it("should auto-join waitlist when attempting to book a full class", async () => {
    // cls_hiit_morning is full (capacity 3)
    // usr_member_3 tries to book a full class that they aren't waitlisted for yet
    const result = await BookingService.bookClass({
      classId: "cls_hiit_morning",
      memberId: "usr_admin",
    });

    expect(result.status).toBe("waitlisted");
    expect(result.position).toBeGreaterThanOrEqual(1);
  });

  it("should cancel booking and process credit refund", async () => {
    const result = await BookingService.cancelBooking({
      bookingId: "bkg_1",
    });

    expect(result.success).toBe(true);
    expect(result.refundedCredits).toBe(1);
  });
});
