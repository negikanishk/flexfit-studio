import { WaitlistRepository } from "./waitlist.repository";

export class WaitlistService {
  static async getClassWaitlist(classId: string) {
    return WaitlistRepository.findByClass(classId);
  }

  static async joinWaitlist(classId: string, memberId: string) {
    const existing = await WaitlistRepository.findActiveByMemberAndClass(memberId, classId);
    if (existing) {
      throw new Error(`Member is already on position #${existing.position} of the waitlist`);
    }

    const waitlistId = await WaitlistRepository.add(classId, memberId);
    const updatedList = await WaitlistRepository.findByClass(classId);
    const position = updatedList.find((w) => w.id === waitlistId)?.position || 1;

    return { waitlistId, position };
  }

  static async leaveWaitlist(waitlistId: string) {
    await WaitlistRepository.markCancelled(waitlistId);
  }

  static async getNextWaitlistCandidate(classId: string) {
    return WaitlistRepository.getNextInLine(classId);
  }

  static async promoteCandidate(waitlistId: string) {
    await WaitlistRepository.markPromoted(waitlistId);
  }
}
