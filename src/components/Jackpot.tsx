/* eslint-disable @next/next/no-img-element */
import React from "react";

// Game data for the scrollable cards
const gameData = [
  {
    id: 1,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/l22009-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/l22-white-png.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1.svg",
  },
  {
    id: 2,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg0508-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg-white-png.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-5.svg",
  },
  {
    id: 3,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg0557-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg-white-png-1.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-14.svg",
  },
  {
    id: 4,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg0507-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg-white-png-2.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-11.svg",
  },
  {
    id: 5,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/l22008-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/l22-white-png-1.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-3.svg",
  },
  {
    id: 6,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg0567-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg-white-png-3.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-15.svg",
  },
  {
    id: 7,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/l22003-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/l22-white-png-2.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-2.svg",
  },
  {
    id: 8,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg0074-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg-white-png-4.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-6.svg",
  },
  {
    id: 9,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg0506-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg-white-png-5.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-13.svg",
  },
  {
    id: 10,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg0485-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg-white-png-6.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-17.svg",
  },
  {
    id: 11,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg0504-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg-white-png-7.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-9.svg",
  },
  {
    id: 12,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg0555-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg-white-png-8.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-16.svg",
  },
  {
    id: 13,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/ps0127-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/ps-white-png.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-12.svg",
  },
  {
    id: 14,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg0505-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/mg-white-png-9.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-4.svg",
  },
  {
    id: 15,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/l22012-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/l22-white-png-3.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-10.svg",
  },
  {
    id: 16,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/bng115-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/bng-white-png.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-8.svg",
  },
  {
    id: 17,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/bng114-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/bng-white-png-1.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-1.svg",
  },
  {
    id: 18,
    image: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/bng113-png.png",
    logo: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/bng-white-png-2.png",
    component: "https://c.animaapp.com/m9cnvgyaJeqJ4f/img/component-1-7.svg",
  },
];

// Jackpot number data
const jackpotNumbers = [
  { value: "1", position: "left-[3px]" },
  { value: "1", position: "left-[31px]" },
  { value: "7", position: "left-[59px]" },
  { value: "3", position: "left-24" },
  { value: "4", position: "left-[124px]" },
  { value: "7", position: "left-[152px]" },
  { value: "0", position: "left-[190px]" },
  { value: "7", position: "left-[218px]" },
  { value: "2", position: "left-[246px]" },
  { value: "6", position: "left-[283px]" },
  { value: "5", position: "left-[311px]" },
];

// Separator positions
const separatorPositions = [
  { value: ",", position: "left-[83px]" },
  { value: ",", position: "left-[177px]" },
  { value: ".", position: "left-[271px]" },
];

