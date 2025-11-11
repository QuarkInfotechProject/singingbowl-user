import SectionTitle from "../SectionTitle"
import ReviewCaraousel from "./ReviewCaraousel";

const CustomerReviews = () => {
  return (
    <div className="flex flex-col gap-10 sm:gap-10 md:gap-12 lg:gap-18 items-center justify-center px-3 sm:px-6 md:px-10 lg:px-20 py-8 md:py-12 w-full">
      <div className="w-full flex flex-col gap-10 text-center">
        <SectionTitle title="What Our Customers Say" />
        <ReviewCaraousel />
      </div>
    </div>
  );
}
export default CustomerReviews