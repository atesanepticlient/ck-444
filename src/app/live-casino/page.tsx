"use client";
import AppHeader from "@/components/AppHeader";
import React from "react";

import { GameCardWithProvider } from "@/components/GameCards";
import { useGames } from "@/lib/store.zustond";
import { Categories } from "@/types/gamelist";
import PrimaryInput from "@/components/form/input";
import GameLoader from "@/components/loader/GameLoader";

const LiveCasionPage = () => {
  const { getGames } = useGames((state) => state);
  const gamesList = getGames(Categories.LiveDealers);
  return (
    <div>
      <AppHeader title="Live Casino" />
      <main className="py-5 px-2 bg-[#003e3e]">
        <div className="flex items-center">
          <PrimaryInput placeholder="Search Games" className="mb-2" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {gamesList &&
            gamesList.map((game, i) => (
              <GameCardWithProvider game={game} key={i} />
            ))}

          <GameLoader lenght={20} loading={!!!gamesList} />
        </div>
      </main>
    </div>
  );
};

export default LiveCasionPage;