export const BackgroundBorder = () => {
  return (
    <div className="flex flex-col w-[358.84px] items-center gap-[11.71px] pt-[108.37px] pb-[14.52px] px-[8.8px] relative bg-wwwwwwck-44-4comdaintree rounded-[10.4px] border border-solid border-[#003840]">
      <div className="relative w-[336.77px] h-[36.39px] z-[3] p-0">
        {/* Separators (commas and decimal point) */}
        {separatorPositions.map((separator, index) => (
          <div
            key={`separator-${index}`}
            className={`absolute w-[9px] h-[35px] -top-0.5 ${separator.position} [text-shadow:0px_1.04px_0px_#4b1f0066] [-webkit-text-stroke:1.04px_#fff6d4] [background:linear-gradient(180deg,rgba(255,184,0,1)_80%,rgba(121,51,0,1)_99%,rgba(202,85,0,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] font-www-wwwck444-com-segoe-UI-bold font-[number:var(--www-wwwck444-com-segoe-UI-bold-font-weight)] text-transparent text-[length:var(--www-wwwck444-com-segoe-UI-bold-font-size)] tracking-[var(--www-wwwck444-com-segoe-UI-bold-letter-spacing)] leading-[var(--www-wwwck444-com-segoe-UI-bold-line-height)] whitespace-nowrap [font-style:var(--www-wwwck444-com-segoe-UI-bold-font-style)]`}
          >
            {separator.value}
          </div>
        ))}

        {/* Number boxes */}
        {jackpotNumbers.map((number, index) => (
          <div
            key={`number-${index}`}
            className={`flex-col w-[23px] h-9 items-center top-0 ${number.position} rounded-[3.33px] [background:linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(247,255,255,1)_100%)] flex absolute`}
          >
            <div
              className={`relative w-fit mt-[-2.04px] mb-[-2.57px] [text-shadow:0px_1.04px_0px_#4b1f0066] [-webkit-text-stroke:1.04px_#fff6d4] [background:linear-gradient(180deg,rgba(0,97,101,1)_16%,rgba(0,44,44,1)_62%,rgba(0,97,101,1)_90%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] ${
                number.value === "6"
                  ? "font-www-wwwck444-com-semantic-item font-[number:var(--www-wwwck444-com-semantic-item-font-weight)] text-[length:var(--www-wwwck444-com-semantic-item-font-size)] tracking-[var(--www-wwwck444-com-semantic-item-letter-spacing)] leading-[var(--www-wwwck444-com-semantic-item-line-height)] [font-style:var(--www-wwwck444-com-semantic-item-font-style)]"
                  : number.value === "4"
                  ? "[font-family:'Segoe_UI-Bold',Helvetica] font-bold text-[28.8px]"
                  : number.value === "0"
                  ? "[font-family:'Segoe_UI-Bold',Helvetica] font-bold text-3xl"
                  : "[font-family:'Segoe_UI-Bold',Helvetica] font-bold text-[31.2px]"
              } text-transparent text-center tracking-[0] leading-[normal]`}
            >
              {number.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] z-[2]">
        <div className="flex space-x-[11px] pb-2">
          {gameData.map((game) => (
            <div
              key={game.id}
              className="flex flex-col w-[114px] items-start overflow-hidden shrink-0"
            >
              <CardContent className="flex flex-col items-start justify-center relative self-stretch w-full flex-[0_0_auto] rounded-[10.4px] overflow-hidden p-0">
                <div className="flex flex-col items-center justify-center relative flex-1 self-stretch w-full grow">
                  <div
                    className="relative flex-1 w-[114.39px] h-[113px] grow bg-cover bg-[50%_50%]"
                    style={{ backgroundImage: `url(${game.image})` }}
                  />
                </div>

                <img
                  className="absolute w-[23px] h-[23px] top-2 left-[83px]"
                  alt="Component"
                  src={game.component}
                />

                <div className="w-[114px] h-[42px] items-start justify-center pt-[15.6px] pb-0 px-0 absolute bottom-0 left-0 rounded-[0px_0px_10.4px_10.4px] [background:linear-gradient(180deg,rgba(0,62,62,1)_0%,rgba(0,62,62,1)_100%)] flex">
                  <div
                    className="relative w-[41.59px] h-[20.8px] bg-cover bg-[50%_50%]"
                    style={{ backgroundImage: `url(${game.logo})` }}
                  />
                </div>
              </CardContent>
            </div>
          ))}
        </div>

        {/* Gradient overlay on the right side of the scroll area */}
        <div className="absolute w-[68px] h-[154px] top-0 right-0 [background:linear-gradient(90deg,rgba(115,115,115,0)_0%,rgba(0,38,50,1)_100%)]" />
      </div>

      {/* Title and banner images */}
      <div className="absolute w-[188px] h-[43px] top-[37px] left-[157px] z-[1] bg-[url(https://c.animaapp.com/m9cnvgyaJeqJ4f/img/jp-title-3e25a2ff-png.png)] bg-cover bg-[50%_50%]" />
      <div className="absolute w-[182px] h-[168px] -top-0.5 left-[-5px] z-0 bg-[url(https://c.animaapp.com/m9cnvgyaJeqJ4f/img/jackpot-banner-18b6f58e-png.png)] bg-cover bg-[50%_50%]" />
    </div>
  );
};
