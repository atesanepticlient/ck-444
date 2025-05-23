/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useFetchGamesListQuery } from "@/lib/features/gamesApiSlice";
import { useGames } from "@/lib/store.zustond";
import { useEffect } from "react";

const GamesLoader = () => {
  const { data: data, isLoading } = useFetchGamesListQuery();

  const { setLoading, setGames } = useGames((state) => state);

  useEffect(() => {
 
    if (data && !isLoading) {
      setLoading(false);
      setGames(data.gamesList);
    }
  }, [data, isLoading]);

  return null;
};

export default GamesLoader;
