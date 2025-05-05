import AppHeader from "@/components/AppHeader";
import React from "react";

import aviator from "@/../public/games/aviator.png";
import boxingKing from "@/../public/games/JL-boxing-king.png";
import fortuneGems from "@/../public/games/JL-fortune-gems.png";
import moneyComing from "@/../public/games/JL-money-coming.png";
import crazyTime from "@/../public/games/crazy-time.png";
import superAce from "@/../public/games/super-ace.png";

import jl from "@/../public/games/JL.png";
import spb from "@/../public/games/SPB.png";
import evo from "@/../public/games/evo.png";
import { GameCardWithProvider } from "@/components/GameCards";

const hotGamesData = [
  {
    gameName: "Aviator",
    gameImage: aviator,
    providerImage: spb,
    redirect: "#",
  },
  {
    gameName: "Boxing King",
    gameImage: boxingKing,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Fortune Gems",
    gameImage: fortuneGems,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Money Coming",
    gameImage: moneyComing,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Crazy Time",
    gameImage: crazyTime,
    providerImage: evo,
    redirect: "#",
  },
  {
    gameName: "Super Ace",
    gameImage: superAce,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Aviator",
    gameImage: aviator,
    providerImage: spb,
    redirect: "#",
  },
  {
    gameName: "Boxing King",
    gameImage: boxingKing,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Fortune Gems",
    gameImage: fortuneGems,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Money Coming",
    gameImage: moneyComing,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Crazy Time",
    gameImage: crazyTime,
    providerImage: evo,
    redirect: "#",
  },
  {
    gameName: "Super Ace",
    gameImage: superAce,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Aviator",
    gameImage: aviator,
    providerImage: spb,
    redirect: "#",
  },
  {
    gameName: "Boxing King",
    gameImage: boxingKing,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Fortune Gems",
    gameImage: fortuneGems,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Money Coming",
    gameImage: moneyComing,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Crazy Time",
    gameImage: crazyTime,
    providerImage: evo,
    redirect: "#",
  },
  {
    gameName: "Super Ace",
    gameImage: superAce,
    providerImage: jl,
    redirect: "#",
  },
  {
    gameName: "Aviator",
    gameImage: aviator,
    providerImage: spb,
    redirect: "#",
  },
  {
    gameName: "Boxing King",
    gameImage: boxingKing,
    providerImage: jl,
    redirect: "#",
  },
];

const Page = () => {
  return (
    <div>
      <AppHeader />
      <main className="py-5 px-2 bg-[#003e3e]">
        <div className="flex items-center">
          <input
            placeholder="Search Games mb-2"
            className="text-white w-full mb-2 outline-none text-sm px-8 py-3 bg-wwwwwwck-44-4comdaintree rounded-[10.4px] overflow-hidden border border-solid border-[#006165] focus:border-[#2f9396] shadow-[0px_2.08px_0px_#002631] placeholder:font-www-wwwck444-com-semantic-input font-[number:var(--www-wwwck444-com-semantic-input-font-weight)] placeholder:text-wwwwwwck444combright-turquoise placeholder:text-[length:var(--www-wwwck444-com-semantic-input-font-size)] placeholder:tracking-[var(--www-wwwck444-com-semantic-input-letter-spacing)] placeholder:leading-[var(--www-wwwck444-com-semantic-input-line-height)] placeholder:[font-style:var(--www-wwwck444-com-semantic-input-font-style)]"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {hotGamesData.map((g, i) => (
            <GameCardWithProvider
              gameImage={g.gameImage}
              gameName={g.gameName}
              providerImage={g.providerImage}
              redirect={g.redirect}
              key={i}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Page;
