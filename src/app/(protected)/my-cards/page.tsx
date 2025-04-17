// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import CardCreateIcon from "@/components/CardCreateIcon";
import MyCards from "@/components/MyCards";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import { MdOutlineSupportAgent } from "react-icons/md";

const Card = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <SiteHeader title="My Cards">
        <CardCreateIcon />
      </SiteHeader>

      <main>
        <MyCards />
      </main>
    </div>
  );
};

export default Card;
