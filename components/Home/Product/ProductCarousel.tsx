"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";
import CarouselNavigation from "./CarouselNavigation";
import { Product } from "@/types/product";

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="w-full max-w-6xl">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 sm:-ml-4 md:-ml-6 lg:-ml-8">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-2 sm:pl-4 md:pl-6 lg:pl-8"
            >
              <ProductCard
                product={product}
                isHovered={hoveredId === product.id}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselNavigation />
      </Carousel>
    </div>
  );
}
