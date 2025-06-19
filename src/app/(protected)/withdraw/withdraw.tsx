"use client";

import React from "react";
import WithdrawCards from "./withdraw-cards";
import { useFetchCardsQuery } from "@/lib/features/cardSlice";
import { useFetchWithdrawPageDataQuery } from "@/lib/features/withdrawSlice";
import WithdrawInfo from "./withdraw-info";
import WithdrawForm from "./withdraw-form";
import { useCard } from "@/lib/store.zustond";
import EmpryCard from "@/components/EmpryCard";

const Withdraw = () => {
  const { data: cardsData, isLoading: cardsLoading } = useFetchCardsQuery({
    all: false,
  });
  const cards = cardsData?.cards;

  const { data: withdrwData, isLoading: withdrawLoading } =
    useFetchWithdrawPageDataQuery();

  const selectedCard = useCard((state) => state.card);
  return (
    <>
      {cards && withdrwData && !cardsLoading && !withdrawLoading && (
        <>
          <WithdrawCards cards={cards} />
          <WithdrawInfo
            availableBalance={withdrwData.availableBalance}
            mainBalance={withdrwData.mainBalance}
            remainingWithdrawal={withdrwData.remainingWithdrawal}
            turnOver={withdrwData.turnOver}
          />
          {selectedCard && withdrwData.availableBalance > 0 && (
            <WithdrawForm
              cardId={selectedCard.id}
              maxWithdraw={withdrwData.maxWithdraw}
              minWithdraw={withdrwData.minWithdraw}
            />
          )}
        </>
      )}
      {cards && cards.length == 0 && <EmpryCard plusRedirect="/card" />}
      {(!cardsData || !withdrwData || cardsLoading || withdrawLoading) && (
        <div className="w-full h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </>
  );
};

export default Withdraw;
