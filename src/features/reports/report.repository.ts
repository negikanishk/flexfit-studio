import { db } from "@/server/db";
import { transactions, bookings } from "@/server/db/schema";
import { RevenueSummary } from "./report.types";

export class ReportRepository {
  static async getRevenueMetrics(): Promise<RevenueSummary> {
    const txns = await db.select().from(transactions);
    
    let totalRevenue = 0;
    let membershipRevenue = 0;
    let creditPurchaseRevenue = 0;
    let corporateGrantRevenue = 0;

    for (const t of txns) {
      totalRevenue += t.amount;
      if (t.type === "membership_renewal") {
        membershipRevenue += t.amount;
      } else if (t.type === "credit_purchase") {
        creditPurchaseRevenue += t.amount;
      } else if (t.type === "corporate_grant") {
        corporateGrantRevenue += t.amount;
      }
    }

    const allBookings = await db.select().from(bookings);
    const totalBookingsCount = allBookings.length;
    const totalAttendedCount = allBookings.filter((b) => b.status === "attended").length;
    const attendanceRatePercentage = totalBookingsCount > 0
      ? Math.round((totalAttendedCount / totalBookingsCount) * 100)
      : 0;

    return {
      totalRevenue,
      membershipRevenue,
      creditPurchaseRevenue,
      corporateGrantRevenue,
      transactionCount: txns.length,
      totalBookingsCount,
      totalAttendedCount,
      attendanceRatePercentage,
    };
  }
}
