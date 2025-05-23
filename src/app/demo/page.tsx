"use client";
import React from "react";

const page = () => {
  const handleClick = () => {
    fetch("http://asiaapi.net/API", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hall: "941370",
        key: "ea847187a6ac1bb273648692c83df371",
        cmd: "getGamesList",
        img: "game_img_2",
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(" gamesList = ", data));
  };

  return (
    <div>
      <button onClick={() => handleClick()}>Button Click</button>
    </div>
  );
};

export default page;
