import React from "react";
import AppNotice from "./AppNotice";
import HeroSlider from "./HeroSlider";
import AppMenuItems from "./AppMenuItems";
import SlotGames from "./SlotsGames";
import WithdrawDepositButton from "./WithdrawDepositButton";
import LiveCasino from "./LiveCasino";
import ESports from "./E-Sports";
import Sports from "./Sports";

const HomeApp = () => {
  return (
    <div className="app p-3">
      <AppNotice />
      <HeroSlider />
      <WithdrawDepositButton />
      <AppMenuItems />
      {/* <HotGames /> */}
      <SlotGames />
      <ESports />
      <Sports />
      <LiveCasino />
    </div>
  );
};

export default HomeApp;
