/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import { UserAvatar } from "@/components/HeaderBalance";
import React, { useState, useEffect } from "react";
import { PiHandDepositFill } from "react-icons/pi";
import { FiRefreshCw } from "react-icons/fi";
import { FaCopy } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { FaCreditCard } from "react-icons/fa6";
import { PiHandWithdrawFill } from "react-icons/pi";
import { FaGift } from "react-icons/fa";
import { LuHistory } from "react-icons/lu";
import { FaChartLine } from "react-icons/fa6";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { LuNotebookText } from "react-icons/lu";
import { FaCircleUser } from "react-icons/fa6";
import { MdSecurity } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import { FiDownload } from "react-icons/fi";
import { MdOutlineSupportAgent } from "react-icons/md";
import Link from "next/link";

const App: React.FC = () => {
  const [balance, setBalance] = useState(1250.75);
  const [copied, setCopied] = useState(false);
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
  return (
    <div className="  bg-[url(https://c.animaapp.com/m9drzmnaxdV67z/img/background.png)] bg-cover bg-[50%_50%] w-full min-h-screen px-2 py-3 text-gray-800 pb-16">
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
      {/* Profile Section */}
      <div
        className=" text-white px-4 py-5 rounded-b-xl wallet-bg"
        style={{
          borderRadius: 36.4,
          borderBottom: "1px var(--color-cyan-53,rgb(10, 104, 81)) solid",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <UserAvatar imageUrl="https://images.51939393.com//TCG_PROD_IMAGES/B2C/01_PROFILE/PROFILE/0.png" />
            <div className="ml-3">
              <h2 className="font-medium text-lg">James Wilson</h2>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-200">
                  Player ID: BT78945612
                </span>
                <button
                  onClick={handleCopyPlayerId}
                  className="ml-2 text-xs bg-gray-700 hover:bg-gray-600 p-1 rounded cursor-pointer"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          </div>
          <button className="text-white p-2 rounded-full hover:bg-[#00292f] cursor-pointer">
            <IoLogOut className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between rounded-lg p-3">
          <div>
            <span className="text-xs text-[#23FFC8]">Balance</span>
            <div className="flex items-center">
              <span
                className="text-xl font-semibold text-[#23FFC8] transition-all duration-300 transform"
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
                className="ml-2 text-xs bg-gray-700 hover:bg-gray-600 p-1.5 rounded cursor-pointer relative"
                disabled={isRefreshing}
              >
                <FiRefreshCw />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Action Buttons */}
      <div className="grid grid-cols-3 gap-2 px-4 py-2">
        <Link href="/deposit">
          <button className="font-bold  text-center text-orange-700 bg-teal-900 rounded-3xl border border-solid bg-[linear-gradient(rgb(255,230,0),rgb(255,184,0))] border-orange-200 border-opacity-50  leading-[50px] w-full shadow-[rgb(255,242,166)_0px_3.64267px_0px_1px_inset,rgb(182,65,0)_0px_3.64267px_0px_0px] flex  justify-center items-center h-[60px] ">
            <PiHandDepositFill className="text-xl mb-1 w-7 h-7 gap-3" />
            <span className="text-lg font-medium">Deposit</span>
          </button>
        </Link>
        <Link href="/withdraw">
          <button className="font-bold text-center text-orange-700 bg-teal-900 rounded-3xl border border-solid bg-[linear-gradient(rgb(255,230,0),rgb(255,184,0))] border-orange-200 border-opacity-50  leading-[50px] w-full shadow-[rgb(255,242,166)_0px_3.64267px_0px_1px_inset,rgb(182,65,0)_0px_3.64267px_0px_0px] flex  justify-center items-center h-[60px] gap-3">
            <PiHandWithdrawFill className="text-xl mb-1 w-7 h-7" />
            <span className="text-lg font-medium">Withdraw</span>
          </button>
        </Link>
        <Link href="/my-cards">
          <button className="font-bold text-center  text-orange-700 bg-teal-900 rounded-3xl border border-solid bg-[linear-gradient(rgb(255,230,0),rgb(255,184,0))] border-orange-200 border-opacity-50  leading-[50px] w-full shadow-[rgb(255,242,166)_0px_3.64267px_0px_1px_inset,rgb(182,65,0)_0px_3.64267px_0px_0px] flex  justify-center items-center gap-3 h-[60px] ">
            <FaCreditCard className="text-xl mb-1 w-7 h-7" />
            <span className="text-lg font-medium">My Card</span>
          </button>
        </Link>
      </div>
      {/* Menu Section */}
      <div className="flex-1 px-4 py-3 pb-8">
        <h3 className="text-lg font-medium mb-3 text-white">Member Menu</h3>
        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
          {/* Row 1 */}
          <Link
            href="/rewardCenter"
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-teal-900/75 border-x-teal-600 flex items-center justify-center  shadow-sm">
              <FaGift className="text-xl text-white" />
            </div>
            <span className="text-xs text-center text-white">Reward</span>
          </Link>

          <Link
            href="/betting-record"
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-12 h-12  rounded-full bg-teal-900/75 border-x-teal-600 flex items-center justify-center  shadow-sm">
              <LuHistory className="text-xl text-white" />
            </div>
            <span className="text-xs text-center text-white">
              Betting Record
            </span>
          </Link>
          <Link
            href="/profit-loss"
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-12 h-12  rounded-full bg-teal-900/75 border-x-teal-600 flex items-center justify-center  shadow-sm">
              <FaChartLine className="text-xl text-white" />
            </div>
            <span className="text-xs text-center text-white">Profit/Loss</span>
          </Link>
          {/* Row 2 */}
          <Link
            href="/deposit-record"
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-12 h-12  rounded-full bg-teal-900/75 border-x-teal-600 flex items-center justify-center  shadow-sm">
              <FaFileInvoiceDollar className="text-xl text-white" />
            </div>
            <span className="text-xs text-center text-white">
              Deposit Record
            </span>
          </Link>

          <Link
            href={"withdraw-record"}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-12 h-12  rounded-full bg-teal-900/75 border-x-teal-600 flex items-center justify-center mb-1 shadow-sm">
              <LuNotebookText className="text-xl text-white" />
            </div>
            <span className="text-xs text-center text-white">
              Withdraw Record
            </span>
          </Link>
          <Link href="#" className="flex flex-col items-center cursor-pointer">
            <div className="w-12 h-12  rounded-full bg-teal-900/75 border-x-teal-600 flex items-center justify-center  shadow-sm">
              <FaCircleUser className="text-xl text-white" />
            </div>
            <span className="text-xs text-center text-white">My Account</span>
          </Link>
          {/* Row 3 */}
          <Link href="#" className="flex flex-col items-center cursor-pointer">
            <div className="w-12 h-12  rounded-full bg-teal-900/75 border-x-teal-600 flex items-center justify-center  shadow-sm">
              <MdSecurity className="text-xl text-white" />
            </div>
            <span className="text-xs text-center text-white">
              Security Center
            </span>
          </Link>
          <Link
            href="/invite-friends"
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-12 h-12  rounded-full bg-teal-900/75 border-x-teal-600 flex items-center justify-center  shadow-sm">
              <TiUserAdd className="text-xl text-white" />
            </div>
            <span className="text-xs text-center text-white">
              Invite Friend
            </span>
          </Link>
          <Link href="#" className="flex flex-col items-center cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-teal-900/75 border-x-teal-600 flex items-center justify-center  shadow-sm">
              <FiDownload className="text-xl text-white" />
            </div>
            <span className="text-xs text-center text-white">Download App</span>
          </Link>
          {/* Row 4 */}
          <Link href="#" className="flex flex-col items-center cursor-pointer">
            <div className="w-12 h-12  rounded-full bg-teal-900/75 border border-x-teal-600 flex items-center justify-center  shadow-sm">
              <MdOutlineSupportAgent className="text-xl text-white" />
            </div>
            <span className="text-xs text-center text-white">
              Customer Center
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default App;
