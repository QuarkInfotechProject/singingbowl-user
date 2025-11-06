"use client";

import { CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

export default function CarouselNavigation() {
  return (
    <>
      <CarouselPrevious className="hidden md:flex left-0 -translate-x-10 bg-[#A12717] h-16 w-8 rounded-md text-white cursor-pointer hover:bg-[#A12717] hover:text-white sm:-translate-x-12 md:-translate-x-14" />
      <CarouselNext className="hidden md:flex right-0 translate-x-10 bg-[#A12717] h-16 w-8 rounded-md text-white cursor-pointer hover:bg-[#A12717] hover:text-white sm:translate-x-12 md:translate-x-14" />
    </>
  );
}
