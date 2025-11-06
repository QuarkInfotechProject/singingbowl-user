"use client";

import { PRODUCTS } from "./data";
import ProductCarousel from "./ProductCarousel";
import SectionTitle from "./SectionTitle";

export default function ProductCollection() {
  return (
    <div className="flex flex-col gap-10 sm:gap-10 md:gap-12 lg:gap-18 items-center justify-center px-3 sm:px-6 md:px-10 lg:px-20 py-8 md:py-12 w-full">
      <SectionTitle title="Our Collections" />
      <ProductCarousel products={PRODUCTS} />
    </div>
  );
}
