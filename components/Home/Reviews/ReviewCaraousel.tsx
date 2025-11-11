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
    <div className="w-full px-4 py-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {reviews.map((review) => (
            <CarouselItem
              key={review.id}
              className="pl-2 md:pl-4 md:basis-1/3 basis-full"
            >
              <ReviewCard />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex gap-5 justify-center mt-8  absolute left-1/2 -translate-x-1/2">
          <CarouselPrevious className=" bg-[#A12717] rounded-lg text-white w-10 h-10 border-0 hover:bg-[#8A1F0E] hover:text-white cursor-pointer" />
          <CarouselNext className="bg-[#A12717] rounded-lg text-white w-10 h-10 border-0 hover:bg-[#8A1F0E] hover:text-white cursor-pointer" />
        </div>
      </Carousel>
    </div>
  );
};

export default ReviewCarousel;
