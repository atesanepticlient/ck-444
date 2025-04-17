"use client"
import React from "react";

import slider from "@/../public/slider/slider1.jpeg";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";



// import required modules
import { Pagination } from "swiper/modules";
import Image from "next/image";
const HeroSlider = () => {
  return (
    <div className="my-4">
      <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        <SwiperSlide>
          <Image
            src={slider}
            alt="slider"
            className="w-full aspect-auto rounded-2xl "
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src={slider}
            alt="slider"
            className="w-full aspect-auto rounded-2xl "
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSlider;
