"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/Products/ProductGrid";
import BreadCrumbs from "@/components/Products/Breadcrumbs";
import CategoryCaraousel from "@/components/Products/Category/CategoryCaraousel";
import FilterSection from "@/components/Products/Category/CategoryFilterSection";
import { FILTER_DATA } from "@/components/Products/filterData";
import Find from "@/components/Products/Find";
import ProductSection, { CategoryData } from "@/components/Products/ProductInfo/ProductSection";
import { FilterState } from "@/types/filter.types";
import { fetchProductsByCategory } from "@/lib/apiItems";

const Product = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  // error state definition
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response: any = await fetchProductsByCategory();

        const rawData = response.data || response;
        const categoryListRaw = Array.isArray(rawData) ? rawData : [];

        // Map API data to UI interfaces
        const mappedCategories: CategoryData[] = categoryListRaw.map((cat: any) => ({
          id: cat.id,
          url: cat.url,
          name: cat.name,
          // Use first product image as category image fallback or default
          image: cat.products?.[0]?.baseImage || "/assets/images/product/1.jpg",
          products: Array.isArray(cat.products) ? cat.products.map((prod: any) => ({
            id: prod.id, // String UUID
            url: prod.url,
            name: prod.productName,
            // If special price exists, show it as main price and original as strikethrough
            price: prod.specialPrice || prod.originalPrice,
            originalPrice: prod.specialPrice ? prod.originalPrice : undefined,
            image: prod.baseImage,
            rating: prod.rating || 0,
            reviews: prod.reviewCount || 0,
            discount: prod.specialPrice ? "On Sale" : undefined,
          })) : [],
        }));


        setCategories(mappedCategories);
        if (mappedCategories.length > 0) {
          setSelectedCategory(mappedCategories[0]);
        }
      } catch (err) {
        console.error("Failed to load products", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = (filters: FilterState) => {
    console.log("Applied filters:", filters);
    // Logic to filter products could go here, or trigger new API call
  };

  const handleSelectCategory = (category: CategoryData) => {
    setSelectedCategory(category);
  }

  // Construct dynamic filters based on fetched categories
  const dynamicFilters = [
    {
      id: "category",
      title: "Category",
      options: categories.map((c) => ({ id: String(c.id), label: c.name })),
    },
    ...FILTER_DATA.filter((f) => f.id !== "category"),
  ];

  return (
    <div className="px-4 md:px-26 mx-auto w-full">
      <div className="w-full flex flex-col gap-12 py-6">
        <BreadCrumbs />

        {/* Pass fetched categories and handler */}
        <CategoryCaraousel
          categories={categories}
          onSelectCategory={handleSelectCategory as any}
          isLoading={loading}
        />

        <div className="flex items-start justify-start gap-8">
          <div className="hidden md:flex w-1/5 sticky top-8">
            <FilterSection
              categories={dynamicFilters}
              resultsCount={selectedCategory?.products?.length || 0}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="w-full md:w-[80%] flex flex-col gap-4 bg-white rounded-lg">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <ProductSection category={selectedCategory} isLoading={loading} />
            )}
          </div>
        </div>

        <Find />
        {/* Helper grid at bottom could be "Best Sellers" - keeping static or using subset */}
        <ProductGrid title="Our Best Sellers Product" products={selectedCategory?.products?.slice(0, 5) || []} />
      </div>
    </div>
  );
};

export default Product;
