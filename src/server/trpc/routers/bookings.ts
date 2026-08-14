import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { BookingService } from "@/features/bookings/booking.service";
import { createClassSchema, bookClassSchema, cancelBookingSchema, checkInMemberSchema } from "@/features/bookings/booking.schemas";

export const bookingsRouter = router({
  listClasses: publicProcedure.query(async () => {
    return BookingService.getAllClasses();
  }),

  getClassById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return BookingService.getClassById(input.id);
    }),

  createClass: publicProcedure
    .input(createClassSchema)
    .mutation(async ({ input }) => {
      return BookingService.createNewClass(input);
    }),

  listBookings: publicProcedure
    .input(z.object({ memberId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return BookingService.getMemberBookings(input?.memberId);
    }),

  book: publicProcedure
    .input(bookClassSchema)
    .mutation(async ({ input }) => {
      return BookingService.bookClass(input);
    }),

  cancel: publicProcedure
    .input(cancelBookingSchema)
    .mutation(async ({ input }) => {
      return BookingService.cancelBooking(input);
    }),

  checkIn: publicProcedure
    .input(checkInMemberSchema)
    .mutation(async ({ input }) => {
      return BookingService.checkInMember(input.bookingId);
    }),
});
