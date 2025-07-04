import { paymentSystemsLogos } from "@/data/paymentWallet";
import { INTERNAL_SERVER_ERROR } from "@/error";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const GET = async () => {
  try {
    const paymentSystemsData = await fetch(
      `${process.env.APAY_DOMAIN}/Remotes/payment-systems-info?project_id=${process.env.APAY_PROJECT_ID}`,
      {
        headers: {
          apikey: `${process.env.APAY_API_KEY}`,
          Accept: "*/*",
        },
      }
    );

    let paymentSystemsPayload = await paymentSystemsData.json();
    if (!paymentSystemsPayload.success) {
      throw Error;
    }
    paymentSystemsPayload = paymentSystemsPayload.payment_systems.map(
      (paymentSystem: any) => {
        const logo = paymentSystemsLogos.find(
          (logo) => logo.name == paymentSystem.name
        );
        return {
          ...paymentSystem,
          image: logo?.image,
          label: logo?.label,
        };
      }
    );

    return Response.json(
      { payload: { wallets: paymentSystemsPayload }, success: true },
      { status: 200 }
    );
  } catch {
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
