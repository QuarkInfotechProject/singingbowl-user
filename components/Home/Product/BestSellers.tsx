"use client";

import { useEffect, useState } from "react";
import SectionTitle from "../SectionTitle";
import { fetchBestSellers } from "@/lib/apiItems";
import SimilarProductCard, { SimilarProduct } from "@/components/Products/SimilarProductCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";

const BestSellers = () => {
    const [products, setProducts] = useState<SimilarProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadBestSellers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchBestSellers();
                console.log("Best Sellers API Response:", response);

                // Handle different response formats
                if (response.success && response.data) {
                    setProducts(response.data);
                } else if (response.data) {
                    // Handle { data: [...] } format
                    setProducts(response.data);
                } else if (Array.isArray(response)) {
                    // Handle direct array response
                    setProducts(response);
                } else {
                    console.log("Unexpected response format:", response);
                }
            } catch (err: any) {
                console.error("Failed to fetch best sellers:", err);
                setError(err.message || "Failed to load best sellers");
            } finally {
                setLoading(false);
            }
        };

        loadBestSellers();
    }, []);

    // Skeleton loader
    if (loading) {
        return (
            <div className="flex flex-col gap-10 items-center text-center justify-center px-4 md:px-20 py-8 md:py-12 w-full">
                <SectionTitle title="Best Sellers" />
                <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex flex-col gap-3 animate-pulse">
                            <div className="w-full h-[200px] bg-gray-200 rounded-xl" />
                            <div className="space-y-2 px-1">
                                <div className="h-4 bg-gray-200 rounded w-16" />
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Don't render if no products
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-10 items-center text-center justify-center px-4 md:px-20 py-8 md:py-12 w-full max-w-[100vw] overflow-hidden">
            <SectionTitle title="Best Sellers" />
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {products.map((product) => (
                        <CarouselItem
                            key={product.id}
                            className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5"
                        >
                            <SimilarProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="flex gap-3 sm:gap-5 justify-center mt-8 relative w-full">
                    <CarouselPrevious className="static bg-[#A12717] rounded-lg text-white w-10 h-10 border-0 hover:bg-[#8A1F0E] hover:text-white cursor-pointer" />
                    <CarouselNext className="static bg-[#A12717] rounded-lg text-white w-10 h-10 border-0 hover:bg-[#8A1F0E] hover:text-white cursor-pointer" />
                </div>
            </Carousel>
        </div>
    );
};

export default BestSellers;
