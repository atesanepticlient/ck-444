import { db } from "@/lib/db";
import { BetStatus, BetResult } from "@prisma/client";
import { NextRequest } from "next/server";

/*
 * Settle route
 *
 * This endpoint settles a running bet.  The client specifies the bet
 * identifiers (Username, TransferCode, ProductType, GameType) along with
 * the result information (WinLoss, ResultType and IsCashOut).  At settlement
 * we credit only the win/loss amount on a win (no stake is returned);
 * ties return the stake; cash‑out losses credit the winLoss amount.
 * Stake refunds and win reversals are handled on cancel/rollback flows.
 *
 * Concurrency: settlement is guarded by a conditional update across all
 * running bet rows for the given transfer code.  Duplicate concurrent
 * settle calls will result in one success and subsequent calls returning
 * error 2001.
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
    const winLossRaw = body?.WinLoss;
    const winLoss = Number(winLossRaw);
    const resultType = Number(body?.ResultType);
    const isCashOut = Boolean(body?.IsCashOut);
    // Validate numeric values
    if (!Number.isFinite(winLoss) || winLoss < 0) {
      return Response.json({ ErrorCode: 7, ErrorMessage: "Invalid WinLoss", Balance: 0 }, { status: 200 });
    }
    // Find user and bet
    const user = await db.user.findUnique({ where: { phone: username }, include: { wallet: true } });
    if (!user?.wallet) {
      return Response.json({ ErrorCode: 1, ErrorMessage: "Member not exist" }, { status: 200 });
    }
    // Fetch the most recent bet with this transfer code
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
    // Status checks
    if (bet.status === BetStatus.SETTLED) {
      return Response.json({ ErrorCode: 2001, ErrorMessage: "Bet Already Settled", Balance: Number(user.wallet.balance).toFixed(2) }, { status: 200 });
    }
    if (bet.status === BetStatus.VOID || bet.status === BetStatus.CANCELED) {
      return Response.json({ ErrorCode: 2002, ErrorMessage: "Bet Already Canceled", Balance: Number(user.wallet.balance).toFixed(2) }, { status: 200 });
    }
    // Determine the result enumeration
    let result: BetResult = BetResult.TIE;
    if (resultType === 0) result = BetResult.WON;
    else if (resultType === 1) result = BetResult.LOST;
    else if (resultType === 2) result = BetResult.TIE;
    // Determine stake (amount) from the latest bet record.  Because raises
    // create multiple bet rows with increasing amounts, the latest record
    // reflects the final stake.
    const stake = Number(bet.amount);
    // Compute credit amount based on result.  We do not return stake on a win.
    let credit = 0;
    if (result === BetResult.WON) {
      // Win: credit only the win/loss amount
      credit = winLoss;
    } else if (result === BetResult.LOST) {
      if (isCashOut && winLoss > 0) {
        // Cash‑out loss: credit winLoss
        credit = winLoss;
      }
    } else if (result === BetResult.TIE) {
      // Tie: return stake
      credit = stake;
    }
    // Execute transactional settlement with concurrency guard
    const settleResult = await db.$transaction(async (tx) => {
      // Attempt to mark all running bets for this transfer code as settled.
      const update = await tx.bet.updateMany({
        where: {
          userId: user.id,
          productType: productType,
          gameType: gameType,
          transferCode: transferCode,
          status: BetStatus.RUNNING
        },
        data: { status: BetStatus.SETTLED, result: result, winloss: winLoss }
      });
      if (update.count === 0) {
        // Determine the current status to return appropriate error
        const current = await tx.bet.findFirst({
          where: {
            userId: user.id,
            productType: productType,
            gameType: gameType,
            transferCode: transferCode
          },
          orderBy: { createdAt: "desc" },
          select: { status: true }
        });
        if (!current) {
          return { early: { ErrorCode: 6, ErrorMessage: "Bet not exists", Balance: Number(user.wallet.balance).toFixed(2) } };
        }
        if (current.status === BetStatus.SETTLED) {
          return { early: { ErrorCode: 2001, ErrorMessage: "Bet Already Settled", Balance: Number(user.wallet.balance).toFixed(2) } };
        }
        if (current.status === BetStatus.VOID || current.status === BetStatus.CANCELED) {
          return { early: { ErrorCode: 2002, ErrorMessage: "Bet Already Canceled", Balance: Number(user.wallet.balance).toFixed(2) } };
        }
        return { early: { ErrorCode: 7, ErrorMessage: "Concurrent update error", Balance: Number(user.wallet.balance).toFixed(2) } };
      }
      // Apply credit if needed
      if (credit > 0) {
        await tx.wallet.update({ where: { userId: user.id }, data: { balance: { increment: credit } } });
      }
      const newBal = await tx.wallet.findUnique({ where: { userId: user.id }, select: { balance: true } });
      return { ok: { ErrorCode: 0, ErrorMessage: "No Error", AccountName: username, Balance: Number(newBal?.balance ?? 0).toFixed(2) } };
    });
    if ((settleResult as any).early) {
      return Response.json((settleResult as any).early, { status: 200 });
    }
    return Response.json((settleResult as any).ok, { status: 200 });
  } catch (err) {
    console.error("Settle error:", err);
    return Response.json({ ErrorCode: 7, ErrorMessage: "Internal Error", Balance: 0 }, { status: 200 });
  }
};
