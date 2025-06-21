import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const user = await findCurrentUser();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const totalWithdrawOfLast24h = await db.withdraw.count({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    const wallet = await db.wallet.findFirst({
      where: { userId: user!.id },
    });
    console.log({ wallet });
    const availableBalance = +wallet!.balance - +wallet!.turnOver;

    const minWithdraw = 10000;
    const maxWithdraw = 25000;

    return Response.json({
      mainBalance: wallet!.balance,
      turnOver: wallet!.turnOver,
      availableBalance,
      remainingWithdrawal: 10 - totalWithdrawOfLast24h,
      minWithdraw,
      maxWithdraw,
    });
  } catch (error) {
    console.log("WITHDRAW PAGE ERROR = ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
