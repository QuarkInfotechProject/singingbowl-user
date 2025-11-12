import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CategoryCard, categories } from "./CategoryCard";

const CategoryCarousel = () => {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {categories.map((category) => (
          <CarouselItem
            key={category.id}
            className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
          >
            <CategoryCard category={category} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="text-white hover:text-white rounded-md bg-[#A12717] w-8 h-12 hover:bg-[#A12717] cursor-pointer" />
      <CarouselNext className="text-white hover:text-white rounded-md bg-[#A12717] w-8 h-12 hover:bg-[#A12717] cursor-pointer" />
    </Carousel>
  );
};

export default CategoryCarousel;
