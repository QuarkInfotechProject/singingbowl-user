import ProductGrid from "./ProductGrid";
import { Product } from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/skeletons";

export interface CategoryData {
  id: number;
  url: string;
  slug?: string;
  name: string;
  image?: string;
  description?: string;
  products?: Product[];
}

interface ProductSectionProps {
  category?: CategoryData;
  isLoading?: boolean;
  allProducts?: Product[];
}

const ProductSection = ({ category, isLoading, allProducts = [] }: ProductSectionProps) => {
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

  // Show all products when no category is selected
  if (!category) {
    return (
      <div className="w-full">
        <div className="w-full flex flex-col gap-4 items-start justify-start text-start">
          <p className="font-bold text-3xl">All Products</p>
          <p>
            Explore our complete collection of handcrafted singing bowls and meditation accessories.
          </p>
          <ProductGrid products={allProducts} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-4 items-start justify-start text-start">
        <p className="font-bold text-3xl">{category.name}</p>
        {category.description ? (
          <div dangerouslySetInnerHTML={{ __html: category.description }} />
        ) : (
          <p>Explore our exclusive collection of {category.name}. Crafted with precision and care, these items represent the finest quality and tradition.</p>
        )}

        <ProductGrid products={category.products || []} />
      </div>
    </div>
  );
}
export default ProductSection