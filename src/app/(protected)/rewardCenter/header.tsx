/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { UserAvatar } from "@/components/HeaderBalance";
import React, { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const RewardHeader = () => {
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(1250.75);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const handleCopyPlayerId = () => {
    navigator.clipboard.writeText("BT78945612");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshBalance = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setBalance((prevBalance) => {
      const newBalance = +(prevBalance + (Math.random() * 0.5 - 0.25)).toFixed(
        2
      );
      return newBalance;
    });

    setLastUpdateTime(new Date());
    setShowToast(true);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative reward-header-bg rounded-b-full  p-2 h-[240px] flex items-center">
      {/* Toast Notification */}
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 z-50 ${
          showToast ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="text-sm font-medium">Balance updated successfully</div>
        <div className="text-xs mt-1">
          {lastUpdateTime.toLocaleTimeString()}
        </div>
      </div>

      <h2 className="text-[60px]   font-bold absolute left-1/2 -translate-x-1/2 top-5  text-transparent bg-[linear-gradient(#fff,#0000)] bg-clip-text">
        Reward
      </h2>

      <button
        className="cursor-pointer absolute top-4 left-5"
        onClick={handleBack}
      >
        <FaArrowLeftLong className="w-5 h-5 text-white" />
      </button>

      <div className=" flex items-center justify-between mb-4">
        <div className=" flex items-center">
          <div className="absolute -bottom-[25%] -translate-y-1/2 left-14">
            <UserAvatar
              className="!w-[120px] !h-[120px] rounded-full"
              imageUrl="https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png"
            />
          </div>
          <div className="ml-3 absolute left-[40%] -bottom-4 -translate-y-1/2">
            <h2 className="font-bold text-xl text-white">James Wilson</h2>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-200">
                Player ID: BT78945612
              </span>
              <button
                onClick={handleCopyPlayerId}
                className="ml-2 text-xs bg-gray-200 hover:bg-gray-400 p-1 rounded cursor-pointer"
              >
                <FaCopy className="text-[#B0235F]" />
              </button>
            </div>

            <div className="flex items-center justify-between  ">
              <div>
                <div className="flex items-center">
                  <span
                    className="text-xl font-bold tracking-tighter text-white mt-2 transition-all duration-300 transform"
                    style={{
                      animation: isRefreshing
                        ? "none"
                        : "balancePulse 0.5s ease-out",
                    }}
                  >
                    ${balance.toFixed(2)}
                  </span>
                  <style>
                    {`
                @keyframes balancePulse {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                  100% { transform: scale(1); }
                }
              `}
                  </style>
                  <button
                    onClick={handleRefreshBalance}
                    className="ml-2 text-xs bg-gray-200 hover:bg-gray-400 p-1.5 rounded cursor-pointer relative"
                    disabled={isRefreshing}
                  >
                    <FiRefreshCw className="text-[#B0235F]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardHeader;
