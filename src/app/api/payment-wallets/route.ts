import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const paymentWallets = await db.paymentWallet.findMany({ where: {} });

    const allowedPaymentWallets = paymentWallets.filter(async (wallet) => {
      const depositWallets = await db.depositWallet.findMany({
        where: { paymentWalletId: wallet.id },
      });

      if (depositWallets && depositWallets.length > 0) return true;
      return false;
    });

    return Response.json(
      { paymentWallets: allowedPaymentWallets },
      { status: 200 }
    );
  } catch {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
