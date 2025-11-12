import ReviewsAndRating from "./ReviewSection/ReviewsAndRating"

const DetailsSection = () => {
  return (
    <div className="w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12">
            <ReviewsAndRating />
            <div></div>
        </div>
    </div>
  )
}
export default DetailsSection