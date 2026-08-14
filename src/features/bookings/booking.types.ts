import { InferSelectModel } from "drizzle-orm";
import { bookings, classes, members } from "@/server/db/schema";

export type Booking = InferSelectModel<typeof bookings>;
export type GymClass = InferSelectModel<typeof classes>;

export type ClassWithDetails = GymClass & {
  trainerName: string;
  confirmedBookingsCount: number;
  availableSpots: number;
  isFull: boolean;
};

export type BookingWithDetails = Booking & {
  gymClass: GymClass;
  member: InferSelectModel<typeof members>;
};
