'use client'
import { useFetchGamesListQuery, useFetchNewProviderGamesListQuery } from "@/lib/features/gamesApiSlice";
import { useGames } from "@/lib/store.zustond";
import { useEffect } from "react";

const GamesLoader = () => {
  const { data: oldProviderData, isLoading: isOldProviderLoading } = useFetchGamesListQuery();
  const { data: newProviderData, isLoading: isNewProviderLoading } = useFetchNewProviderGamesListQuery();
// console.log({newProviderData})
// console.log({oldProviderData})
  const { setLoading, setGames } = useGames((state) => state);

  useEffect(() => {
    

    if (!isNewProviderLoading && newProviderData) {
      setLoading(false);
      setGames(newProviderData.gamesList);  
      console.log('new done')
    }
    if (!isOldProviderLoading && oldProviderData) {
      setLoading(false);
      setGames(oldProviderData.gamesList);
      console.log('old done')
    }
  }, [oldProviderData, isOldProviderLoading, newProviderData, isNewProviderLoading]);

  return null;
};

export default GamesLoader;
