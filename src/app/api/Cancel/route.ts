import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const {
      CompanyKey,
      ProductType,
      GameType,
      Username,
      TransferCode,
      TransactionId,
      IsCancelAll,
    } = await req.json();

    // Validate if the request fields are valid and required
    if (!CompanyKey || !ProductType || !GameType || !Username || !TransferCode || !TransactionId || typeof IsCancelAll !== "boolean") {
      return Response.json(
        { ErrorCode: 400, ErrorMessage: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Find the bet from the database based on TransferCode and GameType
    const bet = await db.bet.findFirst({
      where: {
        transferCode: TransferCode,
        gameType: GameType,
      },
    });

    // Check if the bet exists and is in "Running" or "Settled" status
    if (!bet) {
      return Response.json(
        { ErrorCode: 6, ErrorMessage: "Bet not found" },
        { status: 200 }
      );
    }

    // Check if the bet is already canceled
    if (bet.status === "CANCELED") {
      return Response.json(
        { ErrorCode: 2002, ErrorMessage: "Bet already canceled" },
        { status: 200 }
      );
    }

    // Ensure the bet status is either "Running" or "Settled"
    if (bet.status !== "RUNNING" && bet.status !== "SETTLED") {
      return Response.json(
        { ErrorCode: 2003, ErrorMessage: "Bet is not in a cancellable state" },
        { status: 200 }
      );
    }

    // If IsCancelAll is true, cancel all related sub-bets, otherwise cancel only the specific bet
    if (IsCancelAll) {
      await db.bet.updateMany({
        where: {
          transferCode: TransferCode,
          gameType: GameType,
        },
        data: {
          status: "CANCELED",
          result: "VOID",
          winloss: undefined,
        },
      });
    } else {
      await db.bet.update({
        where: { id: bet.id },
        data: {
          status: "CANCELED",
          result: "VOID",
          winloss: undefined,
        },
      });
    }

    // Retrieve user details and account balance
    const user = await db.user.findUnique({
      where: { playerId: Username },
      include: { wallet: true },
    });

    if (!user) {
      return Response.json(
        { ErrorCode: 1, ErrorMessage: "Member not found" },
        { status: 200 }
      );
    }

    // Return success response with user account details
    return Response.json(
      {
        AccountName: user.name,
        Balance: user.wallet?.balance,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle any internal errors
    return Response.json(
      { ErrorCode: 7, ErrorMessage: "Internal Error" },
      { status: 200 }
    );
  }
};
