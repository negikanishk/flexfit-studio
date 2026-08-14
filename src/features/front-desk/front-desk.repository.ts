import { BookingRepository } from "../bookings/booking.repository";
import { DailyScheduleItem } from "./front-desk.types";

export class FrontDeskRepository {
  static async getTodayScheduleOverview(): Promise<DailyScheduleItem[]> {
    const allClasses = await BookingRepository.findAllClasses();
    const allBookings = await BookingRepository.findAllMemberBookings();

    return allClasses.map((cls) => {
      const classBookings = allBookings.filter((b) => b.classId === cls.id);
      return {
        classId: cls.id,
        title: cls.title,
        category: cls.category,
        startTime: cls.startTime,
        room: cls.room,
        trainerName: cls.trainerName,
        capacity: cls.capacity,
        confirmedCount: cls.confirmedBookingsCount,
        attendeeList: classBookings.map((b) => ({
          bookingId: b.id,
          memberId: b.memberId,
          memberName: b.member.name,
          email: b.member.email,
          status: b.status,
          checkInTime: b.checkInTime,
        })),
      };
    });
  }
}
