import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const user = await findCurrentUser();

    if (!user)
      return Response.json({ error: "Refresh the page" }, { status: 401 });

    const userInvitationBonus = await db.invitationBonus.findUnique({
      where: { userId: user.id },
      include: { claimedRewards: true },
    });

    const rewards = await db.invitationRewareds.findMany({ where: {} });

    const userRewards = rewards.map((reward) => {
      const newReward = { ...reward, completedReferral: 0, isClamed: false };

      newReward.completedReferral =
        userInvitationBonus!.totalValidreferral >= reward.targetReferral
          ? reward.targetReferral
          : userInvitationBonus!.totalValidreferral;

      newReward.isClamed = !!userInvitationBonus!.claimedRewards.find(
        (clamedReward) => reward.id === clamedReward.rewardId
      );

      return newReward;
    });

    const statictic = {
      registersCount: userInvitationBonus!.totalRegisters,
      todayIncome: 0,
      validReferral: userInvitationBonus!.totalValidreferral,
      yeasterdayIncome: 0,
    };

    return Response.json({ rewards: userRewards, statictic }, { status: 200 });
  } catch (error) {
    console.log("Invitation Bonus = ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
