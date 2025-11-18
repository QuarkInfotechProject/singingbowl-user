"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about_us" },
  { name: "Contact", href: "/contact_us" },
  { name: "Blog", href: "/blog" },
];

const NavigationBar = () => {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <nav className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center h-12">
          {/* Navigation Links */}
          <div className="flex items-center h-full">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative h-full flex items-center px-4"
              >
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-[#A12717] hover:bg-transparent p-0 text-sm font-medium h-auto rounded-none"
                  onClick={() => setActiveTab(item.name)}
                  asChild
                >
                  <a href={item.href}>{item.name}</a>
                </Button>
                {activeTab === item.name && (
                  <div className="absolute bottom-3 left-4 right-4 h-0.5 bg-[#A12717]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
