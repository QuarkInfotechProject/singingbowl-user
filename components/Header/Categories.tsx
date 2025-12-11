"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fetchCategories } from "@/lib/apiItems";

interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  logo: string | null;
}

const Categories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        if (response.data) {
          setCategories(response.data);
        }
        console.log("data fetched for categories is:::::::", response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || categories.length === 0) return;

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
  }, [isPaused, categories]);

  if (isLoading) {
    return (
      <div className="w-full bg-[#A12717] py-2 overflow-hidden">
        <div className="flex gap-2 md:gap-4 px-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 md:w-32 bg-[#8a2014] rounded animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#A12717] py-2 overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-2 md:gap-4 overflow-x-hidden whitespace-nowrap"
        style={{ scrollBehavior: "auto" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Duplicate categories for seamless loop */}
        {[...categories, ...categories].map((category, index) => (
          <Button
            key={`${category.id}-${index}`}
            variant="ghost"
            className="text-white hover:bg-[#8a2014] hover:text-white px-4 md:px-6 py-2 text-sm font-normal flex-shrink-0"
            asChild
          >
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
