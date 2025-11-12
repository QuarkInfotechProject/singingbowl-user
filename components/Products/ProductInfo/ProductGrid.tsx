import ProductCard from "@/components/Products/ProductInfo/ProductCard"
import { Button } from "@/components/ui/button";

const ProductGrid = () => {
  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center">
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
      <Button className="mx-auto mt-6 bg-[#802010] rounded-full">Load More</Button>
    </div>
  );
}
export default ProductGrid