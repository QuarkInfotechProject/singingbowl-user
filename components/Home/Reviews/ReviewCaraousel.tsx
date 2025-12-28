"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import ReviewCard from "./ReviewCard";
import { fetchReviews } from "@/lib/apiItems";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  profilePicture: string | null;
  productName: string;
  productSlug: string;
  productId: string;
  reviewedAt: string;
  timeAgo: string;
}

const ReviewCarousel = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const response = await fetchReviews();
        if (response.success && response.data) {
          setReviews(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Skeleton loader for loading state
  if (loading) {
    return (
      <div className="w-full overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col rounded-xl bg-[#F9FAFB] gap-4 p-6 border border-gray-200 animate-pulse min-h-[280px]"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="w-4 h-4 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && (!reviews || reviews.length === 0)) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0 sm:-ml-2 md:-ml-4">
          {reviews.map((review) => (
            <CarouselItem
              key={review.id}
              className="pl-0 sm:pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3"
            >
              <div className="px-2 sm:px-0">
                <ReviewCard
                  name={review.name}
                  rating={review.rating}
                  comment={review.comment}
                  profilePicture={review.profilePicture}
                  productName={review.productName}
                  timeAgo={review.timeAgo}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex gap-3 sm:gap-5 justify-center mt-8 relative w-full">
          <CarouselPrevious className="static bg-[#A12717] rounded-lg text-xl text-white w-8 h-8 border-0 hover:bg-[#8A1F0E] hover:text-white cursor-pointer" />
          <CarouselNext className="static bg-[#A12717] rounded-lg text-xl text-white w-8 h-8 border-0 hover:bg-[#8A1F0E] hover:text-white cursor-pointer" />
        </div>
      </Carousel>
    </div>
  );
};

export default ReviewCarousel;
