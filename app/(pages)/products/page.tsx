"use client";

import ProductGrid from "@/components/Products/ProductGrid";
import BreadCrumbs from "@/components/Products/Breadcrumbs";
import CategoryCaraousel from "@/components/Products/Category/CategoryCaraousel";
import FilterSection from "@/components/Products/Category/CategoryFilterSection";
import { FILTER_DATA } from "@/components/Products/filterData";
import Find from "@/components/Products/Find";
import ProductSection from "@/components/Products/ProductInfo/ProductSection";
import { FilterState } from "@/types/filter.types";

const Product = () => {
  const handleFilterChange = (filters: FilterState) => {
    console.log("Applied filters:", filters);
  };

  return (
    <div className="px-4 md:px-26 mx-auto w-full">
      <div className="w-full flex flex-col gap-12 py-6">
        <BreadCrumbs />
        <CategoryCaraousel />

        <div className="flex items-start justify-start gap-8">
          <div className="hidden md:flex w-1/5 sticky top-8">
            <FilterSection
              categories={FILTER_DATA}
              resultsCount={245}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="w-full md:w-[80%] flex flex-col gap-4 bg-white rounded-lg">
            <ProductSection />
          </div>
        </div>

        <Find />
        <ProductGrid title="Our Best Sellers Product" />
      </div>
    </div>
  );
};

export default Product;
