import ProductDetails from "./ProductContent/ProductDetails"
import ReviewsAndRating from "./ReviewSection/ReviewsAndRating"

interface DetailsSectionProps {
  description?: string;
  additionalDescription?: string;
}

const DetailsSection = ({ description, additionalDescription }: DetailsSectionProps) => {
  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 h-auto">
        <ReviewsAndRating />
        <ProductDetails description={description} additionalDescription={additionalDescription} />
      </div>
    </div>
  )
}
export default DetailsSection