"use client";

import { useEffect, useState } from "react";
import ProductCarousel from "./ProductCarousel";
import SectionTitle from "../SectionTitle";
import { fetchProducts } from "@/lib/apiItems";
import { Product } from "@/types/product";
import { ProductCarouselSkeleton } from "@/components/ui/skeletons";

export default function ProductCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts();
        const allProducts: Product[] = [];
        if (response.data && Array.isArray(response.data)) {
          response.data.forEach((category: any) => {
            if (category.products && Array.isArray(category.products)) {
              // Map products with correct image structure
              const mappedProducts = category.products.map((prod: any) => ({
                ...prod,
                uuid: prod.id || prod.uuid,
                productName: prod.productName || prod.name,
                files: {
                  baseImage: prod.baseImage ? { url: prod.baseImage } : null,
                  additionalImage: prod.additionalImage || [],
                },
                inStock: prod.inStock,
              }));
              allProducts.push(...mappedProducts);
            }
          });
        }
        // Limit to 10 products
        setProducts(allProducts.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10 sm:gap-10 md:gap-12 lg:gap-18 items-center text-center justify-center px-2 sm:px-6 md:px-10 lg:px-20 py-8 md:py-12 w-full">
        <SectionTitle title="Our Collections" />
        <ProductCarouselSkeleton />
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-10 sm:gap-10 md:gap-12 lg:gap-18 items-center text-center justify-center px-2 sm:px-6 md:px-10 lg:px-20 py-8 md:py-12 w-full max-w-[100vw] overflow-hidden">
      <SectionTitle title="Our Collections" />
      <ProductCarousel products={products} />
    </div>
  );
}
