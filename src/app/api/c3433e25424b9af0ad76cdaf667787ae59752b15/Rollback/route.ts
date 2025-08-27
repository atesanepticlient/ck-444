import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const {
      Username,
      ProductType,
      GameType,
      TransferCode,
      ResultType,
      WinLoss,
    } = await req.json();
    const user = await db.user.findUnique({
      where: { playerId: Username },
      include: { wallet: true },
    });
    if (!user) {
      return Response.json(
        {
          ErrorCode: 1,
          ErrorMessage: "Member not exist",
        },
        { status: 200 }
      );
    }

    const bet = await db.bet.findFirst({
      where: {
        productType: ProductType,
        gameType: GameType,
        transferCode: TransferCode,
      },
    });
    ``;
    if (!bet) {
      return Response.json(
        {
          ErrorCode: 6,
          ErrorMessage: "Bet not exists",
          Balance: user.wallet.balance.toFixed(2),
        },
        { status: 200 }
      );
    }
    if (bet?.status == "RUNNING") {
      return Response.json(
        {
          ErrorCode: 2003,
          ErrorMessage: "Bet Already Rollback",
          Balance: user.wallet.balance.toFixed(2),
        },
        { status: 200 }
      );
    }

    // if (bet?.status == "CANCELED") {
    //   return Response.json(
    //     {
    //       ErrorCode: 2002,
    //       ErrorMessage: "Bet Already Canceled",
    //       Balance: user.wallet.balance.toFixed(2),
    //     },
    //     { status: 200 }
    //   );
    // }

    if (bet.result == "WON") {
      await db.wallet.update({
        where: { userId: user.id },
        data: {
          balance: {
            decrement: WinLoss,
          },
        },
      });
    } else if (bet.result == "TIE" || bet.result == "VOID") {
      await db.wallet.update({
        where: { userId: user.id },
        data: {
          balance: {
            decrement: bet?.amount,
          },
        },
      });
    } else if (bet.result == "LOST") {
      await db.wallet.update({
        where: { userId: user.id },
        data: {
          balance: {
            decrement: bet?.amount,
          },
        },
      });
    }
    await db.bet.update({
      where: { id: bet!.id },
      data: { status: "RUNNING", result: undefined, winloss: undefined },
    });
    const userBalance = (
      await db.user.findUnique({
        where: { playerId: Username },
        select: { wallet: { select: { balance: true } } },
      })
    ).wallet.balance;
    return Response.json(
      {
        AccountName: user.playerId,
        Balance: userBalance.toFixed(2),
        ErrorCode: 0,
        ErrorMessage: "No Error",
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { ErrorCode: 7, ErrorMessage: "Internal Error" },
      { status: 200 }
    );
  }
};
