import ProductCard from "./ProductInfo/ProductCard";

interface ProductGridProps {
  title: string;
}

const ProductGrid = ({ title }: ProductGridProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex flex-col items-center justify-center gap-10">
        <h2 className="font-bold text-3xl">{title}</h2>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
