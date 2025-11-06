"use client";

import Link from "next/link";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ProductCard({
  product,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: ProductCardProps) {
  return (
    <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 items-center justify-start w-full">
      <Link href={`/products/${product.id}`} className="w-full">
        <ProductImage
          src={product.image}
          alt={product.name}
          isHovered={isHovered}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      </Link>

      <ProductInfo name={product.name} description={product.description} />
    </div>
  );
}
