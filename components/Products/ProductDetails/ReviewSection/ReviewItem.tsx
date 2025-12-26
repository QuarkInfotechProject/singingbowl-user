"use client";

import { useState } from "react";
import Image from "next/image";
import StarRating from "./StarRating";

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

interface ReviewItemProps {
  review: ProductReview;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const contentLength = 150;
  const isTruncated = review.comment.length > contentLength;
  const truncatedContent = isTruncated
    ? review.comment.substring(0, contentLength) + "..."
    : review.comment;

  return (
    <>
      <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-400 flex-shrink-0 overflow-hidden">
            {review.profilePicture ? (
              <Image
                src={review.profilePicture}
                alt={`${review.reviewer}'s avatar`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                {review.reviewer.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header with author, date, and rating */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-1 flex-wrap">
                <h3 className="font-semibold text-gray-900">
                  {review.reviewer}
                </h3>
                <span className="text-gray-400">·</span>
                <time className="text-sm text-gray-600">
                  {review.reviewedAt}
                </time>
              </div>
              <StarRating rating={review.rating} />
            </div>

            {/* Review Content */}
            <p className="text-gray-700 text-sm leading-relaxed break-words mb-2">
              {showFullContent ? review.comment : truncatedContent}
            </p>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {review.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-purple-400 transition-colors"
                  >
                    <Image
                      src={image}
                      alt={`Review image ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Read More Button */}
            {isTruncated && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-purple-600 text-sm font-medium hover:text-purple-700 transition"
                aria-expanded={showFullContent}
              >
                {showFullContent ? "Read Less" : "Read More"}
              </button>
            )}

            {/* Owner Reply */}
            {review.reply && (
              <div className="mt-4 ml-4 pl-4 border-l-2 border-purple-200 bg-purple-50 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-medium">
                    Owner
                  </span>
                  {review.repliedAt && (
                    <span className="text-sm text-gray-500">
                      · {review.repliedAt}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 text-sm">{review.reply}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
            <Image
              src={selectedImage}
              alt="Review image"
              width={800}
              height={600}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewItem;
