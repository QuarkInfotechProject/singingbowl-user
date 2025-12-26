"use client";

import SimilarProductCard, { SimilarProduct } from "./SimilarProductCard";

interface SimilarProductsGridProps {
    title: string;
    products: SimilarProduct[];
}

const SimilarProductsGrid = ({ title, products }: SimilarProductsGridProps) => {
    // Don't render if no products
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="w-full mb-8">
            <div className="flex flex-col items-center justify-center gap-10">
                <h2 className="font-bold text-3xl">{title}</h2>
                <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <SimilarProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SimilarProductsGrid;
