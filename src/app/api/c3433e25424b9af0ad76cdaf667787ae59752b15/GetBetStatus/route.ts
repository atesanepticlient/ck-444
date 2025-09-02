

// //written by client




// import { db } from "@/lib/db";
// import { BetStatus } from "@prisma/client";
// import { NextRequest } from "next/server";

// const COMPANY_KEY = process.env.COMPANY_KEY ?? "F4D8A3106EA44C5D969D0AAE0B472762";

// function mapStatus(status: BetStatus | string): string {
//   // Map statuses to capitalised strings expected by the test harness.
//   if (status === BetStatus.RUNNING || status === "RUNNING") return "Running";
//   if (status === BetStatus.SETTLED || status === "SETTLED") return "Settled";
//   return "Void";
// }

// export const POST = async (req: NextRequest) => {
//   try {
//     const body = await req.json();
//     const companyKey = String(body?.CompanyKey ?? "").trim();
//     if (!companyKey || companyKey !== COMPANY_KEY) {
//       return Response.json({ ErrorCode: 4, ErrorMessage: "Invalid CompanyKey" }, { status: 200 });
//     }
//     const username = String(body?.Username ?? "").trim();
//     if (!username) {
//       return Response.json({ ErrorCode: 3, ErrorMessage: "Invalid Username" }, { status: 200 });
//     }
//     const transferCode = String(body?.TransferCode ?? "").trim();
//     const productType = Number(body?.ProductType);
//     const gameType = Number(body?.GameType);

//     const user = await db.user.findUnique({ where: { phone: username }, select: { id: true } });
//     if (!user) {
//       return Response.json({ ErrorCode: 1, ErrorMessage: "Member not exist" }, { status: 200 });
//     }

//     const bet = await db.bet.findFirst({
//       where: {
//         userId: user.id,
//         productType: productType,
//         gameType: gameType,
//         transferCode: transferCode
//       },
//       orderBy: { createdAt: "desc" }
//     });
//     if (!bet) {
//       return Response.json({ ErrorCode: 6, ErrorMessage: "Bet not exists" }, { status: 200 });
//     }
//     const statusStr = mapStatus(bet.status);
//     return Response.json(
//       {
//         ErrorCode: 0,
//         ErrorMessage: "No Error",
//         TransferCode: bet.transferCode,
//         TransactionId: bet.transactionId,
//         Status: statusStr
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("GetBetStatus error:", err);
//     return Response.json({ ErrorCode: 7, ErrorMessage: "Internal Error" }, { status: 200 });
//   }
// };



// GetBetStatus route (patched ordering for productType 9)

import { db } from "@/lib/db";
import { BetStatus } from "@prisma/client";
import { NextRequest } from "next/server";

const COMPANY_KEY = process.env.COMPANY_KEY ?? "F4D8A3106EA44C5D969D0AAE0B472762";

function mapStatus(status: BetStatus | string): string {
  if (status === BetStatus.RUNNING || status === "RUNNING") return "Running";
  if (status === BetStatus.SETTLED || status === "SETTLED") return "Settled";
  return "Void";
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const companyKey = String(body?.CompanyKey ?? "").trim();
    if (!companyKey || companyKey !== COMPANY_KEY) {
      return Response.json({ ErrorCode: 4, ErrorMessage: "Invalid CompanyKey" }, { status: 200 });
    }

    const username = String(body?.Username ?? "").trim();
    if (!username) {
      return Response.json({ ErrorCode: 3, ErrorMessage: "Invalid Username" }, { status: 200 });
    }

    const transferCode = String(body?.TransferCode ?? "").trim();
    const productType = Number(body?.ProductType);
    const TransactionId=body.TransactionId
    const gameType = Number(body?.GameType);

    const user = await db.user.findUnique({ where: { phone: username }, select: { id: true } });
    if (!user) {
      return Response.json({ ErrorCode: 1, ErrorMessage: "Member not exist" }, { status: 200 });
    }

    // ✅ CHANGE: Wan Mei (9) => pick the earliest record for this transferCode
    // Others => keep picking the latest (backwards compatible)
    const orderBy =
      productType === 9
        ? [{ createdAt: "asc" as const }, { id: "asc" as const }]
        : [{ createdAt: "desc" as const }, { id: "desc" as const }];

    const bet = await db.bet.findFirst({
      where: {
        userId: user.id,
        productType: productType,
        gameType: gameType,
        transferCode: transferCode,
        transactionId:TransactionId
      },
      orderBy,
    });

    if (!bet) {
      return Response.json({ ErrorCode: 6, ErrorMessage: "Bet not exists" }, { status: 200 });
    }

    const statusStr = mapStatus(bet.status);
    return Response.json(
      {
        ErrorCode: 0,
        ErrorMessage: "No Error",
        TransferCode: bet.transferCode,
        TransactionId: bet.transactionId, // now will be "730178" for productType 9
        Status: statusStr,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GetBetStatus error:", err);
    return Response.json({ ErrorCode: 7, ErrorMessage: "Internal Error" }, { status: 200 });
  }
};
