import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Extract the required fields from the request body
    const {
      CompanyKey,
      Username,
      ProductType,
      GameType,
      GameId,
      Amount,
      TransferCode,
      TransactionId,
    } = await req.json();

    // Validate that the necessary fields are provided
    if (
      !CompanyKey ||
      !Username ||
      !ProductType ||
      !GameType ||
      !Amount ||
      !TransferCode ||
      !TransactionId
    ) {
      return Response.json(
        { ErrorCode: 400, ErrorMessage: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Fetch the user from the database
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

    // Update the user's wallet balance and betting record
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        wallet: {
          update: {
            balance: {
              decrement: Amount, // Deduct the amount from the wallet
            },
          },
        },
        bettingRecord: {
          update: {
            totalBet: {
              increment: Amount, // Increment the total bet amount
            },
          },
        },
      },
    });

    // Create a new bet record in the database
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
            id: user.id,
          },
        },
      },
    });

    // Return a successful response with the account information
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
  } catch (error) {
    console.error("Error processing bet request:", error);
    return Response.json(
      { ErrorCode: 7, ErrorMessage: "Internal Error" },
      { status: 500 }
    );
  }
};
