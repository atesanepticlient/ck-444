import React from "react";

import money from "@/../public/icons/rewards/money.png";
import beg from "@/../public/icons/rewards/bag.png";
import bg_effect from "@/../public/icons/rewards/bg-effect.png";
import Image from "next/image";

const BonusCards = () => {
  return (
    <div className="bg-white p-4 mt-5  grid grid-cols-3 gap-3">
      <BonusCard bonus={1} day={1} />
      <BonusCard bonus={2} day={2} />
    </div>
  );
};

export default BonusCards;

interface BonusCardProps {
  day: number;
  bonus: number;
}
const BonusCard = ({ bonus, day }: BonusCardProps) => {
  return (
    <div className="rounded-lg border border-green-200 overflow-hidden">
      <h4 className="text-lg text-white text-center font-semibold bg-blue-600">
        Day {day}
      </h4>

      <div className="bg-[#FBF4ED]">
        <div className="z-[2] relative">
          <Image
            className="absolute z-[2] w-[90%] mx-auto "
            src={bg_effect}
            alt="Bonus"
          />
          <div className="flex items-center gap-2 justify-between px-2 py-4">
            <Image src={money} alt="Money" className="w-[50px] h-auto" />
            <Image src={beg} alt="Beg" className="w-[50px] h-auto" />
          </div>
          <div className="p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-black/75 ">
                Bonus
              </span>
              <span className="text-xs font-bold text-black/75">৳ {bonus}</span>
            </div>

            <button className="bg-gradient-to-r from-[#f8493f] to-[#fd603f] w-full py-1.5 rounded-full text-sm text-white cursor-pointer mt-4">
              Signin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
