import BlogGrid from "@/components/Home/Blogs/BlogGrid";
import ProductFeatures from "@/components/Home/Features/ProductFeatures";
import SingingBowlComponent from "@/components/Home/HandCrafted/index";
import HeroSection from "@/components/Home/Hero/HeroSection";
import ProductCollection from "@/components/Home/Product/ProductCollection";
import CustomerReviews from "@/components/Home/Reviews/CustomerReviews";
import WhySingingBowl from "@/components/Home/Why";

const Home = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-12">
        <HeroSection />
        <div className="flex flex-col items-center">
          <ProductFeatures />
          <ProductCollection />
          <SingingBowlComponent />
          <WhySingingBowl />
          <CustomerReviews />
        </div>
        <BlogGrid />
      </div>
    </div>
  );
}
export default Home