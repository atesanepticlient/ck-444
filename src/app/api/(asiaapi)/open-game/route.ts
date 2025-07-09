/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import { db } from "@/lib/db";
import axios from "axios";
import { NextRequest } from "next/server";

const openGame = async (playerId: string, gameId: string) => {
  const hallData = [
    {
      hallId: process.env.HALL_ID,
      host: process.env.HALL_HOST,
    },
    {
      hallId: process.env.HALL_ID_TBS,
      host: process.env.HALL_HOST_TBS,
    },
  ];

  let content;
  for (let i = 0; i < hallData.length; i++) {
    const data = JSON.stringify({
      hall: hallData[i].hallId,
      key: process.env.HALL_KEY,
      login: playerId,
      gameId: gameId,
      cmd: "openGame",
      demo: "0",
      domain: "https://www.mbuzz88.com/",
      cdnUrl: "",
      exitUrl: "https://www.mbuzz88.com/",
      language: "en",
    });
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${hallData[i].host}/openGame/`,
      headers: {
        Cookie: "PHPSESSID=tc6on5bce3tcgpiu8c9o8mqtb9",
        "Content-Type": "application/json",
      },
      data: data,
    };
    const response = await axios.request(config);
    console.log("response data ", response.data);
    if (response.data.status == "success") {
      content = response.data.content;
      break;
    }
  }

  if (!content) {
    throw new Error("Try Again");
  }

  return content;
};

export const POST = async (req: NextRequest) => {
  try {
    const user: any = await findCurrentUser();

    if (!user)
      return Response.json({ error: "Refresh the page" }, { status: 401 });

    const playerId = user.playerId;

    const { gameId, demo } = await req.json();

    if (!gameId) {
      return Response.json({ error: "Game Id is required" }, { status: 400 });
    }

    try {
      const content = await openGame(playerId, gameId);
      return Response.json({ content: content }, { status: 200 });
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    console.log("OPEN GAME ERROR ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
