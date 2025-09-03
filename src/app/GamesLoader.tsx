"use client";
import {
  useFetch568WinGamesQuery,
  useFetchGamesListQuery,
  useFetchNewProviderGamesListQuery,
} from "@/lib/features/gamesApiSlice";
import { useGames } from "@/lib/store.zustond";
import { useEffect } from "react";

const GamesLoader = () => {
  // const { data: oldProviderData, isLoading: isOldProviderLoading } = useFetchGamesListQuery();
  // const { data: newProviderData, isLoading: isNewProviderLoading } = useFetchNewProviderGamesListQuery();

  const { data: gamesData, isLoading } = useFetch568WinGamesQuery({});
  console.log("games data : ", gamesData);
  const { setLoading, setGames } = useGames((state) => state);

  useEffect(() => {
    // if (!isNewProviderLoading && newProviderData) {
    //   setLoading(false);
    //   setGames(newProviderData.gamesList);
    //   console.log('new done')
    // }

    // if (!isOldProviderLoading && oldProviderData) {
    //   setLoading(false);
    //   setGames(oldProviderData.gamesList);
    //   console.log('old done')
    // }

    if (!isLoading && gamesData) {
      setLoading(false);
      setGames(gamesData.gamesList);
    }
  }, [gamesData, isLoading]);

  return null;
};

export default GamesLoader;
