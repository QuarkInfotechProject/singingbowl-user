import SectionTitle from "../SectionTitle";
import ReviewCarousel from "./ReviewCaraousel";

const CustomerReviews = () => {
  return (
    <div className="w-[100vw] overflow-hidden">
      <div className="flex flex-col gap-6 sm:gap-10 md:gap-12 lg:gap-16 items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 py-8 md:py-12">
        <div className="w-[100vw] flex flex-col gap-8 text-center">
          <SectionTitle title="What Our Customers Say" />
          <ReviewCarousel />
        </div>
      </div>
    </div>
  );
};
export default CustomerReviews;
