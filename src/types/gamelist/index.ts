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
}
