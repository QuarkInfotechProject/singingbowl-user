"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { memo } from "react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about_us" },
  { name: "Blog", href: "/blog" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact_us" },
  { name: "Courses", href: "/courses" },
];

const NavigationBar = () => {
  const pathname = usePathname();

  // Determine active tab based on pathname
  const activeTab = navItems.find((item) => item.href === pathname)?.name;

  return (
    <nav className="w-full bg-white">
      <div className="w-full lg:max-w-7xl mx-auto px-4">
        {/* Scrollable container for mobile, centered flex for desktop */}
        <div className="h-12 overflow-x-auto lg:overflow-x-visible scrollbar-hide">
          <div className="flex items-center justify-start lg:justify-center h-full min-w-max lg:min-w-0">
            {/* Navigation Links */}
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative h-full flex items-center px-4 flex-shrink-0"
              >
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-[#A12717] hover:bg-transparent p-0 text-sm font-medium h-auto rounded-none whitespace-nowrap"
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

      {/* Custom CSS to hide scrollbar while maintaining scroll functionality */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
};

export default memo(NavigationBar);
