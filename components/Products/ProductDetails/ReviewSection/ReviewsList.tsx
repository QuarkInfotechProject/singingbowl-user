import ReviewItem from "./ReviewItem";

interface ProductReview {
  reviewer: string;
  profilePicture: string | null;
  reviewedAt: string;
  rating: number;
  comment: string;
  reply: string | null;
  repliedAt: string | null;
  images: string[];
}

interface ReviewsListProps {
  reviews: ProductReview[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

const ReviewsList = ({
  reviews,
  isLoading = false,
  isEmpty = false,
}: ReviewsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (isEmpty || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="sr-only">Customer Reviews</h2>
      {reviews.map((review, index) => (
        <ReviewItem key={index} review={review} />
      ))}
    </section>
  );
};

export default ReviewsList;
