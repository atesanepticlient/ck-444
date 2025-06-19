// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { INTERNAL_SERVER_ERROR } from "@/error";
// import { db } from "@/lib/db";

// export const GET = async () => {
//   try {
//     const wallets: any = await db.depositWallet.findMany({
//       where: { isActive: true },
//     });

//     wallets.map(async (w: any) => {
//       const paymentWallet = await db.paymentWallet.findUnique({
//         where: { id: w.paymentWalletId },
//       });
//       w.paymentWallet = paymentWallet;
//       return w;
//     });

//     const bonus = await db.bonus.findFirst({ where: {} });

//     return Response.json(
//       { payload: { wallets: wallets, bonus }, success: true },
//       { status: 200 }
//     );
//   } catch {
//     return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
//   }
// };

import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const depostiWallets = await db.depositWallet.findMany({
      where: { isActive: true },
    });

    const paymentWallets = await db.paymentWallet.findMany({ where: {} });

    const wallets = depostiWallets.map((w) => {
      const paymentWallet = paymentWallets.find(
        (pw) => pw.id == w.paymentWalletId
      );
      return { ...w, paymentWallet };
    });

    console.log("wallets from server = ", wallets);

    const bonus = await db.bonus.findFirst({ where: {} });

    return Response.json(
      { payload: { wallets: wallets, bonus }, success: true },
      { status: 200 }
    );
  } catch {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
