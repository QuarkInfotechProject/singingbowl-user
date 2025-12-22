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
  const imageUrl = product.files?.baseImage?.url || "/assets/images/product/1.jpg";

  return (
    <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 items-center justify-start">
      <Link href={`/products/${product.url}`} className="w-full">
        <ProductImage
          src={imageUrl}
          alt={product.productName}
          isHovered={isHovered}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      </Link>

      <ProductInfo name={product.productName} description={product.description} />
    </div>
  );
}
