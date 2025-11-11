import { Star } from "lucide-react";

const ReviewCard = () => {
  return (
    <div className="w-full flex">
      <div className="w-full flex flex-col rounded-xl bg-[#F9FAFB] gap-10 items-start justify-start p-8 border border-gray-200">
        <div className="flex items-center gap-1 justify-start">
          <Star className="text-yellow-400 w-4 h-4" />
          <Star className="text-yellow-400 w-4 h-4" />
          <Star className="text-yellow-400 w-4 h-4" />
          <Star className="text-yellow-400 w-4 h-4" />
          <Star className="text-yellow-400 w-4 h-4" />
        </div>

        <span className="text-start font-semibold text-lg">
          Really good quality bowls that helped me with mediation and sleep.
          Highly recommended!
        </span>

        <div className="flex flex-col gap-3 items-start justify-start">
          <div className="p-6 bg-gray-600 rounded-full"></div>
          <div className="flex flex-col items-start justify-start">
            <b className="text-md font-bold">User Name</b>
            <p className="text-xs">User title</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ReviewCard