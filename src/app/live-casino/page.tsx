"use client";
import AppHeader from "@/components/AppHeader";
import React from "react";

import { GameCardWithProvider } from "@/components/GameCards";
import { useGames } from "@/lib/store.zustond";
import { Categories } from "@/types/game";
import PrimaryInput from "@/components/form/input";
import GameLoader from "@/components/loader/GameLoader";
import SideNavLayout from "@/components/SideNavLayout";

const LiveCasionPage = () => {
  const { getGames } = useGames((state) => state);
  const gamesList = getGames(Categories.LiveDealers);
  return (
    <SideNavLayout>
      <div>
        <AppHeader title="Live Casino" />
        <main className="py-5 px-2 bg-[#003e3e]">
          <div className="flex items-center">
            <PrimaryInput placeholder="Search Games" className="mb-2" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
            {gamesList &&
              gamesList.map((game, i) => (
                <GameCardWithProvider game={game} key={i} />
              ))}

            <GameLoader lenght={20} loading={!!!gamesList} />
          </div>
        </main>
      </div>
    </SideNavLayout>
  );
};

export default LiveCasionPage;
