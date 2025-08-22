import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Extracting the data from the request
    const {
      CompanyKey,
      ProductType,
      GameType,
      Username,
      TransferCode,
      TransactionId,
      Status,
      WinLoss,
      Stake,
    } = await req.json();

    // Validate required parameters
    if (
      !CompanyKey ||
      !ProductType ||
      !GameType ||
      !Username ||
      !TransferCode ||
      !TransactionId ||
      !Status ||
      WinLoss === undefined ||
      Stake === undefined
    ) {
      return Response.json(
        { ErrorCode: 400, ErrorMessage: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate the status value (must be one of running, settled, or void)
    if (!["running", "settled", "void"].includes(Status.toLowerCase())) {
      return Response.json(
        { ErrorCode: 4001, ErrorMessage: "Invalid bet status" },
        { status: 400 }
      );
    }

    // Find the bet using the TransferCode and GameType
    const bet = await db.bet.findFirst({
      where: {
        transferCode: TransferCode,
        gameType: GameType,
      },
    });

    // If no bet is found, return an error
    if (!bet) {
      return Response.json(
        { ErrorCode: 6, ErrorMessage: "Bet not found" },
        { status: 200 }
      );
    }

    // Check if the bet's current status matches the incoming status
    if (bet.status !== Status.toUpperCase()) {
      return Response.json(
        { ErrorCode: 2001, ErrorMessage: `Bet status mismatch: expected ${bet.status}, received ${Status}` },
        { status: 200 }
      );
    }

    // Check if the win/loss and stake values match
    if (bet.amount !== Stake || bet.winloss !== WinLoss) {
      return Response.json(
        { ErrorCode: 2002, ErrorMessage: "Stake or Win/Loss value mismatch" },
        { status: 200 }
      );
    }

    // Retrieve user details to include in the response
    const user = await db.user.findUnique({
      where: { playerId: Username },
      include: { wallet: true },
    });

    // If user is not found, return an error
    if (!user) {
      return Response.json(
        { ErrorCode: 1, ErrorMessage: "User not found" },
        { status: 200 }
      );
    }

    // Return success response with account details and bet status
    return Response.json(
      {
        AccountName: user.name,
        Status: bet.status,
        WinLoss: bet.winloss,
        Stake: bet.amount, // Use bet.amount for the stake
        ErrorCode: 0,
        ErrorMessage: "Bet status synced successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing GetBetStatus request:", error);
    return Response.json(
      { ErrorCode: 7, ErrorMessage: "Internal Error" },
      { status: 500 }
    );
  }
};
