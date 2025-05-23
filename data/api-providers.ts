import evo_white from "../public/games/provider/EVO-WHITE.png";
import evo_black from "../public/games/provider/EVO-BLACK.png";

import ne_white from "../public/games/provider/NE-WHITE.png";
import ne_black from "../public/games/provider/NE-BLACK.png";

import pg_white from "../public/games/provider/PG-WHITE.png";
import pg_black from "../public/games/provider/PG-BLACK.png";

import playngo_white from "../public/games/provider/PLAYNGO-WHITE.png";
import playngo_black from "../public/games/provider/PLAYNGO-BLACK.png.png";

import rt_white from "../public/games/provider/RT-WHITE.png";
import rt_black from "../public/games/provider/RT-BLACK.png";

import mg_white from "../public/games/provider/MG-WHITE.png";
import mg_black from "../public/games/provider/MG-BLACK.png";

import jili_white from "../public/games/provider/JL.png";
import jili_black from "../public/games/provider/JL-BLACK.png";

import { Title } from "@/types/gamelist";

export const providers = [
  {
    name: Title.Jili,
    imageBlack: jili_black,
    imageWhite: jili_white,
  },
  {
    name: Title.Evolution,
    imageBlack: evo_black,
    imageWhite: evo_white,
  },

  {
    name: Title.Pgsoft,
    imageBlack: pg_black,
    imageWhite: pg_white,
  },

  {
    name: Title.NetEnt,
    imageBlack: ne_black,
    imageWhite: ne_white,
  },

  {
    name: Title.Playngo,
    imageBlack: playngo_black,
    imageWhite: playngo_white,
  },

  {
    name: Title.RedTiger,
    imageBlack: rt_black,
    imageWhite: rt_white,
  },

  {
    name: Title.Microgaming,
    imageBlack: mg_black,
    imageWhite: mg_white,
  },
];
