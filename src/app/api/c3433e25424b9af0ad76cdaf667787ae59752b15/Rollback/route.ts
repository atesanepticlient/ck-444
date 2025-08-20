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

    const bet = await db.bet.findFirst({
      where: {
        productType: ProductType,
        gameType: GameType,
        transferCode: TransferCode,
      },
    });

    if (!bet) {
      return Response.json(
        { ErrorCode: 6, ErrorMessage: "Bet not exists" },
        { status: 200 }
      );
    }
    if (bet?.status == "RUNNING") {
      return Response.json(
        { ErrorCode: 2003, ErrorMessage: "Bet Already Rollback" },
        { status: 200 }
      );
    }

    if (bet?.status == "CANCELED") {
      return Response.json(
        { ErrorCode: 2002, ErrorMessage: "Bet Already Canceled" },
        { status: 200 }
      );
    }

    const user = await db.user.findUnique({
      where: { playerId: Username },
      include: { wallet: true },
    });
    if (!user) {
      return Response.json(
        { ErrorCode: 1, ErrorMessage: "Member not exist" },
        { status: 200 }
      );
    }

    if (bet.result == "WON") {
      await db.wallet.update({
        where: { userId: user.id },
        data: {
          balance: {
            decrement: WinLoss,
          },
        },
      });
    } else if (bet.result == "TIE") {
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

    return Response.json(
      {
        AccountName: user.name,
        Balance: user.wallet?.balance,
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
