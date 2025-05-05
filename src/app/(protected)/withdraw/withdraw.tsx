"use client";

import React from "react";
import WithdrawCards from "./withdraw-cards";
import { useFetchCardsQuery } from "@/lib/features/cardSlice";
import { useFetchWithdrawPageDataQuery } from "@/lib/features/withdrawSlice";
import WithdrawInfo from "./withdraw-info";
import WithdrawForm from "./withdraw-form";
import { useCard } from "@/lib/store.zustond";

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
          />
          {selectedCard && (
            <WithdrawForm
              cardId={selectedCard.id}
              maxWithdraw={withdrwData.maxWithdraw}
              minWithdraw={withdrwData.minWithdraw}
            />
          )}
        </>
      )}

      {!cardsData ||
        !withdrwData ||
        cardsLoading ||
        (withdrawLoading && <span>Loading...</span>)}
    </>
  );
};

export default Withdraw;
