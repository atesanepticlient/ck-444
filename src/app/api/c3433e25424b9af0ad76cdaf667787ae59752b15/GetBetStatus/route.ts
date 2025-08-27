import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { Username, ProductType, GameType, TransferCode, TransactionId } =
      await req.json();

    const bet = await db.bet.findFirst({
      where: {
        productType: ProductType,
        gameType: GameType,
        transferCode: TransferCode,
      },
    });

    if (!bet) {
      return Response.json(
        { ErrorCode: 6, ErrorMessage: "Bet not exists" },
        { status: 200 }
      );
    }

    if (bet?.status == "CANCELED") {
      return Response.json(
        {
          TransferCode: TransferCode,
          TransactionId: TransactionId,
          Status: "Void",
          WinLoss: bet.winloss || +bet.amount + 0,
          Stake: bet.amount,
          ErrorCode: 0,
          ErrorMessage: "No Error",
        },
        { status: 200 }
      );
    }

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

    return Response.json(
      {
        TransferCode: TransferCode,
        TransactionId: TransactionId,
        Status: bet.status.toLocaleLowerCase(),
        WinLoss: bet.winloss || +bet.amount + 0,
        Stake: bet.amount,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { ErrorCode: 6, ErrorMessage: "Bet not exists" },
      { status: 200 }
    );
  }

  return Response.json(
    { ErrorCode: 7, ErrorMessage: "Internal Error" },
    { status: 200 }
  );
};

//written by client
// import { db } from "@/lib/db";
// import { NextRequest } from "next/server";

// export const POST = async (req: NextRequest) => {
//   try {
//     const { Username, ProductType, GameType, TransferCode, TransactionId } =
//       await req.json();

//     // Find the bet (you can tighten this filter if needed, e.g. also by transactionId)
//     const bet = await db.bet.findFirst({
//       where: {
//         productType: Number(ProductType),
//         gameType: Number(GameType),
//         transferCode: String(TransferCode),
//       },
//     });

//     if (!bet) {
//       return Response.json(
//         { ErrorCode: 6, ErrorMessage: "Bet not exists" },
//         { status: 200 }
//       );
//     }

//     // If you still want to validate the user:
//     const user = await db.user.findUnique({
//       where: { phone: String(Username) },
//       include: { wallet: true },
//     });
//     if (!user) {
//       return Response.json(
//         { ErrorCode: 1, ErrorMessage: "Member not exist" },
//         { status: 200 }
//       );
//     }

//     // Map DB enum -> API status strings
//     const mapStatus = (s: string) => {
//       switch (s) {
//         case "CANCELED":
//         case "VOID":
//           return "Void";
//         case "SETTLED":
//           return "settled";
//         case "RUNNING":
//         default:
//           return "running";
//       }
//     };

//     // If CANCELED (or already VOID), return success with Status: "Void"
//     if (bet.status === "CANCELED" || bet.status === "VOID") {
//       return Response.json(
//         {
//           ErrorCode: 0,
//           TransferCode: TransferCode ?? bet.transferCode,
//           TransactionId: TransactionId ?? bet.transactionId,
//           Status: "Void",
//         },
//         { status: 200 }
//       );
//     }

//     // Otherwise, return the normal success payload
//     return Response.json(
//       {
//         ErrorCode: 0,
//         TransferCode: TransferCode ?? bet.transferCode,
//         TransactionId: TransactionId ?? bet.transactionId,
//         Status: mapStatus(bet.status),
//         // If you actually need these, uncomment and adjust:
//         // WinLoss: bet.winloss ?? 0,
//         // Stake: bet.amount,
//         ErrorMessage: "No Error",
//       },
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("[GetBetStatus] Error:", {
//       message: err?.message,
//       code: err?.code,
//       meta: err?.meta,
//       stack: err?.stack,
//     });

//     // Fall back to "bet not exists" per your original catch behavior
//     return Response.json(
//       { ErrorCode: 6, ErrorMessage: "Bet not exists" },
//       { status: 200 }
//     );
//   }
// };
