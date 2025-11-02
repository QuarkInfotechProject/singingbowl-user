"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const categories = [
  { name: "Ultabati bowls", href: "/category/ultabati" },
  { name: "Jambati bowls", href: "/category/jambati" },
  { name: "Full Moon bowls", href: "/category/full-moon" },
  { name: "Carving bowls", href: "/category/carving" },
  { name: "Mani bowls", href: "/category/mani" },
  { name: "Thadobati bowls", href: "/category/thadobati" },
  { name: "Lingam bowls", href: "/category/lingam" },
  { name: "New Handhammered bowls", href: "/category/new-handhammered" },
];

const Categories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval: NodeJS.Timeout;

    const scroll = () => {
      if (!isPaused) {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 1;
        }
      }
    };

    scrollInterval = setInterval(scroll, 30);

    return () => clearInterval(scrollInterval);
  }, [isPaused]);

  return (
    <div className="w-full bg-[#A12717] py-2 overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden whitespace-nowrap"
        style={{ scrollBehavior: "auto" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Duplicate categories for seamless loop */}
        {[...categories, ...categories].map((category, index) => (
          <Button
            key={index}
            variant="ghost"
            className="text-white hover:bg-[#8a2014] hover:text-white px-6 py-2 text-sm font-normal flex-shrink-0"
            asChild
          >
            <Link href={category.href}>{category.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
