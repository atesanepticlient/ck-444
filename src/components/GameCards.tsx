"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NetEnt, Title } from "@/types/gamelist";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LiaHeartSolid } from "react-icons/lia";
import { Loader } from "./loader/GameLoader";
import { providers } from "../../data/api-providers";
interface GameCardWithProviderProps {
  game: NetEnt;
}
export const GameCardWithProvider = ({ game }: GameCardWithProviderProps) => {
  const [imageLoaded, setImageLoad] = useState(false);
  const { img, name, title } = game;

  const handleImageLoad = () => {
    setImageLoad(true);
  };

  const findProviderImage = (providerName: Title) => {
    const provider = providers.find(
      (provider) => provider.name == providerName
    );
    console.log("provider ", providerName);
    return provider?.imageWhite;
  };
  const providerImag = findProviderImage(title);
  return (
    <>
      <div
        className={`relative overflow-y-hidden rounded-2xl ${
          imageLoaded ? "visible " : "invisible h-0 overflow-hidden"
        }`}
      >
        <div className="shiny-card w-full">
          <img
            alt={name}
            src={img}
            className="w-full h-auto  align-middle "
            onLoad={handleImageLoad}
          />
        </div>

        {providerImag && (
          <div className="absolute z-10 left-0 bottom-0  flex justify-center items-center game-card-provider-overllay rounded-2xl">
            <Image
              src={providerImag}
              alt="provider"
              width={35}
              height={15}
              unoptimized
              className="w-[35px] h-auto  align-middle"
            />
          </div>
        )}

        <div className="absolute top-2 right-2 z-10 ">
          <div className="w-[18px] h-[18px] rounded-full bg-white/10 flex justify-center items-center ">
            <LiaHeartSolid className="w-[15px] h-[15px] text-white" />
          </div>
        </div>
      </div>

      <div className={`${imageLoaded ? "hidden" : "block"}`}>
        <Loader />
      </div>
    </>
  );
};
