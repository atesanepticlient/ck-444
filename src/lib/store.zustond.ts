import { ExtendedCard } from "@/types/api/card";
import { create } from "zustand";

interface WithdrawCardType {
  card: ExtendedCard | null;
  setCard: (card: ExtendedCard) => void;
}

export const useCard = create<WithdrawCardType>((set) => ({
  card: null,
  setCard: (card) => set((state) => ({ ...state, card })),
}));
