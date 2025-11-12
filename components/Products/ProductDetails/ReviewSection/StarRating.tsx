import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  size?: number;
}

const StarRating= ({
  rating,
  onRate,
  interactive = false,
  size = 20,
}: StarRatingProps) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate?.(star)}
          disabled={!interactive}
          className={
            interactive
              ? "cursor-pointer hover:scale-110 transition"
              : "cursor-default"
          }
          aria-label={`${star} stars`}
        >
          <Star
            size={size}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
