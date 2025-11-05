import ProductFeatures from "@/components/Home/Features/ProductFeatures";
import HeroSection from "@/components/Home/Hero/HeroSection";
import ProductCollection from "@/components/Home/Product/ProductCollection";

const Home = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-12">
        <HeroSection />
        <div className="flex flex-col items-center">
          <ProductFeatures />
          <ProductCollection />
        </div>
      </div>
    </div>
  );
}
export default Home