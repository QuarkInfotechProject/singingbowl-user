"use client";

import { Star } from "lucide-react";
import Image from "next/image";

interface ReviewCardProps {
  name: string;
  rating: number;
  comment: string;
  profilePicture: string | null;
  productName?: string;
  timeAgo?: string;
}

const ReviewCard = ({
  name,
  rating,
  comment,
  profilePicture,
  productName,
  timeAgo,
}: ReviewCardProps) => {
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
            }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col rounded-xl bg-[#F9FAFB] gap-4 sm:gap-6 md:gap-10 items-start justify-start p-4 sm:p-6 md:p-4 border border-gray-200 min-w-0 min-h-[280px]">
        <div className="flex items-center gap-1 justify-start flex-shrink-0">
          {renderStars()}
        </div>

        <span className="text-start font-semibold text-sm sm:text-base md:text-lg leading-relaxed break-words w-full line-clamp-4">
          {comment}
        </span>

        <div className="flex flex-col gap-3 items-start justify-start w-full min-w-0 mt-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex-shrink-0 overflow-hidden bg-gray-400">
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt={name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col items-start justify-start min-w-0">
            <b className="text-xs sm:text-sm md:text-md font-bold truncate">
              {name}
            </b>
            {productName && (
              <p className="text-xs text-gray-600 truncate">on {productName}</p>
            )}
            {timeAgo && <p className="text-xs text-gray-500">{timeAgo}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
