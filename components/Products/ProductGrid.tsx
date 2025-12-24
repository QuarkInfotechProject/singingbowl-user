"use client";

import { useState } from "react";
import ProductCard, { Product } from "./ProductInfo/ProductCard";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  title: string;
  products?: Product[];
  initialCount?: number;
  loadMoreCount?: number;
  showLoadMore?: boolean;
}

const ProductGrid = ({
  title,
  products = [],
  initialCount = 12,
  loadMoreCount = 8,
  showLoadMore = true
}: ProductGridProps) => {
  const [displayCount, setDisplayCount] = useState(initialCount);

  // Filter in-stock products first
  const inStockProducts = products.filter(p => p.inStock);
  const visibleProducts = inStockProducts.slice(0, displayCount);
  const hasMoreProducts = displayCount < inStockProducts.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + loadMoreCount);
  };

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col items-center justify-center gap-10">
        <h2 className="font-bold text-3xl">{title}</h2>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">No products available</p>
          )}
        </div>
        {showLoadMore && hasMoreProducts && (
          <Button
            onClick={handleLoadMore}
            className="mx-auto bg-[#802010] hover:bg-[#6a1a0d] rounded-full"
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
