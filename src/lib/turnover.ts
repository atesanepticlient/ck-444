import { db } from "./db";

export const reduceTurnOver = async (amount: number, userId: string) => {
  await db.wallet.update({
    where: {
      userId: userId,
    },
    data: {
      turnOver: {
        decrement: amount,
      },
    },
  });

  return true;
};
