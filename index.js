// import fetch from "node-fetch"

// const url = "http://asiaapi.net/API";
// const options = {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: '{"hall":"941370","key":"ea847187a6ac1bb273648692c83df371","cmd":"getGamesList","img":"game_img_2"}',
// };

// try {
//   const response = await fetch(url, options);
//   const data = await response.json();
//   console.log(data);
// } catch (error) {
//   console.error(error);
// }

import { db } from "./src/lib/db.js";
const seedRewards = async () => {
  await db.invitationRewareds.createMany({
    data: [
      {
        prize: 30,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607129/mbuzz88/kdi4ajsyggxdjl8xvyy5.png",
        targetReferral: 3,
      },
      {
        prize: 40,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607134/mbuzz88/ittgozvoezof3cqbprik.png",
        targetReferral: 7,
      },
      {
        prize: 50,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607130/mbuzz88/dx7stvyko3gvwvrwgxwx.png",
        targetReferral: 12,
      },
      {
        prize: 100,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607131/mbuzz88/mqo9muoc3pevb6kff8jb.png",
        targetReferral: 20,
      },
      {
        prize: 300,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607130/mbuzz88/xrqqj8zdn7dtdwcsn4wd.png",
        targetReferral: 50,
      },
      {
        prize: 500,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607130/mbuzz88/tf8sa8jbruzzckjljcjg.png",
        targetReferral: 100,
      },
      {
        prize: 1000,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1746607129/mbuzz88/t8asb1uve3yfhqbuozqt.png",
        targetReferral: 200,
      },
      {
        prize: 3000,
        rewardImg:
          "https://res.cloudinary.com/dxs9u7pqc/image/upload/v1750249497/level-08.a59c1688_vvzuhh.png",
        targetReferral: 500,
      },
    ],
  });
  console.log("Created");
};

// seedRewards();

const seedSigninReward = async () => {
  await db.signinBonusRewards.createMany({
    data: [
      {
        day: "1",
        deposit: 100,
        prize: 1,
      },
      {
        day: "2",
        deposit: 200,
        prize: 2,
      },
      {
        day: "3",
        deposit: 300,
        prize: 5,
      },
      {
        day: "4",
        deposit: 400,
        prize: 7,
      },
      {
        day: "5",
        deposit: 500,
        prize: 10,
      },
      {
        day: "6",
        deposit: 600,
        prize: 12,
      },
      {
        day: "7",
        deposit: 800,
        prize: 20,
      },
      {
        day: "8",
        deposit: 900,
        prize: 25,
      },
      {
        day: "9",
        deposit: 1000,
        prize: 30,
      },
      {
        day: "10",
        deposit: 1200,
        prize: 40,
      },
      {
        day: "11",
        deposit: 1300,
        prize: 45,
      },
      {
        day: "12",
        deposit: 1400,
        prize: 50,
      },
      {
        day: "13",
        deposit: 1500,
        prize: 55,
      },
      {
        day: "14",
        deposit: 2000,
        prize: 65,
      },
      {
        day: "15",
        deposit: 2500,
        prize: 70,
      },
      {
        day: "16",
        deposit: 3000,
        prize: 80,
      },
      {
        day: "17",
        deposit: 3200,
        prize: 90,
      },
      {
        day: "18",
        deposit: 3500,
        prize: 100,
      },
      {
        day: "19",
        deposit: 3700,
        prize: 120,
      },
      {
        day: "20",
        deposit: 4000,
        prize: 150,
      },
      {
        day: "21",
        deposit: 4200,
        prize: 175,
      },
      {
        day: "22",
        deposit: 4500,
        prize: 200,
      },
      {
        day: "23",
        deposit: 4700,
        prize: 250,
      },
      {
        day: "24",
        deposit: 5000,
        prize: 300,
      },
      {
        day: "25",
        deposit: 5200,
        prize: 400,
      },
      {
        day: "26",
        deposit: 5500,
        prize: 500,
      },
      {
        day: "27",
        deposit: 5700,
        prize: 600,
      },
      {
        day: "28",
        deposit: 6000,
        prize: 700,
      },
      {
        day: "29",
        deposit: 6200,
        prize: 800,
      },
      {
        day: "30",
        deposit: 7000,
        prize: 1000,
      },
    ],
  });
  console.log("Created");
};


seedRewards();
seedSigninReward();