/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import { LiaHeartSolid } from "react-icons/lia";
interface GameCardWithProviderProps {
  gameImage: any;
  providerImage: any;
  redirect: string;
  gameName: string;
}
export const GameCardWithProvider = ({
  gameImage,
  providerImage,
  redirect,
  gameName,
}: GameCardWithProviderProps) => {
  return (
    <div className="relative overflow-y-hidden rounded-2xl">
      <div className="shiny-card w-full">
        <Image
          alt={gameName}
          src={gameImage}
          width={140}
          height={185}
          unoptimized
          className="w-full h-auto  align-middle "
        />
      </div>

      <div className="absolute z-10 left-0 bottom-0  flex justify-center items-center game-card-provider-overllay rounded-2xl">
        <Image
          src={providerImage}
          alt="provider"
          width={35}
          height={15}
          unoptimized
          className="w-[35px] h-auto  align-middle"
        />
      </div>

      <div className="absolute top-2 right-2 z-10 ">
        <div className="w-[18px] h-[18px] rounded-full bg-white/10 flex justify-center items-center ">
          <LiaHeartSolid className="w-[15px] h-[15px] text-white" />
        </div>
      </div>
    </div>
  );
};
