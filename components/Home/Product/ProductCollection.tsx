"use client";

import { useEffect, useState } from "react";
import SectionTitle from "../SectionTitle";
import { fetchCategories } from "@/lib/apiItems";
import { ProductCarouselSkeleton } from "@/components/ui/skeletons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  logo: string | null;
}

export default function ProductCollection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        if (response.data && Array.isArray(response.data)) {
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
      <div className="flex flex-col gap-10 sm:gap-10 md:gap-12 lg:gap-18 items-center text-center justify-center px-2 sm:px-6 md:px-10 lg:px-20 py-8 md:py-12 w-full">
        <SectionTitle title="Our Collections" />
        <ProductCarouselSkeleton />
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10 sm:gap-10 md:gap-12 lg:gap-18 items-center text-center justify-center px-2 sm:px-6 md:px-10 lg:px-20 py-8 md:py-12 w-full max-w-[100vw] overflow-hidden">
      <SectionTitle title="Our Collections" />
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4"
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="group block"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 mb-3 transition-all duration-300 group-hover:shadow-lg group-hover:border-[#A12717]/30 group-hover:scale-[1.02]">
                  {category.logo ? (
                    <Image
                      src={category.logo}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#A12717]/5 to-[#A12717]/15">
                      <span className="text-5xl md:text-6xl opacity-40">🎵</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-sm md:text-base font-medium text-slate-800 group-hover:text-[#A12717] transition-colors duration-200 line-clamp-2 text-center">
                  {category.name}
                </h3>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
