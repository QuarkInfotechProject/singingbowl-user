"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductGrid from "@/components/Products/ProductGrid";
import BreadCrumbs from "@/components/Products/Breadcrumbs";
import CategoryCaraousel from "@/components/Products/Category/CategoryCaraousel";
import Find from "@/components/Products/Find";
import ProductSection, { CategoryData } from "@/components/Products/ProductInfo/ProductSection";
import { fetchProductsByCategory, fetchCategories } from "@/lib/apiItems";
import { ChevronDown } from "lucide-react";

// Category filter sidebar component
interface CategoryFilterProps {
  categories: CategoryData[];
  selectedCategoryId: number | string | undefined;
  onCategorySelect: (category: CategoryData | undefined) => void;
}

const CategoryFilter = ({ categories, selectedCategoryId, onCategorySelect }: CategoryFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <span className="font-semibold text-gray-900">Filters</span>
      </div>

      {/* Category Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900">Category</span>
          <ChevronDown
            size={20}
            className={`text-gray-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-2">
            {/* All Products Option */}
            <button
              onClick={() => onCategorySelect(undefined)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${!selectedCategoryId
                ? "bg-[#A12717] text-white font-medium"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              All Products
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${selectedCategoryId === category.id
                  ? "bg-[#A12717] text-white font-medium"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main product content wrapped in Suspense for useSearchParams
const ProductContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFromUrl = searchParams.get("category");

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
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
          image: cat.products?.[0]?.baseImage || "/assets/images/product/1.jpg",
          products: Array.isArray(cat.products) ? cat.products.map((prod: any) => ({
            id: prod.id,
            url: prod.url,
            name: prod.productName,
            price: prod.specialPrice || prod.originalPrice,
            originalPrice: prod.specialPrice ? prod.originalPrice : undefined,
            image: prod.baseImage,
            rating: prod.rating || 0,
            reviews: prod.reviewCount || 0,
            discount: prod.specialPrice ? "On Sale" : undefined,
            inStock: prod.inStock,
          })) : [],
        }));

        setCategories(mappedCategories);

        // Auto-select category from URL if present
        if (categoryFromUrl && mappedCategories.length > 0) {
          const categoryFromUrlLower = categoryFromUrl.toLowerCase();
          const matchingCategory = mappedCategories.find(
            (cat) =>
              cat.url === categoryFromUrl ||
              cat.url?.toLowerCase() === categoryFromUrlLower ||
              cat.name?.toLowerCase() === categoryFromUrlLower ||
              cat.name?.toLowerCase().replace(/\s+/g, '-') === categoryFromUrlLower ||
              String(cat.id) === categoryFromUrl
          );
          if (matchingCategory) {
            setSelectedCategory(matchingCategory);
          } else {
            // If URL category doesn't match, show all products
            setSelectedCategory(undefined);
          }
        } else if (mappedCategories.length > 0) {
          // No category in URL, show all products initially
          setSelectedCategory(undefined);
        }
      } catch (err) {
        console.error("Failed to load products", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryFromUrl]);

  const handleSelectCategory = (category: CategoryData | undefined) => {
    setSelectedCategory(category);

    // Update URL with selected category
    if (category?.url) {
      router.push(`/products?category=${category.url}`, { scroll: false });
    } else {
      router.push("/products", { scroll: false });
    }
  };

  // Get products to display
  const productsToDisplay = selectedCategory?.products || categories.flatMap((cat) => cat.products || []);

  return (
    <div className="px-4 md:px-26 mx-auto w-full">
      <div className="w-full flex flex-col gap-12 py-6">
        <BreadCrumbs />

        {/* Category Carousel */}
        <CategoryCaraousel
          categories={categories}
          onSelectCategory={(cat) => handleSelectCategory(cat as CategoryData)}
          isLoading={loading}
        />

        <div className="flex items-start justify-start gap-8">
          {/* Sidebar Filter */}
          <div className="hidden md:flex w-1/5 sticky top-8">
            <CategoryFilter
              categories={categories}
              selectedCategoryId={selectedCategory?.id}
              onCategorySelect={handleSelectCategory}
            />
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-[80%] flex flex-col gap-4 bg-white rounded-lg">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <ProductSection category={selectedCategory} isLoading={loading} allProducts={productsToDisplay} />
            )}
          </div>
        </div>

        <Find />
        <ProductGrid title="Our Best Sellers Product" products={productsToDisplay.slice(0, 5)} />
      </div>
    </div>
  );
};

const Product = () => {
  return (
    <Suspense fallback={
      <div className="px-4 md:px-26 mx-auto w-full">
        <div className="w-full flex flex-col gap-12 py-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-36 h-40 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="flex gap-8">
            <div className="hidden md:block w-1/5 h-96 bg-gray-200 rounded animate-pulse" />
            <div className="w-full md:w-4/5 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductContent />
    </Suspense>
  );
};

export default Product;
