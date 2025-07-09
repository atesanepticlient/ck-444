/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExtendedCard } from "@/types/api/card";
import { Categories, GamesList, NetEnt } from "@/types/game";
import { create } from "zustand";

interface WithdrawCardType {
  card: ExtendedCard | null;
  setCard: (card: ExtendedCard) => void;
}

export const useCard = create<WithdrawCardType>((set) => ({
  card: null,
  setCard: (card) => set((state) => ({ ...state, card })),
}));

interface GameType {
  games: GamesList | null;
  isLoading: boolean;
  error: string;

  getGames: (
    category: string,
    name?: string,
    limit?: number,
    provider?: any
  ) => NetEnt[] | null;

  getCustomeCategoriesGames: (
    category: string,
    search?: string
  ) => NetEnt[] | null;

  getFavoriesGames: (gamesId: string[]) => NetEnt[] | null;

  setGames: (gamge: GamesList) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
}
export const useGames = create<GameType>((set, get) => ({
  games: null,
  isLoading: true,
  error: "",

  getGames: (category, name, limit, provider) => {
    const games = get().games!;
    if (!games) return null;
    const allGamesArrays = Object.values(games).flat();

    let flitedGames = allGamesArrays.filter((game) => {
      if (category === Categories.Slots) {
        return (
          game.categories === category ||
          game.categories == Categories.FastGames
        );
      } else {
        return game.categories === category;
      }
    });

    if (provider && provider !== "all") {
      flitedGames = allGamesArrays!.filter((game) => game.title === provider);
    }

    if (name) {
      const searchLower = name.toLowerCase();
      flitedGames = flitedGames.filter((game) =>
        game.name.toLowerCase().includes(searchLower)
      );
    }

    if (limit !== undefined && limit > 0) {
      return flitedGames.slice(0, limit);
    }

    return flitedGames;
  },
  getCustomeCategoriesGames: (category, search) => {
    const games = get().games!;
    if (!games) return null;

    const allGamesArrays = Object.values(games).flat();
    let flitedGames: any;
    if (category == "hot") {
      const gamesId = [
        "8892",
        "8891",
        "8890",
        "15808",
        "15814",
        "15815",
        "15813",
        "15810",
        "15809",
        "15065",
        "15056",
        "15812",
        "7053",
        "10269",
        "9896",
      ];
      flitedGames = allGamesArrays.filter((game) => gamesId.includes(game.id));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      flitedGames = flitedGames.filter((game: any) =>
        game.name.toLowerCase().includes(searchLower)
      );
    }
    return flitedGames;
  },
  getFavoriesGames: (gamesId) => {
    const games = get().games!;
    if (!games) return null;
    const allGamesArrays = Object.values(games).flat();

    const flitedGames = allGamesArrays.filter((game) =>
      gamesId.includes(game.id)
    );

    return flitedGames;
  },
  setGames: (games) => set((state) => ({ ...state, games })),
  setLoading: (isLoading) => set((state) => ({ ...state, isLoading })),
  setError: (error) => set((state) => ({ ...state, error })),
}));
