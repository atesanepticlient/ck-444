// import { db } from "@/lib/db";
// import { BetStatus, BetResult } from "@prisma/client";
// import { NextRequest } from "next/server";

// /*
//  * Cancel route
//  *
//  * Cancels a bet and voids the stake.  If the bet is still running, the
//  * stake is refunded to the member.  If the bet has already been settled
//  * the client must pass IsCancelAll=true.  Cancellation reverses whatever
//  * credit was applied during settlement (i.e. removes the win/loss credit
//  * and returns the stake).  This logic applies uniformly across all
//  * product types, including 3rd WM.  Concurrency is handled via a
//  * conditional update on the bet status.
//  */

// const COMPANY_KEY = process.env.COMPANY_KEY ?? "F4D8A3106EA44C5D969D0AAE0B472762";

// export const POST = async (req: NextRequest) => {
//   try {
//     const body = await req.json();
//     const companyKey = String(body?.CompanyKey ?? "").trim();
//     if (!companyKey || companyKey !== COMPANY_KEY) {
//       // Always include Balance in error response
//       return Response.json({ ErrorCode: 4, ErrorMessage: "Invalid CompanyKey", Balance: 0 }, { status: 200 });
//     }

//     const username = String(body?.Username ?? "").trim();
//     if (!username) {
//       return Response.json({ ErrorCode: 3, ErrorMessage: "Invalid Username", Balance: 0 }, { status: 200 });
//     }

//     const transferCode = String(body?.TransferCode ?? "").trim();
//     const transactionId = String(body?.TransactionId ?? "").trim(); // <-- NEW: capture TransactionId
//     const productType = Number(body?.ProductType);
//     const gameType = Number(body?.GameType);
//     const isCancelAll = Boolean(body?.IsCancelAll);

//     // Fetch user and wallet
//     const user = await db.user.findUnique({ where: { phone: username }, include: { wallet: true } });
//     if (!user?.wallet) {
//       return Response.json({ ErrorCode: 1, ErrorMessage: "Member not exist", Balance: 0 }, { status: 200 });
//     }

