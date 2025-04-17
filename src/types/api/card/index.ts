import { CardType, Prisma } from "@prisma/client";

export interface CreateCardInput {
  walletNumber: string;
  password: string;
  cardType: CardType;
}

export interface CreateNewCardInput {
  walletNumber: string;
  password: string;
  ownerName: string;
  cardType: CardType;
}

export interface CardOutput {
  payload: {
    totalCards: string;
    cards: Prisma.CardContainerGetPayload<{ include: { cards: true } }>;
  };
}
