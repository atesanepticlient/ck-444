/* eslint-disable @typescript-eslint/no-explicit-any */
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { makePayoutTransaction } from "@/lib/payment";
import {getCurrentTimestamp } from "@/lib/utils";
import bcrypt from "bcryptjs";

import { NextRequest } from "next/server";

// export const POST = async (req: NextRequest) => {
//   try {
//     const user: any = await findCurrentUser();
//     const { amount, password, cardId } =
//       (await req.json()) as MakeWithdrawInput;

//     if (!amount || !password || !cardId)
//       return Response.json({ error: "Invalid Input Type" }, { status: 400 });

//     const site = await db.siteSetting.findFirst({
//       where: {},
//       select: { maxWithdraw: true, minWithdraw: true },
//     });

//     const minWithdraw = Number(site?.minWithdraw) || 0;
//     const maxWithdraw = Number(site?.maxWithdraw) || 0;

//     if (amount < minWithdraw) {
//       return Response.json(
//         { error: `Minimum withdraw ${minWithdraw}` },
//         { status: 400 }
//       );
//     }

//     if (amount > maxWithdraw) {
//       return Response.json(
//         { error: `Maximum withdraw ${maxWithdraw}` },
//         { status: 400 }
//       );
//     }
//     const wallet = await db.wallet.findFirst({ where: { userId: user!.id } });
//     const availableBalance = +wallet!.balance - +wallet!.turnOver;

//     if (amount > +availableBalance) {
//       return Response.json({ error: "Insufficient balance" }, { status: 404 });
//     }

//     const cardContainer = await db.cardContainer.findFirst({
//       where: { userId: user!.id },
//     });

//     if (!cardContainer)
//       return Response.json({ error: "Please create a card first" });

//     const card = await db.card.findFirst({
//       where: { id: cardId },
//     });

//     if (!card) {
//       return Response.json({ error: "Try with another card" }, { status: 400 });
//     }

//     const passwordMatched = await bcrypt.compare(
//       password,
//       cardContainer.password
//     );

//     if (!passwordMatched)
//       return Response.json(
//         { error: "Incorrect transction password" },
//         { status: 400 }
//       );

//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const totalWithdrawOfLast24h = await db.withdraw.count({
//       where: {
//         createdAt: {
//           gte: twentyFourHoursAgo,
//         },
//       },
//     });

//     if (totalWithdrawOfLast24h > 10) {
//       return Response.json(
//         { error: "You've reached your daily limit of withdraw" },
//         { status: 400 }
//       );
//     }

//     if (user!.isBanned) {
//       return Response.json({
//         error: "You can't make a withdraw at the moment",
//       });
//     }

//     await db.wallet.update({
//       where: { userId: user!.id },
//       data: { balance: { decrement: amount } },
//     });

//     const withdraw = await db.withdraw.create({
//       data: {
//         amount,
//         expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
//         card: {
//           connect: {
//             id: cardId,
//           },
//         },
//         user: {
//           connect: {
//             id: user!.id,
//           },
//         },
//       },

//       include: { card: true },
//     });

//     return Response.json({ withdraw }, { status: 201 });
//   } catch (error) {
//     console.log("WITHDRAW POST ERROR = ", error);
//     return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
//   }
// };

export const POST = async (req: NextRequest) => {
  try {
    const { account_number, amount, ps, password } = await req.json();
    const user: any = await findCurrentUser();
    if (!user)
      return Response.json(
        { message: "Authentication failed" },
        { status: 401 }
      );

    if (!user.withdrawPassword) {
      return Response.json(
        { message: "Please Set a Withdraw password" },
        { status: 400 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.withdrawPassword
    );

    if (!isPasswordMatch) {
      return Response.json(
        { message: "Invalid withdraw password" },
        { status: 401 }
      );
    }

    const orderDate = getCurrentTimestamp();
    const businessPayload = {
      versionNo: 1,
      mchNo: process.env.MCH_NO,
      price: 200, // BDT
      orderDate,
      tradeNo: "PO" + Date.now(),
      notifyUrl: `${process.env.CLIENT_URL}/api/e86256b2787ee7ff0c33d0d4c6159cd922227b79/deposit?user=${user.playerId}`,
      mode: "S1", // S1 = Settlement, S0 = Realtime
      accBankCode: ps, // Bank or wallet code
      accName: user.name || user.playerId, // Receiver name
      accCardNo: account_number, // Receiver wallet no.
      purpose: "Real Payouts",
    };

    const response = await makePayoutTransaction(businessPayload);

    await db.aPayWithdraw.create({
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
    await db.wallet.update({
      where: {
        userId: user!.id,
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    return Response.json({ payload: response, success: true }, { status: 200 });
  } catch (error) {
    console.log({ error });
    return Response.json({ message: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
