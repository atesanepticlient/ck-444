/* eslint-disable @typescript-eslint/no-explicit-any */
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

import { generateTrxId } from "@/lib/utils";

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
    const { account_number, amount, ps } = await req.json();
    console.log({ ps });
    const user: any = await findCurrentUser();
    if (!user)
      return Response.json(
        { message: "Authentication failed" },
        { status: 401 }
      );

    const return_url = "https://www.mbuzz88.com";

    let data = {};
    switch (ps) {
      case "bkash_a":
        data = { return_url, account_number: account_number || user.phone };
        break;
      case "nagad_b":
        data = { return_url };
        break;
      case "upay":
        data = { return_url };
        break;
    }

    const trx_id = generateTrxId();

    const response = await fetch(
      `${process.env.APAY_DOMAIN}/Remotes/create-deposit?project_id=${process.env.APAY_PROJECT_ID}`,
      {
        method: "POST",
        headers: {
          apikey: `${process.env.APAY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "BDT",
          payment_system: ps,
          custom_transaction_id: trx_id,
          custom_user_id: user.playerId,
          webhook_id: process.env.APAY_WEBHOOK_ID,
          data,
        }),
      }
    );
    const paymentData = await response.json();
    console.log({ paymentData });
    if (!paymentData.success) {
      return Response.json({ message: "Deposit Failed" }, { status: 500 });
    }

    await db.aPayDeposit.create({
      data: {
        orderId: paymentData.order_id,
        trxId: trx_id,
        ps,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return Response.json(
      { payload: paymentData, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log({ error });
    return Response.json({ message: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
