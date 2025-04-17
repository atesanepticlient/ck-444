import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import { CreateCardInput } from "@/types/api/card";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user = await findCurrentUser();
    if (!user)
      return Response.json({ error: "Refresh the page" }, { status: 401 });

    const { walletNumber, cardType, password } =
      (await req.json()) as CreateCardInput;

    if (!walletNumber || !cardType || !password)
      Response.json(
        {
          error: "Invalid Input",
        },
        { status: 400 }
      );
    const cardContainer = await db.cardContainer.findUnique({
      where: { userId: user.id },
    });

    if (!cardContainer)
      return Response.json(
        {
          error: "Please create a new Card with Payeer name",
        },
        { status: 400 }
      );

    const isPasswordMatch = await bcrypt.compare(
      password,
      cardContainer.password
    );

    if (!isPasswordMatch)
      Response.json(
        {
          error: "Card password is incorrect",
        },
        { status: 400 }
      );

    const isCardExist = await db.card.findFirst({ where: { walletNumber } });

    if (!isCardExist)
      return Response.json(
        {
          error: "There is a Card with the Number",
        },
        { status: 400 }
      );

    const cardNumber = "";

    await db.card.create({
      data: {
        walletNumber,
        cardType,
        cardNumber,
        container: {
          connect: {
            id: cardContainer.id,
          },
        },
      },
    });


    return Response.json({})
  } catch {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
