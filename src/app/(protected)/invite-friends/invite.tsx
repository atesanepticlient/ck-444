import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "./overview";
import Rewards from "./rewards";
import Records from "./records";

const Invite = () => {
  return (
    <div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="border-b bg-white w-full py-5 flex sticky left-0 !rounded-none ">
          <TabsTrigger
            value="overview"
            className="text-base flex-1 data-[state=active]:text-blue-600 data-[state=active]:border-b data-[state=active]:border-b-blue-600 rounded-none shadow-none "
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className="text-base flex-1 data-[state=active]:text-blue-600 data-[state=active]:border-b data-[state=active]:border-b-blue-600 rounded-none shadow-none "
          >
            Rewards
          </TabsTrigger>
          <TabsTrigger
            value="records"
            className="text-base flex-1 data-[state=active]:text-blue-600 data-[state=active]:border-b data-[state=active]:border-b-blue-600 rounded-none shadow-none "
          >
            Records
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="px-3 py-6">
          <Overview />
        </TabsContent>
        <TabsContent value="rewards" className="px-3 py-6">
          <Rewards />
        </TabsContent>
        <TabsContent value="records" className="px-3 py-6">
          <Records />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Invite;
