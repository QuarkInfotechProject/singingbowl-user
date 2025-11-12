import ProductCard from "./ProductInfo/ProductCard";

const BestSeller = () => {
  return (
    <div className="w-full mb-8">
      <div className="flex flex-col items-center justify-center gap-6">
        <h2 className="font-bold text-3xl">Our Best Sellers Product</h2>
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
}
export default BestSeller