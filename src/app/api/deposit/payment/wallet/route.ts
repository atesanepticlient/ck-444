import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const wallets = await db.depositWallet.findMany({
      where: { isActive: true },
    });

    const bonus = await db.bonus.findFirst({ where: {} });
    
    return Response.json(
      { payload: { wallets, bonus }, success: true },
      { status: 200 }
    );
  } catch {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
