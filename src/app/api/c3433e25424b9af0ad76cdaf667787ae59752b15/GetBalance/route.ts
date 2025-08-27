import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { Username } = await req.json();

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

    return Response.json({
      AccountName: user.playerId,
      Balance: user.wallet!.balance.toFixed(2),
      ErrorCode: 0,
      ErrorMessage: "No Error",
    });
  } catch  {
    return Response.json(
      { ErrorCode: 7, ErrorMessage: "Internal Error" },
      { status: 200 }
    );
  }
};



// written by client
// import { db } from "@/lib/db"; 
// import { NextRequest } from "next/server";

// export const POST = async (req: NextRequest) => {
//   try {
//     const { Username, CompanyKey, ProductType, GameType, Gpid } = await req.json();

//     // Step 1: Verify if the company key is valid
//     if (CompanyKey !== "F4D8A3106EA44C5D969D0AAE0B472762") {
//       return Response.json(
//         { ErrorCode: 4, ErrorMessage: "Invalid CompanyKey", Balance: 0.0 },
//         { status: 200 }
//       );
//     }

//     // Step 2: Check if the user exists in the database and fetch wallet details
//     const user = await db.user.findUnique({
//       where: { phone: Username },
//       include: { wallet: true },
//     });

//     if (!user || !user.wallet) {
//       // If user does not exist or wallet is missing, return error with balance as 0
//       return Response.json(
//         { ErrorCode: 1, ErrorMessage: "Member not exist", Balance: 0.0 },
//         { status: 200 }
//       );
//     }

//     // Step 3: Ensure balance is not null or invalid
//     const balance = user.wallet.balance ?? 0.0;

//     // Step 4: Handle invalid balance (in case the balance is NaN)
//     if (isNaN(Number(balance))) {
//       return Response.json(
//         { ErrorCode: 2, ErrorMessage: "Invalid balance value", Balance: 0.0 },
//         { status: 200 }
//       );
//     }

//     // Step 5: Return successful response with account details and the balance
//     return Response.json({
//       AccountName: user.phone || Username, // Fallback to Username if no name is provided
//       Balance: balance.toFixed(2), // Ensure 2 decimal places for consistency
//       ErrorCode: 0,
//       ErrorMessage: "No Error",
//     });

//   } catch (error) {
//     // Step 6: Handle internal errors (database or API issues)
//     console.error("Internal Error:", error);
//     return Response.json(
//       { ErrorCode: 7, ErrorMessage: "Internal Error", Balance: 0.0 },
//       { status: 200 }
//     );
//   }
// };
