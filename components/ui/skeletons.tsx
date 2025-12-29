"use client";

// Product Card Skeleton for carousel/grid
export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 items-center justify-start w-full animate-pulse">
            {/* Image skeleton - circular */}
            <div className="w-full max-w-[100px] sm:max-w-[160px] md:max-w-[210px] aspect-square rounded-full bg-gray-200" />
            {/* Text skeletons */}
            <div className="w-3/4 h-4 bg-gray-200 rounded mt-2" />
            <div className="w-1/2 h-3 bg-gray-200 rounded" />
        </div>
    );
}

// Product Carousel Skeleton
export function ProductCarouselSkeleton() {
    return (
        <div className="w-full">
            <div className="flex gap-4 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="basis-1/2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4 flex-shrink-0">
                        <ProductCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Product Grid Skeleton for product list page
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    {/* Image skeleton - rectangular */}
                    <div className="w-full aspect-square bg-gray-200 rounded-lg" />
                    {/* Text skeletons */}
                    <div className="mt-3 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Category Carousel Skeleton
export function CategoryCarouselSkeleton() {
    return (
        <div className="w-full flex gap-4 overflow-hidden animate-pulse">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 flex-shrink-0">
                    <div className="w-36 h-36 rounded-full bg-gray-200" />
                    <div className="w-20 h-4 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    );
}

// Filter Section Skeleton
export function FilterSectionSkeleton() {
    return (
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse h-[80vh]">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
            <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded w-full" />
                ))}
            </div>
        </div>
    );
}

// Product List Page Full Skeleton
export function ProductListSkeleton() {
    return (
        <div className="w-full flex flex-col gap-12 py-6 animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="flex gap-2">
                <div className="h-4 bg-gray-200 rounded w-12" />
                <div className="h-4 bg-gray-200 rounded w-4" />
                <div className="h-4 bg-gray-200 rounded w-20" />
            </div>

            {/* Category carousel skeleton */}
            <CategoryCarouselSkeleton />

            <div className="flex items-start justify-start gap-8">
                {/* Filter sidebar skeleton - hidden on mobile */}
                <div className="hidden md:flex w-1/5">
                    <FilterSectionSkeleton />
                </div>

                {/* Product grid skeleton */}
                <div className="w-full md:w-[80%]">
                    <div className="mb-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                    <ProductGridSkeleton count={8} />
                </div>
            </div>
        </div>
    );
}

// Product Detail Page Skeleton
export function ProductDetailSkeleton() {
    return (
        <div className="w-full animate-pulse">
            <div className="w-full flex flex-col gap-12 py-6">
                <div className="px-4 md:px-8 xl:px-12 max-w-[1440px] mx-auto w-full flex flex-col gap-12">
                    {/* Breadcrumb skeleton */}
                    <div className="flex gap-2">
                        <div className="h-4 bg-gray-200 rounded w-12" />
                        <div className="h-4 bg-gray-200 rounded w-4" />
                        <div className="h-4 bg-gray-200 rounded w-20" />
                        <div className="h-4 bg-gray-200 rounded w-4" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>

                    {/* Hero section skeleton */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image section */}
                        <div className="flex flex-col gap-4">
                            <div className="w-full h-[400px] md:h-[500px] bg-gray-200 rounded-lg" />
                            {/* Thumbnails */}
                            <div className="flex gap-2 justify-center">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Info section */}
                        <div className="flex flex-col gap-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4" />
                            <div className="h-6 bg-gray-200 rounded w-1/4" />
                            <div className="flex gap-2">
                                <div className="h-4 bg-gray-200 rounded w-20" />
                                <div className="h-4 bg-gray-200 rounded w-16" />
                            </div>
                            <div className="space-y-2 mt-4">
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <div className="h-12 bg-gray-200 rounded w-32" />
                                <div className="h-12 bg-gray-200 rounded w-32" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Icon cards skeleton */}
                <div className="w-full bg-gray-100 py-6">
                    <div className="flex justify-center gap-8 overflow-hidden">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                                <div className="w-16 h-3 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related products skeleton */}
                <div className="px-4 md:px-8 xl:px-12 max-w-[1440px] mx-auto w-full">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
                    <ProductGridSkeleton count={4} />
                </div>
            </div>
        </div>
    );
}
