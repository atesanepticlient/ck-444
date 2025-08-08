import { paymentSystems } from "@/data/paymentWallet";
import { INTERNAL_SERVER_ERROR } from "@/error";

 
export const GET = async () => {
  try {
    const paymentSystemsPayload = paymentSystems;

    return Response.json(
      { payload: { wallets: paymentSystemsPayload }, success: true },
      { status: 200 }
    );
  } catch {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
