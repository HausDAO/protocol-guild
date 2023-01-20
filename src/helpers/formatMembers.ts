import { Member } from "../types/Member.types";

export function formatMembers(members: Member[]) {
  return members.map((member: Member) => ({
    account: member.account,
    activityMultiplier: member.activityMultiplier,
    secondsActive: member.secondsActive,
    startDate: member.startDate,
  }));
}
