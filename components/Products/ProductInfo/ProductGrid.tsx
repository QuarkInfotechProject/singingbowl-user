"use client";

import { useState } from "react";
import ProductCard, { Product } from "@/components/Products/ProductInfo/ProductCard"
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  title?: string;
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

  const visibleProducts = products.slice(0, displayCount);
  const hasMoreProducts = displayCount < products.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + loadMoreCount);
  };

  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <ProductCard key={product.url} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found.</p>
        )}
      </div>
      {showLoadMore && hasMoreProducts && (
        <Button
          onClick={handleLoadMore}
          className="mx-auto mt-6 bg-[#802010] hover:bg-[#6a1a0d] rounded-full"
        >
          Load More
        </Button>
      )}
    </div>
  );
}
export default ProductGrid