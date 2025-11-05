"use client";

import ProductCard from "./ProductCard";
import { PRODUCTS } from "./data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductCollection = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center px-4 md:px-20 py-12 w-full">
      <h2 className="font-bold text-4xl md:text-5xl text-black tracking-tight mb-6 text-center">
        Our Collections
      </h2>

      <div className="w-full max-w-7xl">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {PRODUCTS.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 md:basis-1/4 basis-1/2 sm:basis-1/3"
              >
                <div className="p-1">
                  <ProductCard {...product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons - Hidden on Mobile, Visible on Desktop */}
          <CarouselPrevious className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 h-16 w-8 rounded-lg bg-[#A12717] text-white hover:bg-[#A12717] cursor-pointer border-0" />
          <CarouselNext className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 h-16 w-8 rounded-lg bg-[#A12717] text-white hover:bg-[#A12717] cursor-pointer border-0" />
        </Carousel>
      </div>
    </div>
  );
};

export default ProductCollection;
