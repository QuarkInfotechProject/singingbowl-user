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
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.uuid}
            className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4"
          >
            <ProductCard
              product={product}
              isHovered={hoveredId === product.uuid}
              onMouseEnter={() => setHoveredId(product.uuid)}
              onMouseLeave={() => setHoveredId(null)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselNavigation />
    </Carousel>
  );
}