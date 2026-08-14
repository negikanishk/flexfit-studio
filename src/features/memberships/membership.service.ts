import { MembershipRepository } from "./membership.repository";
import { CreateMembershipInput } from "./membership.schemas";

export class MembershipService {
  static async getAllPlans() {
    return MembershipRepository.findAll();
  }

  static async getPlanById(id: string) {
    return MembershipRepository.findById(id);
  }

  static async createPlan(input: CreateMembershipInput) {
    return MembershipRepository.create(input);
  }
}
