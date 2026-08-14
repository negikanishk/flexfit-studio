import { FrontDeskRepository } from "./front-desk.repository";
import { BookingService } from "../bookings/booking.service";
import { MemberService } from "../members/member.service";

export class FrontDeskService {
  static async getTodayOverview() {
    return FrontDeskRepository.getTodayScheduleOverview();
  }

  static async fastCheckIn(bookingId: string) {
    return BookingService.checkInMember(bookingId);
  }

  static async lookupMember(query?: string) {
    return MemberService.getAllMembers(query);
  }
}
