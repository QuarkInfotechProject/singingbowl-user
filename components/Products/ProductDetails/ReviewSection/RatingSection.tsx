"use client";

import  { useState } from "react";
import StarRating from "./StarRating";

interface RatingSectionProps {
  productName?: string;
  onReviewClick?: () => void;
}

const RatingSection = ({
  productName = "this product",
  onReviewClick,
}: RatingSectionProps) => {
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleReviewClick = () => {
    onReviewClick?.();
  };

  return (
    <section className="bg-gray-100 rounded-lg p-5 mb-8">
      <p className="text-gray-700 text-sm font-medium mb-4">
        Rate {productName} and tell others what you think
      </p>

      <div className="flex justify-between items-center">
        <div onMouseLeave={() => setHoveredRating(0)}>
          <StarRating
            rating={hoveredRating}
            onRate={setHoveredRating}
            interactive={true}
            size={24}
          />
        </div>

        <button
          onClick={handleReviewClick}
          className="text-purple-600 font-medium hover:text-purple-700 transition text-sm"
        >
          Write A Review
        </button>
      </div>
    </section>
  );
};

export default RatingSection;
