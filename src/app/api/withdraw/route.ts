import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { MakeWithdrawInput } from "@/types/api/withdraw";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user = await findCurrentUser();
    const { amount, password, cardId } =
      (await req.json()) as MakeWithdrawInput;

    if (!amount || !password || !cardId)
      return Response.json({ error: "Invalid Input Type" }, { status: 400 });

    const minWithdraw = 10000;
    const maxWithdraw = 25000;

    if (amount < minWithdraw) {
      return Response.json(
        { error: `Minimum withdraw ${minWithdraw}` },
        { status: 400 }
      );
    }

    if (amount > maxWithdraw) {
      return Response.json(
        { error: `Maximum withdraw ${maxWithdraw}` },
        { status: 400 }
      );
    }

    const availableBalance =
      (
        await db.wallet.findFirst({
          where: { userId: user!.id },
        })
      )?.balance || 0;

    if (amount > +availableBalance) {
      return Response.json({ error: "Insufficient balance" }, { status: 404 });
    }

    const cardContainer = await db.cardContainer.findFirst({
      where: { userId: user!.id },
    });

    if (!cardContainer)
      return Response.json({ error: "Please create a card first" });

    const card = await db.card.findFirst({
      where: { id: cardId },
    });

    if (!card) {
      return Response.json({ error: "Try with another card" }, { status: 400 });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      cardContainer.password
    );

    if (!passwordMatched)
      return Response.json(
        { error: "Incorrect transction password" },
        { status: 400 }
      );

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const totalWithdrawOfLast24h = await db.withdraw.count({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    if (totalWithdrawOfLast24h > 10) {
      return Response.json(
        { error: "You've reached your daily limit of withdraw" },
        { status: 400 }
      );
    }

    if (user!.isBanned) {
      return Response.json({
        error: "You can't make a withdraw at the moment",
      });
    }

    await db.wallet.update({
      where: { userId: user!.id },
      data: { balance: { decrement: amount } },
    });

    const withdraw = await db.withdraw.create({
      data: {
        amount,
        expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
        card: {
          connect: {
            id: cardId,
          },
        },
        user: {
          connect: {
            id: user!.id,
          },
        },
      },

      include: { card: true },
    });

    return Response.json({ withdraw }, { status: 201 });
  } catch (error) {
    console.log("WITHDRAW POST ERROR = ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
