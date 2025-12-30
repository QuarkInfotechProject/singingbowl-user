import Image from "next/image";

export interface Category {
  id: number | string;
  name: string;
  image?: string;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center mb-3">
        <div className="relative w-[120px] h-[120px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] overflow-hidden rounded-full bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 transition-all duration-300 group-hover:shadow-lg group-hover:border-[#A12717]/30 group-hover:scale-[1.02]">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, 180px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#A12717]/5 to-[#A12717]/15">
              <span className="text-4xl md:text-5xl opacity-40">🎵</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      <h3 className="text-sm md:text-base font-medium text-slate-800 group-hover:text-[#A12717] transition-colors duration-200 line-clamp-2 text-center">
        {category.name}
      </h3>
    </div>
  );
};

export { CategoryCard };

