/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { findCurrentUser } from "@/data/user";

type HistoryType = "all" | "deposit" | "withdraw";
type StatusFilter = "all" | "pending" | "approved" | "rejected";
type DepositStatus = "PENDING" | "APPROVED" | "REJECTED";
type WithdrawStatus = "PENDING" | "APPROVED" | "REJECTED";

interface DepositWhere {
  userId: string;
  status?: DepositStatus;
}

interface WithdrawWhere {
  userId: string;
  status?: WithdrawStatus;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") as HistoryType) || "all";
    const status = (searchParams.get("status") as StatusFilter) || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const recordId = searchParams.get("id");

    const user : any = await findCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const skip = (page - 1) * limit;

    // Base where clauses with proper typing
    const depositWhere: DepositWhere = { userId: user.id };
    const withdrawWhere: WithdrawWhere = { userId: user.id };

    // Apply status filters with type safety
    if (status !== "all") {
      const upperStatus = status.toUpperCase();
      if (type === "all" || type === "deposit") {
        depositWhere.status = upperStatus as DepositStatus;
      }
      if (type === "all" || type === "withdraw") {
        withdrawWhere.status = upperStatus as WithdrawStatus;
      }
    }

    let deposits: any[] = [];
    let withdrawals: any[] = [];
    let totalDeposits = 0;
    let totalWithdrawals = 0;

    if (type === "all" || type === "deposit") {
      // Get deposits with depositWallet info
      deposits = await db.deposit.findMany({
        where: depositWhere,
        include: {
          wallet: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      // Get paymentWallet info separately for deposit wallets
      const depositWalletIds = deposits
        .map((d) => d.depositWallet?.paymentWalletId)
        .filter(Boolean) as string[];

      const depositPaymentWallets =
        depositWalletIds.length > 0
          ? await db.paymentWallet.findMany({
              where: { id: { in: depositWalletIds } },
            })
          : [];

      // Combine the data
      deposits = deposits.map((deposit) => {
        const paymentWallet = depositPaymentWallets.find(
          (pw) => pw.id === deposit.depositWallet?.paymentWalletId
        );
        return {
          ...deposit,
          depositWallet: {
            ...deposit.depositWallet,
            paymentWallet: paymentWallet || null,
          },
        };
      });

      totalDeposits = await db.deposit.count({ where: depositWhere });
    }

    if (type === "all" || type === "withdraw") {
      // Get withdrawals with card info
      withdrawals = await db.withdraw.findMany({
        where: withdrawWhere,
        include: {
          card: {
            include: {
              container: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      // Get paymentWallet info separately for cards
      const cardPaymentWalletIds = withdrawals
        .map((w) => w.card?.paymentWalletid)
        .filter(Boolean) as string[];

      const cardPaymentWallets =
        cardPaymentWalletIds.length > 0
          ? await db.paymentWallet.findMany({
              where: { id: { in: cardPaymentWalletIds } },
            })
          : [];

      // Combine the data
      withdrawals = withdrawals.map((withdrawal) => {
        const paymentWallet = cardPaymentWallets.find(
          (pw) => pw.id === withdrawal.card?.paymentWalletid
        );
        return {
          ...withdrawal,
          card: {
            ...withdrawal.card,
            paymentWallet: paymentWallet || null,
          },
        };
      });

      totalWithdrawals = await db.withdraw.count({ where: withdrawWhere });
    }

    // Combine and sort results when showing all
    let combinedResults: any[] = [];
    if (type === "all") {
      combinedResults = [...deposits, ...withdrawals].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (type === "deposit") {
      combinedResults = deposits;
    } else {
      combinedResults = withdrawals;
    }

    // If a specific record ID is requested, find it
    let highlightedRecord = null;
    if (recordId) {
      if (type === "deposit" || type === "all") {
        highlightedRecord = deposits.find((d) => d.id === recordId);
      }
      if (!highlightedRecord && (type === "withdraw" || type === "all")) {
        highlightedRecord = withdrawals.find((w) => w.id === recordId);
      }
    }

    return NextResponse.json({
      data: combinedResults.slice(0, limit),
      total:
        type === "deposit"
          ? totalDeposits
          : type === "withdraw"
          ? totalWithdrawals
          : totalDeposits + totalWithdrawals,
      page,
      limit,
      highlightedId: highlightedRecord?.id || null,
    });
  } catch (error) {
    console.error("[HISTORY_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
