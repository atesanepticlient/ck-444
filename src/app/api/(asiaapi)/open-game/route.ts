/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { findCurrentUser } from "@/data/user";
import { INTERNAL_SERVER_ERROR } from "@/error";
import axios from "axios";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user : any = await findCurrentUser();

    if (!user)
      return Response.json({ error: "Refresh the page" }, { status: 401 });

    const { gameId, demo } = await req.json();

    if (!gameId) {
      return Response.json({ error: "Game Id is required" }, { status: 400 });
    }

    const data = JSON.stringify({
      hall: process.env.HALL_ID,
      key: process.env.HALL_KEY,
      login: user.playerId,
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
      url: "http://asiaapi.net/API/openGame/",
      headers: {
        Cookie: "PHPSESSID=tc6on5bce3tcgpiu8c9o8mqtb9",
        "Content-Type": "application/json",
      },
      data: data,
    };
    const response = await axios.request(config);

    if (response.data.status == "fail") {
      return Response.json({ error: "Try Again" }, { status: 500 });
    }

    const content = response.data.content;
    console.log("Content from route ", content);
    return Response.json({ content: content }, { status: 200 });
  } catch (error) {
    console.log("OPEN GAME ERROR ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
