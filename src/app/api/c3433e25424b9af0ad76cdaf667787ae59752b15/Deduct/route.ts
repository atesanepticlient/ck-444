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
    const existingBet = await db.bet.findFirst({
      where: { transactionId: TransactionId, transferCode: TransferCode },
    });

    if (existingBet) {
      return Response.json(
        {
          ErrorCode: 5003,
          ErrorMessage: "Bet With Same RefNo Exists",
          Balance: user.wallet.balance.toFixed(2),
        },
        { status: 200 }
      );
    }

    if (Amount > user.wallet.balance) {
      return Response.json(
        {
          ErrorCode: 5,
          ErrorMessage: "Not enough balance",
          Balance: user.wallet.balance.toFixed(2),
        },
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
            phone: user!.phone,
          },
        },
      },
    });

    return Response.json(
      {
        AccountName: user.playerId,
        Balance: (+user.wallet?.balance - Amount).toFixed(2),
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

// import { db } from "@/lib/db";
// import { NextRequest } from "next/server";

// export const POST = async (req: NextRequest) => {
//   try {
//     const {
//       Amount,
//       Username,
//       ProductType,
//       GameType,
//       GameId,
//       TransferCode,
//       TransactionId,
//     } = await req.json();

//     // Step 1: Fetch user details including wallet
//     const user = await db.user.findUnique({
//       where: { phone: Username },
//       include: { wallet: true },
//     });

//     if (!user || !user.wallet) {
//       // User or wallet not found
//       return Response.json(
//         { ErrorCode: 1, ErrorMessage: "Member not exist" },
//         { status: 200 }
//       );
//     }

//     // Step 2: Update wallet balance and betting record
//     await db.user.update({
//       where: {phone: Username },
//       data: {
//         wallet: {
//           update: {
//             balance: {
//               decrement: Amount,
//             },
//           },
//         },
//         bettingRecord: {
//           update: {
//             totalBet: {
//               increment: Amount,
//             },
//           },
//         },
//       },
//     });

//     // Step 3: Create a new bet record
//     await db.bet.create({
//       data: {
//         productType: ProductType,
//         gameType: GameType,
//         gameId: GameId,
//         transferCode: TransferCode,
//         transactionId: TransactionId,
//         amount: Amount,
//         user: {
//           connect: {
//             phone: user!.phone,
//           },
//         },
//       },
//     });

//     // Step 4: Fetch the updated user to get the new balance
//     const updatedUser = await db.user.findUnique({
//      where: { phone: Username },
//       include: { wallet: true },
//     });

//     // Return the response with updated balance and bet amount
//     return Response.json(
//       {
//         AccountName: user.phone,
//         Balance: updatedUser?.wallet?.balance?.toFixed(2), // Ensure balance is formatted
//         ErrorCode: 0,
//         ErrorMessage: "No Error",
//         BetAmount: Amount,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     // Log error for debugging
//     console.error("Internal Error:", error);

//     return Response.json(
//       { ErrorCode: 7, ErrorMessage: "Internal Error" },
//       { status: 200 }
//     );
//   }
// };

// import { db } from "@/lib/db";
// import { NextRequest } from "next/server";

// export const POST = async (req: NextRequest) => {
//   try {
//     const body = await req.json();

//     const Username: string = String(body?.Username ?? "");
//     const Amount = Number(body?.Amount);
//     const ProductType = Number(body?.ProductType);
//     const GameType = Number(body?.GameType);
//     const GameId = Number(body?.GameId);
//     const TransferCode = String(body?.TransferCode ?? "");
//     const TransactionId = String(body?.TransactionId ?? "");

//     // ---- Validation ----
//     if (!Username || !Number.isFinite(Amount)) {
//       return Response.json(
//         { ErrorCode: 3, ErrorMessage: "Invalid request payload" },
//         { status: 200 }
//       );
//     }

//     // Minimum amount check
//     if (Amount < 10) {
//       return Response.json(
//         {
//           ErrorCode: 7,
//           ErrorMessage: "Bet amount must be at least 10",
//           Balance: 0,
//         },
//         { status: 200 }
//       );
//     }

//     // ---- User fetch ----
//     const user = await db.user.findUnique({
//       where: { phone: Username },
//       include: { wallet: true, bettingRecord: true },
//     });

//     if (!user || !user.wallet) {
//       return Response.json(
//         { ErrorCode: 1, ErrorMessage: "Member not exist", Balance: 0 },
//         { status: 200 }
//       );
//     }

//     const currentBalance = Number(user.wallet.balance ?? 0);

//     // --- Balance check ---
//     if (currentBalance <= 0 || currentBalance < Amount) {
//       return Response.json(
//         {
//           ErrorCode: 8, // use a separate code for insufficient funds
//           ErrorMessage: "Insufficient balance",
//           Balance: currentBalance.toFixed(2),
//           AccountName: user.phone,
//         },
//         { status: 200 }
//       );
//     }

//     // Ensure bettingRecord exists
//     if (!user.bettingRecord) {
//       await db.bettingRecord.create({
//         data: {
//           user: { connect: { id: user.id } },
//           totalBet: 0,
//           totalWin: 0,
//         },
//       });
//     }

//     // ---- Transaction ----
//     const result = await db.$transaction(async (tx) => {
//       await tx.user.update({
//         where: { id: user.id },
//         data: {
//           wallet: { update: { balance: { decrement: Amount } } },
//           bettingRecord: { update: { totalBet: { increment: Amount } } },
//         },
//       });

//       const bet = await tx.bet.create({
//         data: {
//           productType: ProductType,
//           gameType: GameType,
//           gameId: GameId,
//           transferCode: TransferCode,
//           transactionId: TransactionId,
//           amount: Amount,
//           user: { connect: { id: user.id } },
//         },
//       });

//       const refreshed = await tx.user.findUnique({
//         where: { id: user.id },
//         include: { wallet: true },
//       });

//       return {
//         betId: bet.id,
//         balance: Number(refreshed?.wallet?.balance ?? 0),
//       };
//     });

//     return Response.json(
//       {
//         ErrorCode: 0,
//         AccountName: user.phone,
//         BetAmount: Amount,
//         Balance: result.balance.toFixed(2),
//       },
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("[Deduct API] bet/create failed:", {
//       message: err?.message,
//       code: err?.code,
//       meta: err?.meta,
//       stack: err?.stack,
//     });

//     if (err?.code === "P2002") {
//       return Response.json(
//         { ErrorCode: 6, ErrorMessage: "Duplicate bet (transfer/transaction exists)" },
//         { status: 200 }
//       );
//     }

//     if (err?.code === "P2021") {
//       return Response.json(
//         { ErrorCode: 7, ErrorMessage: "Bet table missing (run migration/db push)", Balance: 0 },
//         { status: 200 }
//       );
//     }

//     return Response.json(
//       { ErrorCode: 7, ErrorMessage: "Internal Error", Balance: 0 },
//       { status: 200 }
//     );
//   }
// };
