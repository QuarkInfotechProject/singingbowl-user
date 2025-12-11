"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface ProductImageProps {
  images?: string[];
}

const ProductImage = ({ images = [] }: ProductImageProps) => {
  const [activeImage, setActiveImage] = useState(0);

  // Debug: Log the images being passed
  console.log("ProductImage received images:", images);

  // Use provided images or fallback
  const displayImages = images.length > 0
    ? images.map((src, id) => ({ id, src }))
    : [
      { id: 0, src: "/assets/images/product/1.jpg" },
      { id: 1, src: "/assets/images/product/2.jpg" },
      { id: 2, src: "/assets/images/product/3.jpg" },
    ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Image */}
      <div
        className="relative w-full h-[500px] bg-white rounded-lg shadow-lg overflow-hidden mb-6"
        style={{ aspectRatio: "1" }}
      >
        <Image
          src={displayImages[activeImage]?.src || "/assets/images/product/1.jpg"}
          alt={`Product view ${activeImage + 1}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Thumbnail Carousel */}
      {displayImages.length > 1 && (
        <Carousel className="w-full px-12">
          <CarouselContent>
            {displayImages.map((img, idx) => (
              <CarouselItem key={idx} className="basis-1/4 ">
                <div
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-full h-24 rounded-lg overflow-hidden cursor-pointer transition-all ${activeImage === idx
                    ? "border-blue-500"
                    : "border-gray-300 hover:border-gray-400"
                    }`}
                >
                  <Image
                    src={img.src}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="shadow-sm cursor-pointer absolute left-0" />
          <CarouselNext className="shadow-sm cursor-pointer absolute right-0" />
        </Carousel>
      )}
    </div>
  );
};

export default ProductImage;
