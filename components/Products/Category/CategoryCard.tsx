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
    <div className="w-36 flex flex-col gap-3 items-center justify-center">
      <div className="w-full rounded-full w-36 h-36">
        <Image
          src={category.image || "/assets/images/product/1.jpg"}
          alt={category.name}
          width={160}
          height={160}
          className="rounded-full w-36 h-36 object-cover"
        />
      </div>
      <div className="w-full text-center">
        <h3 className="text-md font-semibold">{category.name}</h3>
      </div>
    </div>
  );
};

export { CategoryCard };
