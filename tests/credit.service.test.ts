import { describe, it, expect, beforeAll } from "vitest";
import { CreditService } from "@/features/credits/credit.service";
import { MemberService } from "@/features/members/member.service";
import { seedDatabase } from "@/server/db/seed";

describe("CreditService Business Logic", () => {
  beforeAll(async () => {
    await seedDatabase();
  });

  it("should calculate available credits for member with personal credits", async () => {
    // usr_member_1 has 8 personal credits in seed
    const info = await CreditService.getAvailableCredits("usr_member_1");
    expect(info.personalCredits).toBe(8);
    expect(info.totalAvailableCredits).toBeGreaterThanOrEqual(8);
  });

  it("should correctly deduct personal credits when sufficient balance exists", async () => {
    const initial = await CreditService.getAvailableCredits("usr_member_1");
    const result = await CreditService.deductClassCredits("usr_member_1", 1, "Test Class");

    expect(result.paymentType).toBe("personal_credit");
    expect(result.creditsDeducted).toBe(1);

    const updated = await CreditService.getAvailableCredits("usr_member_1");
    expect(updated.personalCredits).toBe(initial.personalCredits - 1);
  });

  it("should throw error if member has insufficient credits", async () => {
    // usr_member_4 has 1 credit
    await expect(
      CreditService.deductClassCredits("usr_member_4", 100, "Expensive Masterclass")
    ).rejects.toThrow(/Insufficient credit balance/);
  });
});
