import React from "react";

import reward_1 from "@/../public/icons/rewards/reward-unclamed-1.png";
import reward_2 from "@/../public/icons/rewards/reward-unclamed-2.png";
import reward_3 from "@/../public/icons/rewards/reward-unclamed-3.png";
import reward_4 from "@/../public/icons/rewards/reward-unclamed-4.png";
import reward_5 from "@/../public/icons/rewards/reward-unclamed-5.png";
import reward_6 from "@/../public/icons/rewards/reward-unclamed-6.png";
import Image from "next/image";

import { BiCoinStack } from "react-icons/bi";

const Rewards = () => {
  const rewards = [
    {
      stiker: reward_1,
      label: "Over 3 valid referral in total.",
      points: "30.00",
      totalTarget: 3,
      complete: 0,
    },
    {
      stiker: reward_2,
      label: "Over 7 valid referral in total.",
      points: "40.00",
      totalTarget: 7,
      complete: 0,
    },
    {
      stiker: reward_3,
      label: "Over 12 valid referral in total.",
      points: "50.00",
      totalTarget: 12,
      complete: 0,
    },
    {
      stiker: reward_4,
      label: "Over 20 valid referral in total.",
      points: "100.00",
      totalTarget: 20,
      complete: 0,
    },
    {
      stiker: reward_5,
      label: "Over 50 valid referral in total.",
      points: "300.00",
      totalTarget: 50,
      complete: 0,
    },
    {
      stiker: reward_6,
      label: "Over 100 valid referral in total.",
      points: "500.00",
      totalTarget: 100,
      complete: 0,
    },
  ];

  return (
    <div>
      <div className="space-y-3">
        {rewards.map((reward, i) => (
          <div
            key={i}
            className="bg-[linear-gradient(180deg,_rgba(243,247,251,0.4)_0%,_rgba(224,233,241,0.4))] rounded-md p-2 flex items-center gap-3 shadow-sm"
          >
            <div className="w-[15%] ">
              <Image
                src={reward.stiker}
                alt={reward.label}
                className="w-[40px] mx-auto"
              />
            </div>

            <div className="w-[85%] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#9B9EA0]">
                  {reward.label}
                </h4>
                <div className="flex items-center gap-1 font-bold text-[#9B9EA0]">
                  <BiCoinStack className="w-3 h-3 " />
                  {reward.points}
                </div>
              </div>

              <div>
                <h3 className="bg-[linear-gradient(113deg,_#43cbff,_#9708cc)]  text-transparent bg-clip-text text-lg font-bold">
                  {reward.complete}/{" "}
                  <span className="text-[8px] font-bold text-black/50">
                    {reward.totalTarget}
                  </span>{" "}
                </h3>

                <button className="bg-[linear-gradient(113deg,_#43cbff,_#9708cc)] text-white text-xs font-medium px-2 py-1 rounded-md cursor-pointer">
                  Available
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;
