/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { paymentSystemsLogos } from "@/data/paymentWallet";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const paymentSystemsData = await fetch(
      `${process.env.APAY_DOMAIN}/Remotes/payment-systems-info?project_id=${process.env.APAY_PROJECT_ID}`,
      {
        headers: {
          apikey: `${process.env.APAY_API_KEY}`,
          Accept: "*/*",
        },
      }
    );

    let paymentSystemsPayload = await paymentSystemsData.json();
    if (!paymentSystemsPayload.success) {
      throw Error;
    }
    paymentSystemsPayload = paymentSystemsPayload.payment_systems.map(
      (paymentSystem: any) => {
        const logo = paymentSystemsLogos.find(
          (logo) => logo.name == paymentSystem.name
        );
        return {
          ...paymentSystem,
          image: logo?.image,
          label: logo?.label,
        };
      }
    );

    const bonus = await db.bonus.findFirst({ where: {} });

    return Response.json(
      { payload: { wallets: paymentSystemsPayload, bonus }, success: true },
      { status: 200 }
    );
  } catch {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
