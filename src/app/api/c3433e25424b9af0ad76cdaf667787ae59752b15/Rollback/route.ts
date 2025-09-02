import { db } from "@/lib/db";
import { BetStatus, BetResult } from "@prisma/client";
import { NextRequest } from "next/server";

/*
 * Rollback route
 *
 * Rolls a bet back to the RUNNING state.  This reverses the effects of a
 * prior settlement or cancellation so that the bet may be settled or
 * canceled again.  If the bet is already running, error 2003 is returned.
 * When rolling back a settled bet we remove only the credited win/loss
 * (or stake on ties); rolling back a canceled bet removes the refunded stake.
 * Concurrency is handled via a conditional update on the bet status.
 */

const COMPANY_KEY = process.env.COMPANY_KEY ?? "F4D8A3106EA44C5D969D0AAE0B472762";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const companyKey = String(body?.CompanyKey ?? "").trim();
    if (!companyKey || companyKey !== COMPANY_KEY) {
      return Response.json({ ErrorCode: 4, ErrorMessage: "Invalid CompanyKey", Balance: 0 }, { status: 200 });
    }
    const username = String(body?.Username ?? "").trim();
    if (!username) {
      return Response.json({ ErrorCode: 3, ErrorMessage: "Invalid Username", Balance: 0 }, { status: 200 });
    }
    const transferCode = String(body?.TransferCode ?? "").trim();
    const productType = Number(body?.ProductType);
    const gameType = Number(body?.GameType);
    // Fetch user and wallet
    const user = await db.user.findUnique({ where: { phone: username }, include: { wallet: true } });
    if (!user?.wallet) {
      return Response.json({ ErrorCode: 1, ErrorMessage: "Member not exist", Balance: 0 }, { status: 200 });
    }
    // Fetch the most recent bet for this transfer code
    const bet = await db.bet.findFirst({
      where: {
        userId: user.id,
        productType: productType,
        gameType: gameType,
        transferCode: transferCode
      },
      orderBy: { createdAt: "desc" }
    });
    if (!bet) {
      return Response.json({ ErrorCode: 6, ErrorMessage: "Bet not exists", Balance: Number(user.wallet.balance).toFixed(2) }, { status: 200 });
    }
    if (bet.status === BetStatus.RUNNING) {
      return Response.json({ ErrorCode: 2003, ErrorMessage: "Bet Already Running", Balance: Number(user.wallet.balance).toFixed(2) }, { status: 200 });
    }
    // Execute transactional rollback
    const rollbackResult = await db.$transaction(async (tx) => {
      const update = await tx.bet.updateMany({
        where: {
          userId: user.id,
          productType: productType,
          gameType: gameType,
          transferCode: transferCode,
          status: { in: [BetStatus.SETTLED, BetStatus.VOID, BetStatus.CANCELED] }
        },
        data: { status: BetStatus.RUNNING, result: null, winloss: null }
      });
      if (update.count === 0) {
        return { early: { ErrorCode: 2003, ErrorMessage: "Bet Already Running", Balance: Number(user.wallet.balance).toFixed(2) } };
      }
      // Determine adjustments based on the previous status of the latest bet
      let dec = 0;
      const stake = Number(bet.amount);
      const winloss = bet.winloss ? Number(bet.winloss) : 0;
      if (bet.status === BetStatus.SETTLED) {
        // Reverse settlement.  At settlement we credited only winLoss for wins
        // and cash‑out losses; stake was returned only for ties.
        if (bet.result === BetResult.WON) {
          dec = winloss;
        } else if (bet.result === BetResult.LOST) {
          if (winloss > 0) {
            dec = winloss;
          }
        } else if (bet.result === BetResult.TIE) {
          dec = stake;
        }
      } else if (bet.status === BetStatus.VOID || bet.status === BetStatus.CANCELED) {
        // Cancelled/void: stake was refunded in the cancel step
        dec = stake;
      }
      if (dec > 0) {
        await tx.wallet.update({ where: { userId: user.id }, data: { balance: { decrement: dec } } });
      }
      const newBal = await tx.wallet.findUnique({ where: { userId: user.id }, select: { balance: true } });
      return { ok: { ErrorCode: 0, ErrorMessage: "No Error", AccountName: username, Balance: Number(newBal?.balance ?? 0).toFixed(2) } };
    });
    if ((rollbackResult as any).early) {
      return Response.json((rollbackResult as any).early, { status: 200 });
    }
    return Response.json((rollbackResult as any).ok, { status: 200 });
  } catch (err) {
    console.error("Rollback error:", err);
    return Response.json({ ErrorCode: 7, ErrorMessage: "Internal Error", Balance: 0 }, { status: 200 });
  }
};
