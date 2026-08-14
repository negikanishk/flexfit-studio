import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { CompanyService } from "@/features/companies/company.service";
import { createCompanySchema, addCreditsToPoolSchema } from "@/features/companies/company.schemas";

export const companiesRouter = router({
  list: publicProcedure.query(async () => {
    return CompanyService.getAllCompanies();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return CompanyService.getCompanyById(input.id);
    }),

  create: publicProcedure
    .input(createCompanySchema)
    .mutation(async ({ input }) => {
      return CompanyService.registerCompany(input);
    }),

  topUpPool: publicProcedure
    .input(addCreditsToPoolSchema)
    .mutation(async ({ input }) => {
      return CompanyService.topUpPool(input);
    }),
});
