import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabNavigationProps {
  children: React.ReactNode;
}

export function TabNavigation({ children }: TabNavigationProps) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 rounded-full bg-gray-100 p-1">
        <TabsTrigger
          value="details"
          className="data-[state=active]:bg-white rounded-full data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          Details
        </TabsTrigger>
        <TabsTrigger
          value="packaging"
          className="data-[state=active]:bg-white rounded-full data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          Packaging
        </TabsTrigger>
        <TabsTrigger
          value="shipping"
          className="data-[state=active]:bg-white rounded-full data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          Shipping
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
