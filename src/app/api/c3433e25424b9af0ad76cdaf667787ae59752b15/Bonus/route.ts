// import { db } from "@/lib/db";
// import { BetStatus, BetResult } from "@prisma/client";
// import { NextRequest } from "next/server";

// const COMPANY_KEY = process.env.COMPANY_KEY ?? "F4D8A3106EA44C5D969D0AAE0B472762";

// export const POST = async (req: NextRequest) => {
//   try {
//     const body = await req.json();
//     const companyKey = String(body?.CompanyKey ?? "").trim();
//     if (!companyKey || companyKey !== COMPANY_KEY) {
//       return Response.json({ ErrorCode: 4, ErrorMessage: "Invalid CompanyKey", Balance: 0 }, { status: 200 });
//     }
//     const username = String(body?.Username ?? "").trim();
//     if (!username) {
//       return Response.json({ ErrorCode: 3, ErrorMessage: "Invalid Username", Balance: 0 }, { status: 200 });
//     }
//     const amountRaw = body?.Amount;
//     const amount = Number(amountRaw);
//     if (!Number.isFinite(amount) || amount <= 0) {
//       return Response.json({ ErrorCode: 7, ErrorMessage: "Invalid Amount", Balance: 0 }, { status: 200 });
//     }
//     const productType = Number(body?.ProductType);
//     const gameType = Number(body?.GameType);
//     // Bonus route only supports productType 9 and gameType 0
//     if (productType !== 9 || gameType !== 0) {
//       return Response.json({ ErrorCode: 7, ErrorMessage: "Invalid ProductType or GameType", Balance: 0 }, { status: 200 });
//     }
//     const transferCode = String(body?.TransferCode ?? "").trim();
//     const transactionId = String(body?.TransactionId ?? "").trim();
//     if (!transferCode || !transactionId) {
//       return Response.json({ ErrorCode: 7, ErrorMessage: "Invalid TransferCode or TransactionId", Balance: 0 }, { status: 200 });
//     }
//     // Fetch user
//     const user = await db.user.findUnique({ where: { phone: username }, include: { wallet: true } });
//     if (!user?.wallet) {
//       return Response.json({ ErrorCode: 1, ErrorMessage: "Member not exist", Balance: 0 }, { status: 200 });
//     }
//     // Check duplicate (transferCode+transactionId)
//     const existing = await db.bet.findFirst({
//       where: {
//         userId: user.id,
//         productType: productType,
//         gameType: gameType,
//         transferCode: transferCode,
//         transactionId: transactionId
//       }
//     });
//     if (existing) {
//       console.log('existing')
//       return Response.json({ ErrorCode: 5003, ErrorMessage: "Duplicate (transferCode+transactionId)", Balance: Number(user.wallet.balance).toFixed(2) }, { status: 200 });
//     }
//     // Perform transaction: credit wallet and record bonus as a settled bet
//     const result = await db.$transaction(async (tx) => {
//       await tx.wallet.update({ where: { userId: user.id }, data: { balance: { increment: amount } } });
//       await tx.bet.create({
//         data: {
//           userId: user.id,
//           productType: productType,
//           gameType: gameType,
//           gameId: Number(body?.GameId ?? 0),
//           amount: 0,
//           transferCode: transferCode,
//           transactionId: transactionId,
//           status: BetStatus.SETTLED,
//           result: BetResult.WON,
//           winloss: amount
//         }
//       });
//       const newBal = await tx.wallet.findUnique({ where: { userId: user.id }, select: { balance: true } });
//       return { ok: { ErrorCode: 0, ErrorMessage: "No Error", AccountName: username, Balance: Number(newBal?.balance ?? 0).toFixed(2) } };
//     });
//     return Response.json((result as any).ok, { status: 200 });
//   } catch (err) {
//     console.error("Bonus error:", err);
//     return Response.json({ ErrorCode: 7, ErrorMessage: "Internal Error", Balance: 0 }, { status: 200 });
//   }
// };
















