import { db } from "@/lib/db";  // Ensure db is properly set up with Prisma
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Extract the fields from the request body
    const { CompanyKey, Username, ProductType, GameType } = await req.json();

    // Validate required fields
    if (!CompanyKey || !Username || !ProductType || !GameType) {
      return new Response(
        JSON.stringify({
          ErrorCode: 1,
          ErrorMessage: "Missing required fields",
        }),
        { status: 400 }
      );
    }

    // Fetch the user from the database
    const user = await db.user.findUnique({
      where: { playerId: Username },
      include: { wallet: true },
    });

    // If the user is not found
    if (!user) {
      return new Response(
        JSON.stringify({
          ErrorCode: 2,
          ErrorMessage: "User does not exist",
        }),
        { status: 200 }
      );
    }

    // Fetch the balance from the wallet (assuming the user has a wallet linked)
    const balance = user.wallet?.balance || 0;

    // Prepare the response body
    const responseBody = {
      AccountName: user.playerId,  // Assuming playerId is the username
      Balance: balance,
      ErrorCode: 0,  // No error
      ErrorMessage: "No error",
    };

    // Return the response in the required format
    return new Response(JSON.stringify(responseBody), {
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching balance:", error);

    // In case of an internal error
    return new Response(
      JSON.stringify({
        ErrorCode: 3,
        ErrorMessage: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
