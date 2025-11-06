"use client";

import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ProductImage({
  src,
  alt,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: ProductImageProps) {
  return (
    <div
      className="relative w-full flex justify-center cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full max-w-[100px] sm:max-w-[160px] md:max-w-[210px] aspect-square rounded-full overflow-hidden border border-gray-300 bg-gray-100 relative">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      </div>

      {isHovered && (
        <div className="hidden sm:flex absolute inset-0 mx-auto w-full max-w-[160px] md:max-w-[210px] aspect-square rounded-full bg-[#D9D9D9]/70 transition-opacity duration-300 items-center justify-center z-10">
          <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-[#A12717] text-white cursor-pointer font-semibold rounded-full hover:bg-[#8B1F13] transition-colors shadow-lg text-sm sm:text-base">
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}
