import { Star } from "lucide-react";

const ReviewCard = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col rounded-xl bg-[#F9FAFB] gap-4 sm:gap-6 md:gap-10 items-start justify-start p-3 sm:p-6 md:p-8 border border-gray-200 min-w-0">
        <div className="flex items-center gap-1 justify-start flex-shrink-0">
          <Star className="text-yellow-400 w-4 h-4" />
          <Star className="text-yellow-400 w-4 h-4" />
          <Star className="text-yellow-400 w-4 h-4" />
          <Star className="text-yellow-400 w-4 h-4" />
          <Star className="text-yellow-400 w-4 h-4" />
        </div>

        <span className="text-start font-semibold text-sm sm:text-base md:text-lg leading-relaxed break-words w-full">
          Really good quality bowls that helped me with mediation and sleep.
          Highly recommended!
        </span>

        <div className="flex flex-col gap-3 items-start justify-start w-full min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-600 rounded-full flex-shrink-0"></div>
          <div className="flex flex-col items-start justify-start min-w-0">
            <b className="text-xs sm:text-sm md:text-md font-bold truncate">
              User Name
            </b>
            <p className="text-xs truncate">User title</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewCard;
