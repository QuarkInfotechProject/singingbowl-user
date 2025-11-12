import Image from "next/image";

interface Category {
  id: number;
  name: string;
  image: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: "Jambati Bowls",
    image: "/assets/images/product/1.jpg",
  },
  {
    id: 2,
    name: "Ceramic Plates",
    image: "/assets/images/product/2.jpg",
  },
  {
    id: 3,
    name: "Glass Cups",
    image: "/assets/images/product/3.jpg",
  },
  {
    id: 4,
    name: "Wooden Spoons",
    image: "/assets/images/product/4.jpg",
  },
  {
    id: 5,
    name: "Steel Cutlery",
    image: "/assets/images/product/5.jpg",
  },
  {
    id: 6,
    name: "Bamboo Trays",
    image: "/assets/images/product/6.jpg",
  },
  {
    id: 7,
    name: "Porcelain Bowls",
    image: "/assets/images/product/1.jpg",
  },
  {
    id: 8,
    name: "Clay Pots",
    image: "/assets/images/product/2.jpg",
  },
  {
    id: 9,
    name: "Stainless Pans",
    image: "/assets/images/product/3.jpg",
  },
  {
    id: 10,
    name: "Marble Tiles",
    image: "/assets/images/product/4.jpg",
  },
  {
    id: 11,
    name: "Granite Counters",
    image: "/assets/images/product/5.jpg",
  },
  {
    id: 12,
    name: "Crystal Vases",
    image: "/assets/images/product/6.jpg",
  },
];

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <div className="w-36 flex flex-col gap-3 items-center justify-center">
      <div className="w-full rounded-full w-36 h-36">
        <Image
          src={category.image}
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

export { CategoryCard, categories };
