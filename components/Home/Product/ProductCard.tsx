import Image from "next/image";
import { Product } from "./data";
import { Button } from "@/components/ui/button";

interface ProductCardProps extends Product {}

const ProductCard = ({ id, name, description, image }: ProductCardProps) => {
  return (
    <div className="flex-shrink-0 w-full">
      <div className="flex flex-col gap-3 items-center justify-center">
        {/* Product Image Container */}
        <div className="relative">
          <div className="w-[210px] h-[210px] rounded-full overflow-hidden border border-gray-300">
            <Image
              src={image}
              alt={name}
              width={210}
              height={210}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hover Overlay - Only on Image */}
          <div className="absolute inset-0 rounded-full cursor-pointer bg-[#D9D9D9]/70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
            <Button className="px-6 py-2 bg-[#A12717] text-white cursor-pointer font-semibold rounded-full hover:bg-[#A12717] transition-colors shadow-lg">
              Buy Now
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-2 items-center">
          <h3 className="font-semibold text-2xl text-black">{name}</h3>
          <p className="text-gray-600 text-base">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
