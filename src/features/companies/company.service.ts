import { CompanyRepository } from "./company.repository";
import { CreditRepository } from "../credits/credit.repository";
import { CreateCompanyInput, AddCreditsToPoolInput } from "./company.schemas";

export class CompanyService {
  static async getAllCompanies() {
    return CompanyRepository.findAll();
  }

  static async getCompanyById(id: string) {
    const comp = await CompanyRepository.findById(id);
    if (!comp) throw new Error(`Company ${id} not found`);
    return comp;
  }

  static async registerCompany(input: CreateCompanyInput) {
    const comp = await CompanyRepository.create(input);
    if (comp) {
      await CreditRepository.recordTransaction({
        companyId: comp.id,
        type: "corporate_grant",
        amount: 0,
        credits: input.creditPoolTotal,
        description: `Initial Corporate Credit Pool setup for ${input.name}`,
      });
    }
    return comp;
  }

  static async topUpPool(input: AddCreditsToPoolInput) {
    await CompanyRepository.addCredits(input.companyId, input.credits);
    await CreditRepository.recordTransaction({
      companyId: input.companyId,
      type: "corporate_grant",
      amount: input.amountPaid,
      credits: input.credits,
      description: `Added ${input.credits} credits to Corporate Credit Pool`,
    });
  }
}
