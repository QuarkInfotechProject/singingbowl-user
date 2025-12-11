import ProductCard, { Product } from "./ProductInfo/ProductCard";

interface ProductGridProps {
  title: string;
  products?: Product[];
}

const ProductGrid = ({ title, products = [] }: ProductGridProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex flex-col items-center justify-center gap-10">
        <h2 className="font-bold text-3xl">{title}</h2>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400">No products available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
