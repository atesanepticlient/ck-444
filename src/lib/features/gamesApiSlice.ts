import { GamesList } from "@/types/gamelist";
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
  }),
});

export const { useFetchGamesListQuery } = depositApiSlice;
