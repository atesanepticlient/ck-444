export interface GamesList {
  evolution: NetEnt[];
  microgaming: NetEnt[];
  NetEnt: NetEnt[];
  pgsoft: NetEnt[];
  playngo: NetEnt[];
  red_tiger: NetEnt[];
  sport_betting: NetEnt[];
}

export interface NetEnt {
  id: string;
  name: string;
  img: string;
  device: string;
  title: Title;
  categories: Categories;
  bm: string;
  demo: string;
  rewriterule: string;
  exitButton: string;
}

export enum Categories {
  FastGames = "fast_games",
  LiveDealers = "live_dealers",
  Slots = "slots",
  Sport = "sport",
  Arcade = "arcade",
  Card = "card",
  Lottery = "lottery",
  Roulette = "roulette",
  VideoPoker = "video_poker",
}

export enum Title {
  Evolution = "evolution",
  FastGames = "fast_games",
  Jili = "jili",
  Microgaming = "microgaming",
  NetEnt = "NetEnt",
  Pgsoft = "pgsoft",
  Playngo = "playngo",
  RedTiger = "red_tiger",
  SportBetting = "sport_betting",
  Ainsworth = "ainsworth",
  Amatic = "amatic",
  AmigoGaming = "amigo_gaming",
  Apex = "apex",
  Apollo = "apollo",
  Aristocrat = "aristocrat",
  Bingo = "bingo",
  Booming = "booming",
  Egaming = "egaming",
  Egt = "egt",
  Firekirin = "firekirin",
  Fish = "fish",
  Goldenrace = "goldenrace",
  Habanero = "habanero",
  Igrosoft = "igrosoft",
  Igt = "igt",
  Kajot = "kajot",
  Keno = "keno",
  Mancala = "mancala",
  Merkur = "merkur",
  Novomatic = "novomatic",
  Pragmatic = "pragmatic",
  Quickspin = "quickspin",
  Roulette = "roulette",
  Rubyplay = "rubyplay",
  ScientificGames = "scientific_games",
  TableGames = "table_games",
  Vegas = "vegas",
  Wazdan = "wazdan",
  Zitro = "zitro",
}

export type GameContent = {
  content: {
    game: {
      url: string;
      iframe: "1" | "0";
      sessionId: string;
      width: string;
      vertical: "1" | "0";
      withoutFrame: "1" | "0";
      rewriterule: "1" | "0";
      localhost: "1" | "0";
      exitButton_mobile: "1" | "0";
      exitButton: "1" | "0";
      disableReload: "1" | "0";
      wager: "1" | "0";
      bonus: "1" | "0";
    };
    gameRes: {
      sessionId: string;
    };
  };
};
