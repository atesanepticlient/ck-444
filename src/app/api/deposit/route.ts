import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { trackingNumberGenerate } from "@/lib/helpers";
import { MakeDepositRequestInput } from "@/types/api/deposit";
import { NextRequest } from "next/server";

import { Decimal } from "@prisma/client/runtime/library";
import { PaymentWallet } from "@/data/paymentWallet";

export const POST = async (req: NextRequest) => {
  try {
    const user = await findCurrentUser();

    if (!user) {
      return Response.json({ error: "Refresh the page" }, { status: 500 });
    }

    const { amount, bonus, bonusFor, senderNumber, walletId } =
      (await req.json()) as MakeDepositRequestInput;
    console.log({ senderNumber });
    const wallet = await db.depositWallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      return Response.json(
        { error: "Unsuppoted wallet selected" },
        { status: 400 }
      );
    }

    if (+amount < +wallet.minDeposit) {
      return Response.json(
        { error: `Minimum Deposit amount : ${wallet.minDeposit} BDT` },
        { status: 400 }
      );
    }

    if (+amount > +wallet.maximumDeposit) {
      return Response.json(
        { error: `Maximum Deposit amount : ${wallet.minDeposit} BDT` },
        { status: 400 }
      );
    }

    if (bonus && bonusFor && bonusFor === "signinBonus") {
      if (!user.wallet?.signinBonus) {
        return Response.json(
          {
            error: `You are not Eligible for this Bonus : ${wallet.minDeposit} BDT`,
          },
          { status: 400 }
        );
      }
    }

    if (bonus && bonusFor && bonusFor === "referralBonus") {
      if (!user.wallet?.referralBonus) {
        return Response.json(
          {
            error: `You are not Eligible for this Bonus : ${wallet.minDeposit} BDT`,
          },
          { status: 400 }
        );
      }
    }

    const trackingNumber = await trackingNumberGenerate();

    const currentTime = new Date();
    const expire = new Date(currentTime.getTime() + 5.5 * 60 * 1000);

    await db.deposit.create({
      data: {
        amount: Decimal(amount),
        bonus: Decimal(amount),
        bonusFor,
        senderNumber,
        user: {
          connect: {
            id: user.id,
          },
        },
        wallet: {
          connect: {
            id: walletId,
          },
        },
        trackingNumber,
        expire,
      },
    });

    const paymentWalletInfo = JSON.parse(
      wallet.paymentWalletId!.toString()
    ) as PaymentWallet;

    const paymentCallback = `${process.env.PAYCALLBACK_URL}/${
      paymentWalletInfo.walletName == "Bkash"
        ? "bkash"
        : paymentWalletInfo.walletName == "Nagad"
        ? "nagad"
        : ""
    }?trackingNumber=${trackingNumber}`;

    return Response.json(
      { success: true, payload: { trackingNumber, paymentCallback } },
      { status: 201 }
    );
  } catch {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
