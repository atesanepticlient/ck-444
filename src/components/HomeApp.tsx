import React from "react";
import AppNotice from "./AppNotice";
import HeroSlider from "./HeroSlider";
import AppMenuItems from "./AppMenuItems";
import HotGames from "./HotGames";
import SlotGames from "./SlotsGames";
import LiveCasino from "./LiveCasino";
import WithdrawDepositButton from "./WithdrawDepositButton";

const HomeApp = () => {
  return (
    <div className="app p-3">
      <AppNotice />
      <HeroSlider />
      <WithdrawDepositButton />
      <AppMenuItems />
      <HotGames />
      <SlotGames />
      <LiveCasino />
    </div>
  );
};

export default HomeApp;
