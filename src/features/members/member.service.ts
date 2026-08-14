import { MemberRepository } from "./member.repository";
import { CreateMemberInput, UpdateMemberInput } from "./member.schemas";

export class MemberService {
  static async getAllMembers(search?: string) {
    return MemberRepository.findAll(search);
  }

  static async getMemberDetails(id: string) {
    const member = await MemberRepository.findByIdWithDetails(id);
    if (!member) {
      throw new Error(`Member with ID ${id} not found`);
    }
    return member;
  }

  static async registerMember(input: CreateMemberInput) {
    return MemberRepository.create(input);
  }

  static async updateMemberProfile(input: UpdateMemberInput) {
    return MemberRepository.update(input);
  }

  static async addPersonalCredits(memberId: string, credits: number) {
    if (credits <= 0) {
      throw new Error("Credits added must be a positive integer");
    }
    return MemberRepository.updateCredits(memberId, credits);
  }

  static isMemberActive(status: string): boolean {
    return status === "active";
  }
}
