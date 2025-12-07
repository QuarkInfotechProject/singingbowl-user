import ProductGrid from "./ProductGrid";
import { Product } from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/skeletons";

export interface CategoryData {
  id: number;
  url: string;
  name: string;
  image?: string;
  description?: string;
  products?: Product[];
}

interface ProductSectionProps {
  category?: CategoryData;
  isLoading?: boolean;
}

const ProductSection = ({ category, isLoading }: ProductSectionProps) => {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="w-full flex flex-col gap-4 items-start justify-start text-start">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-gray-500">Select a category to view products.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-4 items-start justify-start text-start">
        <p className="font-bold text-3xl">{category.name}</p>
        <p>
          {category.description || `Explore our exclusive collection of ${category.name}. Crafted with precision and care, these items represent the finest quality and tradition.`}
        </p>

        <ProductGrid products={category.products || []} />
      </div>
    </div>
  );
}
export default ProductSection