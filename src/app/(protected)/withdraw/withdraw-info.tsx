import React from "react";

const WithdrawInfo = ({
  mainBalance,
  availableBalance,
  remainingWithdrawal,
}: {
  mainBalance: number;
  availableBalance: number;
  remainingWithdrawal: number;
}) => {
  return (
    <div>
      <div className="mb-10">
        <p className="text-sm text-gray-500 font-semibold">Withdrawal time</p>
        <p className="text-sm text-gray-500 font-semibold">
          Tips：উত্তোলনের সময়সীমা: ২৪ ঘন্টা
        </p>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-500 font-semibold">
          Daily withdrawal : 10 (Times), Remaining withdrawal :{" "}
          {remainingWithdrawal} (Times)
        </p>
      </div>

      <div >
        <p className="text-sm text-black font-semibold">
          Main Wallet : {mainBalance}
        </p>
        <p className="text-sm text-black font-semibold">
          Available Wallet : {availableBalance}
        </p>
      </div>
    </div>
  );
};

export default WithdrawInfo;