import { db } from "@/lib/db";
import { BetStatus, BetResult, Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

const COMPANY_KEY =
  process.env.COMPANY_KEY ?? "F4D8A3106EA44C5D969D0AAE0B472762";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const companyKey = String(body?.CompanyKey ?? "").trim();
    if (!companyKey || companyKey !== COMPANY_KEY) {
      return Response.json(
        { ErrorCode: 4, ErrorMessage: "Invalid CompanyKey", Balance: 0 },
        { status: 200 }
      );
    }
    const username = String(body?.Username ?? "").trim();
    if (!username) {
      return Response.json(
        { ErrorCode: 3, ErrorMessage: "Invalid Username", Balance: 0 },
        { status: 200 }
      );
    }
    const amountRaw = body?.Amount;
    const amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount <= 0) {
      return Response.json(
        { ErrorCode: 7, ErrorMessage: "Invalid Amount", Balance: 0 },
        { status: 200 }
      );
    }
    const productType = Number(body?.ProductType);
    const gameType = Number(body?.GameType);
    if (productType !== 9 || gameType !== 0) {
      return Response.json(
        {
          ErrorCode: 7,
          ErrorMessage: "Invalid ProductType or GameType",
          Balance: 0,
        },
        { status: 200 }
      );
    }
    const transferCode = String(body?.TransferCode ?? "").trim();
    const transactionId = String(body?.TransactionId ?? "").trim();
    if (!transferCode || !transactionId) {
      return Response.json(
        {
          ErrorCode: 7,
          ErrorMessage: "Invalid TransferCode or TransactionId",
          Balance: 0,
        },
        { status: 200 }
      );
    }
    // Fetch user and wallet
    const user = await db.user.findUnique({
      where: { phone: username },
      include: { wallet: true },
    });
    if (!user?.wallet) {
      return Response.json(
        { ErrorCode: 1, ErrorMessage: "Member not exist", Balance: 0 },
        { status: 200 }
      );
    }

    // Retry loop to handle possible deadlocks/write conflicts (P2034)
    let result: any = null;
    const maxRetries = 3;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        result = await db.$transaction(
          async (tx) => {
            // Duplicate check: transferCode or transactionId cannot be reused
            const duplicate = await tx.bet.findFirst({
              where: {
                userId: user.id,
                productType: productType,
                gameType: gameType,
                OR: [
                  { transferCode: transferCode },
                  { transactionId: transactionId },
                ],
              },
            });
            if (duplicate) {
              return {
                early: {
                  ErrorCode: 5003,
                  ErrorMessage:
                    "Duplicate (transferCode or transactionId exists)",
                  Balance: Number(user.wallet.balance).toFixed(2),
                },
              };
            }

            // Credit wallet
            await tx.wallet.update({
              where: { userId: user.id },
              data: { balance: { increment: amount } },
            });

            // Create bonus record
            await tx.bet.create({
              data: {
                userId: user.id,
                productType: productType,
                gameType: gameType,
                gameId: Number(body?.GameId ?? 0),
                amount: 0,
                transferCode: transferCode,
                transactionId: transactionId,
                status: BetStatus.SETTLED,
                result: BetResult.WON,
                winloss: amount,
              },
            });

            // Fetch updated balance
            const newBal = await tx.wallet.findUnique({
              where: { userId: user.id },
              select: { balance: true },
            });
            return {
              ok: {
                ErrorCode: 0,
                ErrorMessage: "No Error",
                AccountName: username,
                Balance: Number(newBal?.balance ?? 0).toFixed(2),
              },
            };
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        );
        // If transaction succeeds, break out of the retry loop
        break;
      } catch (err: any) {
        // Retry on Prisma write-conflict error (P2034)
        if (err?.code === "P2034" && attempt < maxRetries - 1) {
          continue;
        }
        throw err;
      }
    }

    if ((result as any)?.early) {
      return Response.json((result as any).early, { status: 200 });
    }
    return Response.json((result as any)?.ok, { status: 200 });
  } catch (err) {
    console.error("Bonus error:", err);
    return Response.json(
      { ErrorCode: 7, ErrorMessage: "Internal Error", Balance: 0 },
      { status: 200 }
    );
  }
};
