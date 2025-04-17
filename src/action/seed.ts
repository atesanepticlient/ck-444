"use server";

import { db } from "@/lib/db";

export const seed = async () => {
  try {
    await db.depositWallet.createMany({
      data: [
        {
          walletName: "Bkash",
          walletNumber: "01735156550",
          instructions: "Only cashout",
          minDeposit: 500,
          maximumDeposit: 1000,
          trxType: "Send Money",
          walletLogo:
            "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1744652095/site/krsjjzw2u66kx16ong92.png",
        },
        {
          walletName: "Nagad",
          walletNumber: "01735156550",
          instructions: "Only cashout",
          minDeposit: 500,
          maximumDeposit: 1000,
          trxType: "Cashout",
          walletLogo:
            "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1744652096/site/ep2qtamubtfzhjhankpe.png",
        },
      ],
    });

    await db.bonus.create({
      data: { referralBonus: 5, signinBonus: 5 },
    });
    return "Done";
  } catch (error) {
    return error.message;
  }
};
