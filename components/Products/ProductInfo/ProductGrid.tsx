import ProductCard, { Product } from "@/components/Products/ProductInfo/ProductCard"
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  title?: string;
  products?: Product[];
}

const ProductGrid = ({ title, products = [] }: ProductGridProps) => {
  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.url} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found.</p>
        )}
      </div>
      {products.length > 0 && <Button className="mx-auto mt-6 bg-[#802010] rounded-full">Load More</Button>}
    </div>
  );
}
export default ProductGrid