import { ReportRepository } from "./report.repository";

export class ReportService {
  static async getFinancialReport() {
    return ReportRepository.getRevenueMetrics();
  }
}
