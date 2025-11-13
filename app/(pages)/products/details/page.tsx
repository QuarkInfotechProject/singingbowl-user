import ProductGrid from "@/components/Products/ProductGrid";
import DetailBreadCrumbs from "@/components/Products/ProductDetails/DetailBreadCrumbs";
import IconCard from "@/components/Products/ProductDetails/IconCard";
import ProductHeroSection from "@/components/Products/ProductDetails/ProductHeroSection";
import DetailsSection from "@/components/Products/ProductDetails/DetailsSection";

const ProductDetail = () => {
  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-12 py-6">
        <div className="px-4 md:px-26 mx-auto w-full flex flex-col gap-12">
          <DetailBreadCrumbs />
          <ProductHeroSection />
        </div>
        <IconCard />
        <div className="px-4 md:px-26 mx-auto w-full flex flex-col gap-12">
          <ProductGrid title="You Might also like" />
          <DetailsSection />
          <ProductGrid title="Recently Viewed" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
