"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { memo } from "react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about_us" },
  { name: "Contact", href: "/contact_us" },
  { name: "Blog", href: "/blog" },
];

const NavigationBar = () => {
  const pathname = usePathname();

  // Determine active tab based on pathname
  const activeTab =
    navItems.find((item) => item.href === pathname)?.name;

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
                  asChild
                >
                  <a href={item.href}>{item.name}</a>
                </Button>
                {activeTab === item.name && (
                  <div className="absolute bottom-3 left-4 right-4 h-0.5 bg-[#A12717] transition-all duration-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default memo(NavigationBar);