//     // Fetch bet:
//     // - If IsCancelAll=false -> match BOTH transferCode AND transactionId (most recent just in case)
//     // - If IsCancelAll=true  -> match by transferCode (latest used for wallet reversal calc only)
//     const bet = await db.bet.findFirst({
//       where: {
//         userId: user.id,
//         productType,
//         gameType,
//         transferCode,
//         ...(isCancelAll ? {} : { transactionId }), // <-- key change
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     if (!bet) {
//       return Response.json(
//         { ErrorCode: 6, ErrorMessage: "Bet not exists", Balance: Number(user.wallet.balance).toFixed(2) },
//         { status: 200 }
//       );
//     }

//     // Already void
//     if (bet.status === BetStatus.VOID || bet.status === BetStatus.CANCELED) {
//       return Response.json(
//         { ErrorCode: 2002, AccountName: user?.phone, ErrorMessage: "Bet Already Voided", Balance: Number(user.wallet.balance).toFixed(2) },
//         { status: 200 }
//       );
//     }

//     // Settled but cancel not allowed without IsCancelAll
//     if (bet.status === BetStatus.SETTLED && !isCancelAll) {
//       return Response.json(
//         { ErrorCode: 2003, ErrorMessage: "For settled orders, IsCancelAll=true required", Balance: Number(user.wallet.balance).toFixed(2) },
//         { status: 200 }
//       );
//     }

//     // Execute transactional cancel
//     const cancelResult = await db.$transaction(async (tx) => {
//       const baseWhere = {
//         userId: user.id,
//         productType,
//         gameType,
//         transferCode,
//       };

//       // When IsCancelAll=false -> void ONLY the bet that matches BOTH transferCode & transactionId (and is RUNNING)
//       // When IsCancelAll=true  -> void all RUNNING/SETTLED under the transferCode
//       const whereForUpdate = isCancelAll
//         ? { ...baseWhere, status: { in: [BetStatus.RUNNING, BetStatus.SETTLED] } }
//         : { ...baseWhere, transactionId, id: bet.id, status: BetStatus.RUNNING }; // <-- include transactionId

//       const update = await tx.bet.updateMany({
//         where: whereForUpdate,
//         data: { status: BetStatus.VOID, result: BetResult.VOID, winloss: null },
//       });

//       if (update.count === 0) {
//         // nothing changed (race or already voided/not running)
//         return {
//           early: {
//             ErrorCode: 2002,
//             ErrorMessage: "Bet Already Voided",
//             Balance: Number(user.wallet.balance).toFixed(2),
//           },
//         };
//       }

//       // Compute wallet adjustments (based on fetched bet)
//       let inc = 0;
//       let dec = 0;
//       const stake = Number(bet.amount);
//       const winloss = bet.winloss ? Number(bet.winloss) : 0;

//       if (!isCancelAll) {
//         // Only the specific RUNNING bet (transferCode + transactionId)
//         if (bet.status === BetStatus.RUNNING) {
//           inc = stake; // refund stake
//         }
//       } else {
//         // Cancel-all behavior unchanged
//         if (bet.status === BetStatus.RUNNING) {
//           inc = stake;
//         } else if (bet.status === BetStatus.SETTLED) {
//           if (bet.result === BetResult.WON) {
//             dec = winloss; // remove credited win
//             inc = stake;   // return stake
//           } else if (bet.result === BetResult.LOST) {
//             if (winloss > 0) dec = winloss; // remove any positive credit
//             inc = stake;                    // return stake
//           } else if (bet.result === BetResult.TIE) {
//             // Tie: stake already returned at settlement; no wallet change
//           }
//         }
//       }

//       if (dec > 0) {
//         await tx.wallet.update({ where: { userId: user.id }, data: { balance: { decrement: dec } } });
//       }
//       if (inc > 0) {
//         await tx.wallet.update({ where: { userId: user.id }, data: { balance: { increment: inc } } });
//       }

//       const newBal = await tx.wallet.findUnique({ where: { userId: user.id }, select: { balance: true } });
//       return {
//         ok: {
//           ErrorCode: 0,
//           ErrorMessage: "No Error",
//           AccountName: username,
//           Balance: Number(newBal?.balance ?? 0).toFixed(2),
//         },
//       };
//     });

//     if ((cancelResult as any).early) {
//       return Response.json((cancelResult as any).early, { status: 200 });
//     }
//     return Response.json((cancelResult as any).ok, { status: 200 });
//   } catch (err) {
//     console.error("Cancel error:", err);
//     return Response.json({ ErrorCode: 7, ErrorMessage: "Internal Error", Balance: 0 }, { status: 200 });
//   }
// };



import { db } from "@/lib/db";
import { BetStatus, BetResult } from "@prisma/client";
import { NextRequest } from "next/server";

/*
 * Cancel route
 *
 * Cancels a bet and voids the stake.  If the bet is still running, the
 * stake is refunded to the member.  If the bet has already been settled
 * the client must pass IsCancelAll=true.  Cancellation reverses whatever
 * credit was applied during settlement (i.e. removes the win/loss credit
 * and returns the stake).  This logic applies uniformly across all
 * product types, including 3rd WM.  Concurrency is handled via a
 * conditional update on the bet status.
 */

const COMPANY_KEY = process.env.COMPANY_KEY ?? "F4D8A3106EA44C5D969D0AAE0B472762";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const companyKey = String(body?.CompanyKey ?? "").trim();
    if (!companyKey || companyKey !== COMPANY_KEY) {
      // Always include Balance in error response
      return Response.json({ ErrorCode: 4, ErrorMessage: "Invalid CompanyKey", Balance: 0 }, { status: 200 });
    }

    const username = String(body?.Username ?? "").trim();
    if (!username) {
      return Response.json({ ErrorCode: 3, ErrorMessage: "Invalid Username", Balance: 0 }, { status: 200 });
    }

    const transferCode = String(body?.TransferCode ?? "").trim();
    const transactionId = String(body?.TransactionId ?? "").trim(); // <-- NEW: capture TransactionId
    const productType = Number(body?.ProductType);
    const gameType = Number(body?.GameType);
    const isCancelAll = Boolean(body?.IsCancelAll);

    // Fetch user and wallet
    const user = await db.user.findUnique({ where: { phone: username }, include: { wallet: true } });
    if (!user?.wallet) {
      return Response.json({ ErrorCode: 1, ErrorMessage: "Member not exist", Balance: 0 }, { status: 200 });
    }

    // Fetch bet:
    // - If IsCancelAll=false -> match BOTH transferCode AND transactionId (most recent just in case)
    // - If IsCancelAll=true  -> match by transferCode (latest used for wallet reversal calc only)
    const bet = await db.bet.findFirst({
      where: {
        userId: user.id,
        productType,
        gameType,
        transferCode,
        ...(isCancelAll ? {} : { transactionId }), // <-- key change
      },
      orderBy: { createdAt: "desc" },
    });

    if (!bet) {
      return Response.json(
        { ErrorCode: 6, ErrorMessage: "Bet not exists", Balance: Number(user.wallet.balance).toFixed(2) },
        { status: 200 }
      );
    }

    // Already void
    if (bet.status === BetStatus.VOID || bet.status === BetStatus.CANCELED) {
      return Response.json(
        { ErrorCode: 2002, AccountName: user?.phone, ErrorMessage: "Bet Already Voided", Balance: Number(user.wallet.balance).toFixed(2) },
        { status: 200 }
      );
    }

    // Settled but cancel not allowed without IsCancelAll
    if (bet.status === BetStatus.SETTLED && !isCancelAll) {
      return Response.json(
        { ErrorCode: 2003, ErrorMessage: "For settled orders, IsCancelAll=true required", Balance: Number(user.wallet.balance).toFixed(2) },
        { status: 200 }
      );
    }

    // Execute transactional cancel
    const cancelResult = await db.$transaction(async (tx) => {
      const baseWhere = {
        userId: user.id,
        productType,
        gameType,
        transferCode,
      };

      // When IsCancelAll=false -> void ONLY the bet that matches BOTH transferCode & transactionId (and is RUNNING)
      // When IsCancelAll=true  -> void all RUNNING/SETTLED under the transferCode
      const whereForUpdate = isCancelAll
        ? { ...baseWhere, status: { in: [BetStatus.RUNNING, BetStatus.SETTLED] } }
        : { ...baseWhere, transactionId, id: bet.id, status: BetStatus.RUNNING }; // <-- include transactionId

      const update = await tx.bet.updateMany({
        where: whereForUpdate,
        data: { status: BetStatus.VOID, result: BetResult.VOID, winloss: null },
      });

      if (update.count === 0) {
        // nothing changed (race or already voided/not running)
        return {
          early: {
            ErrorCode: 2002,
            ErrorMessage: "Bet Already Voided",
            Balance: Number(user.wallet.balance).toFixed(2),
          },
        };
      }

      // Compute wallet adjustments (based on fetched bet)
      let inc = 0;
      let dec = 0;
      const stake = Number(bet.amount);
      const winloss = bet.winloss ? Number(bet.winloss) : 0;

        // Cancel-all behavior unchanged
        if (bet.status === BetStatus.RUNNING) {
          inc = stake;
        } else if (bet.status === BetStatus.SETTLED) {
          if (bet.result === BetResult.WON) {
            dec = winloss; // remove credited win
            inc = stake;   // return stake
          } else if (bet.result === BetResult.LOST) {
            if (winloss > 0) dec = winloss; // remove any positive credit
            inc = stake;                    // return stake
          } else if (bet.result === BetResult.TIE) {
            // Tie: stake already returned at settlement; no wallet change
          }
        }
      

      if (dec > 0) {
        await tx.wallet.update({ where: { userId: user.id }, data: { balance: { decrement: dec } } });
      }
      if (inc > 0) {
        await tx.wallet.update({ where: { userId: user.id }, data: { balance: { increment: inc } } });
      }

      const newBal = await tx.wallet.findUnique({ where: { userId: user.id }, select: { balance: true } });
      return {
        ok: {
          ErrorCode: 0,
          ErrorMessage: "No Error",
          AccountName: username,
          Balance: Number(newBal?.balance ?? 0).toFixed(2),
        },
      };
    });

    if ((cancelResult as any).early) {
      return Response.json((cancelResult as any).early, { status: 200 });
    }
    return Response.json((cancelResult as any).ok, { status: 200 });
  } catch (err) {
    console.error("Cancel error:", err);
    return Response.json({ ErrorCode: 7, ErrorMessage: "Internal Error", Balance: 0 }, { status: 200 });
  }
};
