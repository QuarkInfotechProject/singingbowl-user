import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CategoryCard, Category } from "./CategoryCard";

import { CategoryCarouselSkeleton } from "@/components/ui/skeletons";

interface CategoryCarouselProps {
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
  isLoading?: boolean;
}

const CategoryCarousel = ({
  categories,
  onSelectCategory,
  isLoading = false,
}: CategoryCarouselProps) => {
  if (isLoading) {
    return (
      <div className="w-full">
        <CategoryCarouselSkeleton />
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {categories.map((category) => (
          <CarouselItem
            key={category.id}
            className="pl-2 md:pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
            onClick={() => onSelectCategory && onSelectCategory(category)}
          >
            <div className="cursor-pointer">
              <CategoryCard category={category} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex text-white hover:text-white rounded-md bg-[#A12717] w-8 h-12 hover:bg-[#A12717] cursor-pointer" />
      <CarouselNext className="hidden md:flex text-white hover:text-white rounded-md bg-[#A12717] w-8 h-12 hover:bg-[#A12717] cursor-pointer" />
    </Carousel>
  );
};

export default CategoryCarousel;
