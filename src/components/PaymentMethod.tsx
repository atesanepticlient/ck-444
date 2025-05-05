"use client";
import { ExtendedWallet } from "@/types/api/deposit";
import Image from "next/image";
import React from "react";

interface PaymentMethodsPros {
  method: ExtendedWallet;
  selectedPaymentMethod: ExtendedWallet;
  onClick: () => void;
}

const PaymentMethod = ({
  method,
  selectedPaymentMethod,
  onClick,
}: PaymentMethodsPros) => {
  return (
    <button
      className={`flex-shrink-0 mx-1 cursor-pointer whitespace-nowrap`}
      onClick={() => onClick()}
    >
      <div
        className={`w-24 h-24 rounded-lg border-2 flex flex-col items-center justify-center p-3 transition-all ${
          selectedPaymentMethod?.id === method.id
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <Image
          src={method.paymentWallet.walletLogo}
          width={40}
          height={30}
          unoptimized
          alt={method.paymentWallet.walletName}
          className="w-[40px] h-auto"
        />
        <span
          className={`mt-2 text-sm font-medium ${
            selectedPaymentMethod?.id === method.id
              ? "text-blue-600"
              : "text-gray-700"
          }`}
        >
          {method.paymentWallet.walletName}
        </span>
      </div>
    </button>
  );
};

export default PaymentMethod;
