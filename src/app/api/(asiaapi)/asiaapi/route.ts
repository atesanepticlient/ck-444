/* eslint-disable @typescript-eslint/no-explicit-any */
import { INTERNAL_SERVER_ERROR } from "@/error";
import axios from "axios";

export const GET = async () => {
  try {
    const getData = (hallId: string, key: string) => {
      return JSON.stringify({
        hall: hallId,
        key: key,
        cmd: "getGamesList",
        cdnUrl: "",
        img: "game_img_5",
      });
    };

    const getConfig = (url: string, data: any) => {
      return {
        method: "post",
        maxBodyLength: Infinity,
        url: url,
        headers: {
          Cookie: "PHPSESSID=tc6on5bce3tcgpiu8c9o8mqtb9",
          "Content-Type": "application/json",
        },
        data: data,
      };
    };

    const gamesListAsia = (
      await axios.request(
        getConfig(
          process.env.HALL_HOST!,
          getData(process.env.HALL_ID!, process.env.HALL_KEY!)
        )
      )
    ).data.content;

    const gamesListTbs = (
      await axios.request(
        getConfig(
          process.env.HALL_HOST_TBS!,
          getData(process.env.HALL_ID_TBS!, process.env.HALL_KEY!)
        )
      )
    ).data.content;

    return Response.json({
      success: true,
      gamesList: { ...gamesListAsia, ...gamesListTbs },
    });
  } catch (error) {
    console.log("ERROR API ", error);
    return Response.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 });
  }
};
