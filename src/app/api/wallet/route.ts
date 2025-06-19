import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";

export const GET = async () => {
  try {
    const user = await findCurrentUser();

    if (!user)
      return Response.json({ error: "Authentication Failed" }, { status: 401 });

    const wallet = await db.wallet.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!wallet)
      return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({ payload: wallet }, { status: 200 });
  } catch (error){
    console.log("Wallet error ", error)
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
