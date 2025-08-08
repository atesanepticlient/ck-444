/* eslint-disable @typescript-eslint/no-explicit-any */
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

import { generateTrxId, getCurrentTimestamp } from "@/lib/utils";
import { makePayinTransaction } from "@/lib/payment";

// export const POST = async (req: NextRequest) => {
//   try {
//     const user: any = await findCurrentUser();
//     if (!user) {
//       return Response.json({ error: "Refresh the page" }, { status: 500 });
//     }

//     const { amount, bonus, bonusFor, senderNumber, walletId } =
//       (await req.json()) as MakeDepositRequestInput;

//     const wallet = await db.depositWallet.findUnique({
//       where: { id: walletId },
//     });

//     if (!wallet) {
//       return Response.json(
//         { error: "Unsuppoted wallet selected" },
//         { status: 400 }
//       );
//     }

//     if (+amount < +wallet.minDeposit) {
//       return Response.json(
//         { error: `Minimum Deposit amount : ${wallet.minDeposit} BDT` },
//         { status: 400 }
//       );
//     }

//     if (+amount > +wallet.maximumDeposit) {
//       return Response.json(
//         { error: `Maximum Deposit amount : ${wallet.minDeposit} BDT` },
//         { status: 400 }
//       );
//     }

//     if (bonus && bonusFor && bonusFor === "signinBonus") {
//       if (!user.wallet?.signinBonus) {
//         return Response.json(
//           {
//             error: `You are not Eligible for this Bonus : ${wallet.minDeposit} BDT`,
//           },
//           { status: 400 }
//         );
//       }
//     }

//     if (bonus && bonusFor && bonusFor === "referralBonus") {
//       if (!user.wallet?.referralBonus) {
//         return Response.json(
//           {
//             error: `You are not Eligible for this Bonus : ${wallet.minDeposit} BDT`,
//           },
//           { status: 400 }
//         );
//       }
//     }

//     const trackingNumber = await trackingNumberGenerate();

//     const currentTime = new Date();
//     const expire = new Date(currentTime.getTime() + 5.5 * 60 * 1000);

//     await db.deposit.create({
//       data: {
//         amount: Decimal(amount),
//         bonus: Decimal(amount),
//         bonusFor,
//         senderNumber,
//         user: {
//           connect: {
//             id: user.id,
//           },
//         },
//         wallet: {
//           connect: {
//             id: walletId,
//           },
//         },
//         trackingNumber,
//         expire,
//       },
//     });

//     const paymentWalletInfo = JSON.parse(
//       wallet.paymentWalletId!.toString()
//     ) as PaymentWallet;

//     const paymentCallback = `${process.env.PAYCALLBACK_URL}/${
//       paymentWalletInfo.walletName == "Bkash"
//         ? "bkash"
//         : paymentWalletInfo.walletName == "Nagad"
//         ? "nagad"
//         : ""
//     }?trackingNumber=${trackingNumber}`;

//     return Response.json(
//       { success: true, payload: { trackingNumber, paymentCallback } },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log({ error });
//     return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
//   }
// };

// export const POST = async (req: NextRequest) => {
//   try {
//     const user: any = await findCurrentUser();

//     if (!user) {
//       return Response.json({ error: "Refresh the page" }, { status: 500 });
//     }

//     const { amount, bonus, bonusFor, senderNumber, walletId, walletNumber } =
//       (await req.json()) as MakeDepositRequestInput;
//     const wallet = await db.depositWallet.findUnique({
//       where: { id: walletId },
//     });

//     if (!wallet) {
//       return Response.json(
//         { error: "Unsuppoted wallet selected" },
//         { status: 400 }
//       );
//     }

//     const paymentWallet = await db.paymentWallet.findUnique({
//       where: { id: wallet.paymentWalletId },
//     });

//     if (!paymentWallet) {
//       return Response.json(
//         { error: "Unsuppoted wallet selected" },
//         { status: 400 }
//       );
//     }

//     if (+amount < +wallet.minDeposit) {
//       return Response.json(
//         { error: `Minimum Deposit amount : ${wallet.minDeposit} BDT` },
//         { status: 400 }
//       );
//     }

//     if (+amount > +wallet.maximumDeposit) {
//       return Response.json(
//         { error: `Maximum Deposit amount : ${wallet.minDeposit} BDT` },
//         { status: 400 }
//       );
//     }

//     if (bonus && bonusFor && bonusFor === "signinBonus") {
//       if (!user.wallet?.signinBonus) {
//         return Response.json(
//           {
//             error: `You are not Eligible for this Bonus : ${wallet.minDeposit} BDT`,
//           },
//           { status: 400 }
//         );
//       }
//     }

//     if (bonus && bonusFor && bonusFor === "referralBonus") {
//       if (!user.wallet?.referralBonus) {
//         return Response.json(
//           {
//             error: `You are not Eligible for this Bonus : ${wallet.minDeposit} BDT`,
//           },
//           { status: 400 }
//         );
//       }
//     }

//     const trackingNumber = await trackingNumberGenerate();

//     const currentTime = new Date();
//     const expire = new Date(currentTime.getTime() + 5.5 * 60 * 1000);

//     await db.deposit.create({
//       data: {
//         amount: Decimal(amount),
//         bonus: Decimal(amount),
//         bonusFor,
//         senderNumber,
//         walletNumber,
//         user: {
//           connect: {
//             id: user.id,
//           },
//         },
//         wallet: {
//           connect: {
//             id: walletId,
//           },
//         },
//         trackingNumber,
//         expire,
//       },
//     });

//     const paymentCallback = `${
//       process.env.PAYCALLBACK_URL
//     }/${paymentWallet.walletName.toLowerCase()}?trackingNumber=${trackingNumber}`;

//     return Response.json(
//       { success: true, payload: { trackingNumber, paymentCallback } },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log("Create deposti ", error);
//     return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
//   }
// };

export const POST = async (req: NextRequest) => {
  try {
    const user: any = await findCurrentUser();

    const { amount, ps } = await req.json();
    const tradeNo = generateTrxId();
    const orderDate = getCurrentTimestamp();

    const businessPayload = {
      versionNo: 1,
      mchNo: process.env.MCH_NO,
      price: amount, // in BDT
      orderDate,
      tradeNo,
      payType: "01",
      channelPayType: ps,
      callbackUrl: process.env.CLIENT_URL,
      notifyUrl: `${process.env.CLIENT_URL}/api/e86256b2787ee7ff0c33d0d4c6159cd922227b79/deposit?user=${user.playerId}`,
    };

    if (!user)
      return Response.json(
        { message: "Authentication failed" },
        { status: 401 }
      );

    let response;
    try {
      response = await makePayinTransaction(businessPayload);
      console.log("Deposit API LOG : ", response);
    } catch (error: any) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    await db.aPayDeposit.create({
      data: {
        orderId: response.tradeNo,
        trxId: response.transNo,
        ps,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return Response.json({ payload: response, success: true }, { status: 200 });
  } catch {
    return Response.json({ message: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
