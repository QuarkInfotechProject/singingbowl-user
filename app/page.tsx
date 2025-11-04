import ProductFeatures from "@/components/Home/Features/ProductFeatures";
import HeroSection from "@/components/Home/Hero/HeroSection";

const Home = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-12">
        <HeroSection />
        <ProductFeatures />
      </div>
    </div>
  );
}
export default Home