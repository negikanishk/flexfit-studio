import { router } from "./trpc";
import { membersRouter } from "./routers/members";
import { membershipsRouter } from "./routers/memberships";
import { creditsRouter } from "./routers/credits";
import { bookingsRouter } from "./routers/bookings";
import { waitlistsRouter } from "./routers/waitlists";
import { frontDeskRouter } from "./routers/frontDesk";
import { trainersRouter } from "./routers/trainers";
import { companiesRouter } from "./routers/companies";
import { reportsRouter } from "./routers/reports";

export const appRouter = router({
  members: membersRouter,
  memberships: membershipsRouter,
  credits: creditsRouter,
  bookings: bookingsRouter,
  waitlists: waitlistsRouter,
  frontDesk: frontDeskRouter,
  trainers: trainersRouter,
  companies: companiesRouter,
  reports: reportsRouter,
});

export type AppRouter = typeof appRouter;
