import { CreditRepository } from "./credit.repository";
import { MemberRepository } from "../members/member.repository";
import { CompanyRepository } from "../companies/company.repository";
import { CreditBalanceInfo } from "./credit.types";

export class CreditService {
  /**
   * Authoritative calculation of available credits for a member (personal + corporate pool)
   */
  static async getAvailableCredits(memberId: string): Promise<CreditBalanceInfo> {
    const details = await CreditRepository.getMemberCreditDetails(memberId);
    if (!details) {
      throw new Error(`Member ${memberId} not found`);
    }

    const personal = details.personalCredits;
    const corporateRemaining = details.company ? details.company.creditPoolRemaining : 0;

    return {
      personalCredits: personal,
      hasCorporatePool: !!details.company,
      corporateRemainingCredits: corporateRemaining,
      companyName: details.company ? details.company.name : null,
      totalAvailableCredits: personal + corporateRemaining,
    };
  }

  /**
   * Determine optimal payment source and deduct credits (prefer personal credits, fallback to corporate pool)
   */
  static async deductClassCredits(
    memberId: string,
    cost: number,
    classTitle: string
  ): Promise<{ paymentType: "personal_credit" | "corporate_credit"; creditsDeducted: number }> {
    const details = await CreditRepository.getMemberCreditDetails(memberId);
    if (!details) throw new Error("Member not found");

    if (details.personalCredits >= cost) {
      // Deduct from personal credits
      await MemberRepository.updateCredits(memberId, -cost);
      await CreditRepository.recordTransaction({
        memberId,
        type: "class_booking",
        amount: 0,
        credits: -cost,
        description: `Booked class '${classTitle}' using Personal Credits`,
      });
      return { paymentType: "personal_credit", creditsDeducted: cost };
    } else if (details.company && details.company.creditPoolRemaining >= cost) {
      // Deduct from corporate company credit pool
      await CompanyRepository.deductCredits(details.company.id, cost);
      await CreditRepository.recordTransaction({
        memberId,
        companyId: details.company.id,
        type: "class_booking",
        amount: 0,
        credits: -cost,
        description: `Booked class '${classTitle}' using ${details.company.name} Corporate Credit Pool`,
      });
      return { paymentType: "corporate_credit", creditsDeducted: cost };
    } else {
      throw new Error(
        `Insufficient credit balance. Class requires ${cost} credits, but member has ${details.personalCredits} personal and ${details.company?.creditPoolRemaining || 0} corporate credits available.`
      );
    }
  }

  /**
   * Refund credits upon class cancellation
   */
  static async refundClassCredits(
    memberId: string,
    creditsToRefund: number,
    paymentType: "personal_credit" | "corporate_credit" | "membership_allowance",
    companyId: string | null,
    classTitle: string
  ): Promise<void> {
    if (paymentType === "corporate_credit" && companyId) {
      await CompanyRepository.addCredits(companyId, creditsToRefund);
      await CreditRepository.recordTransaction({
        memberId,
        companyId,
        type: "class_cancellation_refund",
        amount: 0,
        credits: creditsToRefund,
        description: `Refunded ${creditsToRefund} credits to Corporate Pool for cancelled class '${classTitle}'`,
      });
    } else {
      await MemberRepository.updateCredits(memberId, creditsToRefund);
      await CreditRepository.recordTransaction({
        memberId,
        type: "class_cancellation_refund",
        amount: 0,
        credits: creditsToRefund,
        description: `Refunded ${creditsToRefund} Personal Credits for cancelled class '${classTitle}'`,
      });
    }
  }

  /**
   * Purchase additional personal credits
   */
  static async purchaseCredits(memberId: string, credits: number, amountPaid: number) {
    await MemberRepository.updateCredits(memberId, credits);
    await CreditRepository.recordTransaction({
      memberId,
      type: "credit_purchase",
      amount: amountPaid,
      credits: credits,
      description: `Purchased ${credits} Personal FlexCredits`,
    });
  }
}
