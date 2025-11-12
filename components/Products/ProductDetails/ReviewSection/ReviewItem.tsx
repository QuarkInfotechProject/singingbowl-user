"use client";

import  { useState } from "react";
import StarRating from "./StarRating";

interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  content: string;
  isOwnerReply?: boolean;
}

interface ReviewItemProps {
  review: Review;
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const contentLength = 150;
  const isTruncated = review.content.length > contentLength;
  const truncatedContent = isTruncated
    ? review.content.substring(0, contentLength) + "..."
    : review.content;

  return (
    <div
      className={`border-b border-gray-200 pb-6 mb-6 last:border-b-0 ${
        review.isOwnerReply ? "ml-14" : ""
      }`}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <img
          src={review.avatar}
          alt={`${review.author}'s avatar`}
          className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 object-cover"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with author, date, and rating */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex items-center gap-1 flex-wrap">
              <h3 className="font-semibold text-gray-900">{review.author}</h3>
              <span className="text-gray-400">·</span>
              <time className="text-sm text-gray-600">{review.date}</time>
              {review.isOwnerReply && (
                <>
                  <span className="text-gray-400">·</span>
                  <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-medium">
                    Owner
                  </span>
                </>
              )}
            </div>
            {!review.isOwnerReply && <StarRating rating={review.rating} />}
          </div>

          {/* Review Content */}
          <p className="text-gray-700 text-sm leading-relaxed break-words mb-2">
            {showFullContent ? review.content : truncatedContent}
          </p>

          {/* Read More / Reply Button */}
          <div className="flex gap-4">
            {isTruncated && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-purple-600 text-sm font-medium hover:text-purple-700 transition"
                aria-expanded={showFullContent}
              >
                {showFullContent ? "Read Less" : "Read More"}
              </button>
            )}

            {review.isOwnerReply && (
              <button className="text-purple-600 text-sm font-medium hover:text-purple-700 transition">
                Reply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
