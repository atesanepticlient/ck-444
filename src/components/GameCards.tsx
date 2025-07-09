/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NetEnt, Title } from "@/types/game";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LiaHeartSolid } from "react-icons/lia";
import { Loader } from "./loader/GameLoader";
import { providers } from "../../data/api-providers";
import { useOpenGameMutation } from "@/lib/features/gamesApiSlice";
import Link from "next/link";

import default_provider_img from "@/../public/games/provider/EVO-WHITE.png";
import { LocalArrayStorage } from "@/lib/favorites";

const storage = LocalArrayStorage<string>();

interface GameCardWithProviderProps {
  game: NetEnt;
}
export const GameCardWithProvider = ({ game }: GameCardWithProviderProps) => {
  const [imageLoaded, setImageLoad] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFav, setFav] = useState(false);
  const [iframe, setIframe] = useState("");
  const { img, name, title, id } = game;

  const [openGame, { isLoading }] = useOpenGameMutation();

  const handleImageLoad = () => {
    setImageLoad(true);
  };

  const findProviderImage = (providerName: Title) => {
    const provider = providers.find(
      (provider) => provider.name == providerName
    );
    if (!provider) {
      return default_provider_img;
    }
    return provider?.imageWhite;
  };
  const providerImag = findProviderImage(title);

  const handleOpenGame = (gameId: string) => {
    openGame({ gameId, demo: "0" })
      .unwrap()
      .then((res) => {
        if (res) {
          const url = res.content.game.url;
          const iframeMode = res.content.game.iframe;
          if (iframeMode == "0") {
            location.href = url;
          } else {
            setIframe(url);
            setShowModal(true);
          }
        }
      })
      .catch((error) => {
        console.log("ERRRO ", error);
      });
  };

  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<any>(null);

  useEffect(() => {
    const imgC = new window.Image();
    imgC.src = img;
    imgC.onload = () => {
      setImageSrc(img);
      setLoaded(true);
    };
  }, [img]);

  const handleAddToFav = (gameId: string) => {
    setFav(!isFav);
    storage.push("favorites-games", gameId);
  };

  useEffect(() => {
    setFav(storage.exists("favorites-games", id));
  }, [storage]);

  return (
    <>
      {loaded && imageSrc ? (
        <div className="relative">
          <Link
            href={`/play?gameId=${id}`}
            onClick={() => handleOpenGame(id)}
            className="relative game-main overflow-hidden"
          >
            <div
              className={`relative overflow-y-hidden rounded-2xl ${
                imageLoaded ? "visible " : "invisible h-0 overflow-hidden"
              }`}
            >
              <div className="shiny-card w-full">
                <img
                  alt={name}
                  src={imageSrc}
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
            </div>
            {/* <div className="play absolute top-0 left-0 rounded-2xl w-full h-[97%] bg-transparent flex justify-center items-center">
            <SecondaryButton
              disabled={isLoading}
              onClick={() => handleOpenGame(id)}
              className="button"
            >
              {isLoading ? "Loading" : "Play"}
            </SecondaryButton>
          </div> */}
          </Link>
          <div className="absolute top-2 right-2 z-10 ">
            <button
              onClick={() => handleAddToFav(id)}
              className="w-[18px] h-[18px] rounded-full bg-white/10 flex justify-center items-center "
            >
              {}
              <LiaHeartSolid
                className={`w-[15px] h-[15px] ${
                  isFav ? "text-pink-500" : "text-white"
                } `}
              />
            </button>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
