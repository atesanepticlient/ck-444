import { GameContent, GamesList } from "@/types/game";
import { apiSlice } from "./apiSlice";

const depositApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchGamesList: builder.query<
      { success: boolean; gamesList: GamesList },
      void
    >({
      query: () => ({
        url: "api/asiaapi",
        method: "GET",
      }),
    }),

    openGame: builder.mutation<GameContent, { gameId: string; demo: string }>({
      query: (body) => ({
        url: `api/open-game`,
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const { useFetchGamesListQuery, useOpenGameMutation } = depositApiSlice;
