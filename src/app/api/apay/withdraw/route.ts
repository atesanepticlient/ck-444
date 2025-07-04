import { NextRequest } from "next/server";
import { generateSignature } from "@/lib/utils";
import { db } from "@/lib/db";
import { createNotification } from "@/action/notifications";
export const POST = async (req: NextRequest) => {
  try {
    const { access_key, signature, transactions } = await req.json();

    if (!access_key || !signature || !transactions) {
      return Response.json({ status: "Rejected" }, { status: 500 });
    }

    const private_key = process.env.APAY_PRIVATE_KEY!;

    const newGeneratedSignature = generateSignature(
      access_key,
      private_key,
      transactions
    );

    if (signature !== newGeneratedSignature) {
      return Response.json({ status: "Rejected" }, { status: 502 });
    }

    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].status !== "Success") {
        continue;
      }
      const user = await db.user.findUnique({
        where: { playerId: transactions[i].custom_user_id },
      });

      await createNotification({
        title: `Withdraw successful`,
        description: `${transactions[i].amount} BDT Withdraw successful`,
        userId: user!.id!,
        icon: "MONEY",
      });
    }

    return Response.json({ status: "Success" }, { status: 200 });
  } catch {
    return Response.json({ status: "Failed" }, { status: 401 });
  }
};
