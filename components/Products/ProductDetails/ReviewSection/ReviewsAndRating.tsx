"use client";

import ReviewsList from "./ReviewsList";

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

interface RatingPercentage {
  count: number;
  percentage: number;
}

interface ReviewsAndRatingProps {
  reviews?: ProductReview[];
  totalReviews?: number;
  averageRating?: number;
  ratingPercentages?: { [key: string]: RatingPercentage };
  isLoading?: boolean;
}

const ReviewsAndRating = ({
  reviews = [],
  totalReviews = 0,
  averageRating = 0,
  ratingPercentages,
  isLoading = false,
}: ReviewsAndRatingProps) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reviews and Rating
        </h1>
        {totalReviews > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                    }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-500">({totalReviews} reviews)</span>
          </div>
        )}

        {/* Rating Breakdown */}
        {ratingPercentages && totalReviews > 0 && (
          <div className="space-y-2 mb-6">
            {[5, 4, 3, 2, 1].map((rating) => {
              const data = ratingPercentages[String(rating)] || {
                count: 0,
                percentage: 0,
              };
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-12">
                    {rating} star
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">
                    {data.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </header>

      {/* Reviews List */}
      <ReviewsList
        reviews={reviews}
        isLoading={isLoading}
        isEmpty={reviews.length === 0}
      />
    </div>
  );
};

export default ReviewsAndRating;
