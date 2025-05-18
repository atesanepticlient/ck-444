import React from "react";
import Header from "./header";
import SigninBonusPlan from "./plan";
import BonusCards from "./bonus-cards";

const SigninBonus = () => {
  return (
    <div>
      <Header
        balance={0}
        lastSigninBonus={0}
        playerId="BJ238493"
        profile="https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
        totalSigninBonus={0}
      />
      <SigninBonusPlan minDeposit={100} />
      <BonusCards />
    </div>
  );
};

export default SigninBonus;
