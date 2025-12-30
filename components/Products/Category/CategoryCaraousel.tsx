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
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {categories.map((category) => (
          <CarouselItem
            key={category.id}
            className="basis-2/5 md:basis-1/3 lg:basis-1/4 xl:basis-[15%] pl-4"
          >
            <div
              className="group cursor-pointer"
              onClick={() => onSelectCategory && onSelectCategory(category)}
            >
              <CategoryCard category={category} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Navigation buttons - matching ProductCollection style */}
      <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 bg-white/90 hover:bg-white border-slate-200 hover:border-[#A12717]/30 shadow-md" />
      <CarouselNext className="hidden md:flex -right-4 lg:-right-6 bg-white/90 hover:bg-white border-slate-200 hover:border-[#A12717]/30 shadow-md" />
    </Carousel>
  );
};

export default CategoryCarousel;

