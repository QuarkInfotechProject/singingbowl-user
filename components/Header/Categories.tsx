"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

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
    <div className="w-full bg-[#A12717] py-2 overflow-x-auto md:overflow-hidden no-scrollbar">
      <div
        className={`flex gap-2 md:gap-4 whitespace-nowrap category-scroll ${isPaused ? "paused" : ""}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {[...categories, ...categories].map(
          (category, index) => (
            <Button
              key={`${category.id}-${index}`}
              variant="ghost"
              className="text-white hover:bg-[#8a2014] hover:text-white px-4 md:px-6 py-2 text-sm font-normal flex-shrink-0 transition-colors"
              asChild
            >
              <Link href={`/products?category=${category.slug}`}>
                {category.name}
              </Link>
            </Button>
          )
        )}
      </div>

      {/* CSS Animation for smooth scrolling */}
      <style jsx>{`
        .category-scroll {
          animation: scroll 30s linear infinite;
        }
        @media (max-width: 768px) {
          .category-scroll {
            animation-duration: 5s;
          }
        }
        .category-scroll.paused {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default Categories;
