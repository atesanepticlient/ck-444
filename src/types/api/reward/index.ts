import { Prisma } from "@prisma/client";

export type ExtendedWithUserRewards = Prisma.InvitationRewaredsGetPayload<{
  include: { claimedUsers: true };
}> & { completedReferral: number; isClamed: boolean };
export interface StaticticType {
  todayIncome: number;
  totalIncome: number;
  registersCount: number;
  validReferral: number;
}
export interface InviationRewardGetOutput {
  rewards: ExtendedWithUserRewards[];
  statictic: StaticticType;
}
