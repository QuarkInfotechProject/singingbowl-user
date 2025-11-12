"use client";

import  { useState } from "react";
import RatingSection from "./RatingSection";
import ReviewsList from "./ReviewsList";

interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  content: string;
  isOwnerReply?: boolean;
}

interface ReviewsAndRatingProps {
  productName?: string;
  reviews?: Review[];
  onReviewSubmit?: (data: ReviewFormData) => void;
}

interface ReviewFormData {
  rating: number;
  content: string;
  author?: string;
}

// Mock data - replace with API call
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Aspen Siphron",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aspen1",
    date: "22 Jul",
    rating: 5,
    content:
      "It's the place to be if you're looking for authentically singing bowls and sound healing advice. Besides of the very friendly welcome by the owners, you can find there also the best typical metal and wooden statues and original Nepalese souvenirs.",
  },
  {
    id: "2",
    author: "Kali8",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kali8",
    date: "22 Jul",
    rating: 0,
    isOwnerReply: true,
    content: "Glad you liked our product, Keep shopping!",
  },
  {
    id: "3",
    author: "Aspen Siphron",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aspen2",
    date: "22 Jul",
    rating: 5,
    content:
      "We were first-time users of a this service and were quite nervous. Singingbowl village's professionalism and warmth immediately put us at ease. It's the place to be if you're looking for authentically singing bowls and sound healing advice. Besides of the very friendly welcome by the owners, you can find there also the best typical metal and wooden statues and original Nepalese souvenirs.",
  },
  {
    id: "4",
    author: "Aspen Siphron",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aspen3",
    date: "22 Jul",
    rating: 5,
    content:
      "We were first-time users of a this service and were quite nervous. Singingbowl village's professionalism and warmth immediately put us at ease. It's the place to be if you're looking for authentically singing bowls and sound healing advice. Besides of the very friendly welcome by the owners, you can find there also the best typical metal and wooden statues and original Nepalese souvenirs.",
  },
];

const ReviewsAndRating = ({
  productName = "this Singing Bowl",
  reviews = MOCK_REVIEWS,
  onReviewSubmit,
}: ReviewsAndRatingProps) => {
  const [isLoading] = useState(false);

  const handleReviewClick = () => {
    console.log("Opening review form modal");
    // Implement modal or form submission logic
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Reviews and Rating
        </h1>

        {/* Rating Section */}
        <RatingSection
          productName={productName}
          onReviewClick={handleReviewClick}
        />
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
