import { BookingRepository } from "./booking.repository";
import { CreditService } from "../credits/credit.service";
import { WaitlistService } from "../waitlists/waitlist.service";
import { MemberRepository } from "../members/member.repository";
import { CreateClassInput, BookClassInput, CancelBookingInput } from "./booking.schemas";

export class BookingService {
  static async getAllClasses() {
    return BookingRepository.findAllClasses();
  }

  static async getClassById(id: string) {
    const gymClass = await BookingRepository.findClassById(id);
    if (!gymClass) throw new Error(`Class ${id} not found`);
    return gymClass;
  }

  static async createNewClass(input: CreateClassInput) {
    return BookingRepository.createClass(input);
  }

  static async getMemberBookings(memberId?: string) {
    return BookingRepository.findAllMemberBookings(memberId);
  }

  /**
   * Process booking request with strict business rules:
   * 1. Check if class exists and member exists
   * 2. Check if member already has active booking
   * 3. If class is full, prompt/join waitlist
   * 4. Otherwise, deduct credits and confirm booking
   */
  static async bookClass(input: BookClassInput) {
    const gymClass = await BookingRepository.findClassById(input.classId);
    if (!gymClass) throw new Error("Class not found");

    const existing = await BookingRepository.findActiveBooking(input.memberId, input.classId);
    if (existing) {
      throw new Error("You already have an active booking for this class");
    }

    if (gymClass.isFull) {
      // Auto-join waitlist if class is at full capacity
      const waitlistRes = await WaitlistService.joinWaitlist(input.classId, input.memberId);
      return {
        status: "waitlisted" as const,
        waitlistId: waitlistRes.waitlistId,
        position: waitlistRes.position,
        message: `Class is full. You have joined the waitlist at position #${waitlistRes.position}.`,
      };
    }

    // Deduct credits via authoritative CreditService
    const { paymentType, creditsDeducted } = await CreditService.deductClassCredits(
      input.memberId,
      gymClass.creditCost,
      gymClass.title
    );

    const booking = await BookingRepository.createBooking({
      classId: input.classId,
      memberId: input.memberId,
      paymentType,
      creditsDeducted,
    });

    return {
      status: "confirmed" as const,
      booking,
      message: `Booking confirmed for ${gymClass.title}!`,
    };
  }

  /**
   * Cancel booking and process refund + auto-promote waitlist candidate
   */
  static async cancelBooking(input: CancelBookingInput) {
    const booking = await BookingRepository.findBookingById(input.bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.status === "cancelled") throw new Error("Booking is already cancelled");

    const gymClass = await BookingRepository.findClassById(booking.classId);
    const member = await MemberRepository.findById(booking.memberId);

    // Cancel booking state
    await BookingRepository.cancelBooking(input.bookingId);

    // Refund credits to member or corporate pool
    await CreditService.refundClassCredits(
      booking.memberId,
      booking.creditsDeducted,
      booking.paymentType,
      member?.companyId || null,
      gymClass?.title || "Class"
    );

    // Check waitlist for auto-promotion!
    const nextCandidate = await WaitlistService.getNextWaitlistCandidate(booking.classId);
    let promotedMemberName = null;

    if (nextCandidate && gymClass) {
      try {
        const candidateMember = await MemberRepository.findById(nextCandidate.memberId);
        if (candidateMember) {
          const { paymentType, creditsDeducted } = await CreditService.deductClassCredits(
            candidateMember.id,
            gymClass.creditCost,
            gymClass.title
          );

          await BookingRepository.createBooking({
            classId: booking.classId,
            memberId: candidateMember.id,
            paymentType,
            creditsDeducted,
          });

          await WaitlistService.promoteCandidate(nextCandidate.id);
          promotedMemberName = candidateMember.name;
        }
      } catch (err) {
        // If candidate cannot afford credits, skip auto-promotion gracefully
        console.warn(`Could not auto-promote waitlist candidate ${nextCandidate.memberId}:`, err);
      }
    }

    return {
      success: true,
      refundedCredits: booking.creditsDeducted,
      promotedWaitlistCandidate: promotedMemberName,
    };
  }

  static async checkInMember(bookingId: string) {
    const booking = await BookingRepository.findBookingById(bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.status === "cancelled") throw new Error("Cannot check in a cancelled booking");

    await BookingRepository.markCheckedIn(bookingId);
    return BookingRepository.findBookingById(bookingId);
  }
}
