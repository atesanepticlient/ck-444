import { GameContent, GamesList } from "@/types/game";
import { apiSlice } from "./apiSlice";

const depositApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Existing endpoint for old provider
    fetchGamesList: builder.query<
      { success: boolean; gamesList: GamesList },
      void
    >({
      query: () => ({
        url: "api/asiaapi",
        method: "GET",
      }),
    }),

    // New endpoint for new provider
    fetchNewProviderGamesList: builder.query<
      { success: boolean; gamesList: GamesList },
      void
    >({
      query: () => ({
        url: "api/newprovider",
        method: "GET",
      }),
    }),

    // Existing mutation for opening a game
    openGame: builder.mutation<GameContent, { gameId: string; demo: string }>({
      query: (body) => ({
        url: `api/open-game`,
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const {
  useFetchGamesListQuery,
  useOpenGameMutation,
  useFetchNewProviderGamesListQuery,  // Export the new query hook
} = depositApiSlice;
