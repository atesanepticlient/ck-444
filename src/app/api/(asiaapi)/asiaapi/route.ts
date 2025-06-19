import { INTERNAL_SERVER_ERROR } from "@/error";
import axios from "axios";

export const GET = async () => {
  try {
    const data = JSON.stringify({
      hall: "941370",
      key: "ea847187a6ac1bb273648692c83df371",
      cmd: "getGamesList",
      cdnUrl: "",
      img: "game_img_5",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://asiaapi.net/API/",
      headers: {
        Cookie: "PHPSESSID=tc6on5bce3tcgpiu8c9o8mqtb9",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const gamesList = await axios.request(config);
    return Response.json({ success: true, gamesList: gamesList.data.content });
  } catch (error) {
    console.log("ERROR API ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
