import axios from "axios";
import gamesData from "@/../data/games.json";

export const registerPlayer = async (username: string) => {
  const data = JSON.stringify({
    Username: username,
    Agent: process.env.NEXT_PUBLIC_568WIN_AGENT,
    UserGroup: "a",
    CompanyKey: process.env.NEXT_PUBLIC_568WIN_COMPANY_KEY,
    ServerId: process.env.NEXT_PUBLIC_568WIN_SERVER_ID,
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_568WIN_BASE_URL}/web-root/restricted/player/register-player.aspx`,
    headers: {
      Cookie:
        "__cf_bm=YdrULTDnImYyYLFjcfZ6Rs2W3Mzlh2kYFJJqGtisqVI-1756820877-1.0.1.1-T6vDjF1ulYbVslmhgxszOmL8GcN6omxFyFxmfnN4tQ3AnQQqxlL.Wndl2CzM7M8tCSxHs0sUyeXLPNWvQmhoTlY9GLhgvsC1v5qkPXAAYCk",
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    console.log(response.data.error);
    if (response.data.error.id != 0) {
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginGames = async (
  username: string,
  gpid: number,
  gameid: number
) => {
  const data = JSON.stringify({
    Username: username,
    Portfolio: "SeamlessGame",
    IsWapSports: false,
    CompanyKey: process.env.NEXT_PUBLIC_568WIN_COMPANY_KEY,
    ServerId: process.env.NEXT_PUBLIC_568WIN_COMPANY_KEY,
    GpId: gpid,
    GameId: gameid,
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_568WIN_BASE_URL}/web-root/restricted/player/v2/login.aspx`,
    headers: {
      Cookie:
        "__cf_bm=kKw13SLHylwrZcuBqK96c8Kj3wvYsYgUD4MJB4DHr2s-1756819373-1.0.1.1-uYm9XeNmlpQkmm11ux57fpcRq_bDN7L8mzZEiNfFzSkXEJGsuJM4HZgIFOqXThHfOJKaCelde1eavZmSgtmQn4nMPHyraoKB54j_at6M4zc",
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    if (response.data.error.id != 0) {
      throw new Error("Something went wrong!");
    }
    const url = response.data.url;
    return url;
  } catch (error) {
    console.log("About the error ", error);
    alert(error.message);
  }
};

export const getGames = (
  gamesId?: string[],
  provider?: string,
  search?: string,
  limit: number = 99
) => {
  let games: any[] = gamesData["seamlessGameProviderGames"];

  games = games.filter(
    (game) => Array.isArray(game.gameInfos) && game.gameInfos.length > 0
  );

  if (gamesId) {
    const gamesIdParsed = gamesId.map((fullId) => {
      const gameIdSegments = fullId.split("-");
      const gpId = gameIdSegments[0];
      const gameId = gameIdSegments[1];
      return { gpId, gameId };
    });
    games = games.filter((game) => {
      return gamesIdParsed.some(gameIdParsed=>{
        return gameIdParsed.gameId == game.gameID && gameIdParsed.gpId == game.gameProviderId
      });
    });
    console.log({games})
  }

  if (provider && provider != "all") {
    games = games.filter((game) => game.provider == provider);
  }

  if (search) {
    games = games.filter((game) =>
      game.gameInfos[0]?.gameName.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (limit) {
    games = games.slice(0, limit);
  }
  return games;
};
