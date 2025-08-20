import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const {
      Amount,
      Username,
      ProductType,
      GameType,
      GameId,
      TransferCode,
      TransactionId,
    } = await req.json();
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

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        wallet: {
          update: {
            balance: {
              decrement: Amount,
            },
          },
        },
        bettingRecord: {
          update: {
            totalBet: {
              increment: Amount,
            },
          },
        },
      },
    });

    await db.bet.create({
      data: {
        productType: ProductType,
        gameType: GameType,
        gameId: GameId,
        transferCode: TransferCode,
        transactionId: TransactionId,
        amount: Amount,
        user: {
          connect: {
            id: user!.id,
          },
        },
      },
    });

    return Response.json(
      {
        AccountName: user.name,
        Balance: user.wallet?.balance,
        ErrorCode: 0,
        ErrorMessage: "No Error",
        BetAmount: Amount,
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
