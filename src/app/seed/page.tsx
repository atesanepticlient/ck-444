"use client";
import React from "react";

import { seed } from "@/action/seed";

const Seed = () => {
  return (
    <div>
      <button onClick={() => seed().then((res) => console.log({ res }))}>
        Seed
      </button>
    </div>
  );
};

export default Seed;
