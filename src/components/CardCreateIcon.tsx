"use client";
import React, { useState } from "react";
import { MdAddCard } from "react-icons/md";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import Image from "next/image";
import { GoPlus } from "react-icons/go";

import bkash from "@/../public/wallet/bkash-seeklogo.png";
import nagad from "@/../public/wallet/nagad-seeklogo.png";
import Link from "next/link";

const CardCreateIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer p-3  flex flex-col justify-center  items-center "
      >
        <GoPlus className="w-5 h-5 text-gray-700" />
        
      </button>

      <Drawer
        edge
        open={isOpen}
        onClose={handleClose}
        position="bottom"
        className="p-0 "
      >
        <DrawerItems className="p-4">
          <Link
            href="#"
            className="flex items-center gap-3 p-2 rounded-md border  mb-2"
          >
            <div className="p-1 flex justify-center items-center">
              <Image
                src={bkash}
                alt="bkash"
                className="w-[40px] h-auto"
                placeholder="blur"
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-950">Bkash</h3>
              <p className="text-gray-800 text-xs text-start">
                You can make up to 5 cards
              </p>
            </div>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 p-2 rounded-md border "
          >
            <div className="p-1 flex justify-center items-center">
              <Image
                src={nagad}
                alt="nagad"
                className="w-[40px] h-auto"
                placeholder="blur"
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-950">Nagad</h3>
              <p className="text-gray-800 text-xs text-start">
                You can make up to 5 cards
              </p>
            </div>
          </Link>
        </DrawerItems>
      </Drawer>
    </div>
  );
};

export default CardCreateIcon;
