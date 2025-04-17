import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface MakeDepositRequestInput {
  amount: Decimal;
  bonus: Decimal;
  walletId: string;
  bonusFor: string;
  senderNumber: string;
}
export interface MakeDepositRequestOutput {
  success: boolean;
  payload: {
    trackingNuber: string;
    paymentCallback: string;
   
  };
}

export interface GetDepositDataOutput {
  payload: {
    wallets: Prisma.DepositWalletGetPayload<object>[];
    bonus: Prisma.BonusGetPayload<object>;
  };
  success: boolean;
}
