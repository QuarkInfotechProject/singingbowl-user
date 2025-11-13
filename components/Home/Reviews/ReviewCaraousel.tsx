import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import ReviewCard from "./ReviewCard";

const ReviewCarousel = () => {
  const reviews = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

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
                <ReviewCard />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex gap-3 sm:gap-5 justify-center mt-8 relative w-full">
          <CarouselPrevious className="static bg-[#A12717] rounded-lg text-white w-10 h-10 border-0 hover:bg-[#8A1F0E] hover:text-white cursor-pointer" />
          <CarouselNext className="static bg-[#A12717] rounded-lg text-white w-10 h-10 border-0 hover:bg-[#8A1F0E] hover:text-white cursor-pointer" />
        </div>
      </Carousel>
    </div>
  );
};

export default ReviewCarousel;
