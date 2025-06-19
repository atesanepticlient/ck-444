import { db } from "./db";

export const reduceTurnOver = async (amount: number, userId: string) => {
  await db.wallet.update({
    where: {
      id: userId,
    },
    data: {
      turnOver: {
        decrement: amount,
      },
    },
  });

  return true;
};
