"use client";

import { useEffect, useState } from "react";
import ProductDetails from "./ProductContent/ProductDetails";
import ReviewsAndRating from "./ReviewSection/ReviewsAndRating";
import { fetchProductSpecification } from "@/lib/apiItems";

interface DetailsSectionProps {
  description?: string;
  additionalDescription?: string;
  slug?: string;
}

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

interface ReviewsData {
  reviews: ProductReview[];
  totalReviews: number;
  averageRating: number;
  ratingPercentages: {
    [key: string]: {
      count: number;
      percentage: number;
    };
  };
}

const DetailsSection = ({
  description,
  additionalDescription,
  slug,
}: DetailsSectionProps) => {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await fetchProductSpecification(slug);
        if (response.data && response.data[0]?.reviews) {
          setReviewsData(response.data[0].reviews);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [slug]);

  return (
    <div id="product-details" className="w-full">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 h-auto">
        <ReviewsAndRating
          reviews={reviewsData?.reviews || []}
          totalReviews={reviewsData?.totalReviews || 0}
          averageRating={reviewsData?.averageRating || 0}
          ratingPercentages={reviewsData?.ratingPercentages}
          isLoading={loading}
        />
        <ProductDetails
          description={description}
          additionalDescription={additionalDescription}
        />
      </div>
    </div>
  );
};

export default DetailsSection;