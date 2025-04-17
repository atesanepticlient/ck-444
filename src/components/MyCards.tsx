"use client";
import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

// import required modules
import { EffectCards } from "swiper/modules";
import BkashCard from "@/components/cards/BkashCard";
import NagadCard from "./cards/NagadCard";
const MyCards = () => {
  return (
    <div>
      <div className="py-4 pl-4">
        <h4 className="text-xl font-bold">E-Wallets : 5 Added</h4>
      </div>
      <div className="mt-6">
        {" "}
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards]}
          className="mySwiper"
        >
          <SwiperSlide className="!bg-transparent">
            <BkashCard
              bkashNumber="01735156550"
              cardNumber="0987093742838234"
              ownerName="San Bin "
            />
          </SwiperSlide>
          <SwiperSlide className="!bg-transparent">
            <NagadCard
              nagadNumber="01735156550"
              cardNumber="0987093742838234"
              ownerName="San Bin "
            />
          </SwiperSlide>
          <SwiperSlide className="!bg-transparent">
            <BkashCard
              bkashNumber="01735156550"
              cardNumber="0987093742838234"
              ownerName="San Bin "
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default MyCards;
