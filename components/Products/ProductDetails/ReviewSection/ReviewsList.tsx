
import ReviewItem from "./ReviewItem";

interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  content: string;
  isOwnerReply?: boolean;
}

interface ReviewsListProps {
  reviews: Review[];
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
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </section>
  );
};

export default ReviewsList;
