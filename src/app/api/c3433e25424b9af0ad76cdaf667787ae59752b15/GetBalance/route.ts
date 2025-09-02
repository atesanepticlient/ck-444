import { db } from "@/lib/db";
import { NextRequest } from "next/server";

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
    // Lookup user and wallet
    const user = await db.user.findUnique({ where: { phone: username }, include: { wallet: true } });
    if (!user?.wallet) {
      return Response.json({ ErrorCode: 1, ErrorMessage: "Member not exist", Balance: 0 }, { status: 200 });
    }
    const bal = Number(user.wallet.balance).toFixed(2);
    return Response.json({ ErrorCode: 0, ErrorMessage: "No Error", AccountName: username, Balance: bal }, { status: 200 });
  } catch (err) {
    console.error("GetBalance error:", err);
    return Response.json({ ErrorCode: 7, ErrorMessage: "Internal Error", Balance: 0 }, { status: 200 });
  }
};
