import { router, publicProcedure } from "../trpc";
import { ReportService } from "@/features/reports/report.service";

export const reportsRouter = router({
  getMetrics: publicProcedure.query(async () => {
    return ReportService.getFinancialReport();
  }),
});
