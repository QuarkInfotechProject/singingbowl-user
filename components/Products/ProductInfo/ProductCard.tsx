import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import Image from "next/image";

const ProductCard = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-3">
        <div className="w-full w-[200px] h-auto relative">
          <Image
            src="/assets/images/product/1.jpg"
            alt="Jambati Bowl"
            width={200}
            height={200}
            className="w-full h-auto object-cover rounded-xl"
          />
          <div className="absolute top-2 flex w-full items-center justify-between px-3">
            <Badge className="bg-[#802010] text-white">50% off</Badge>
            <div className="p-1 bg-white rounded-full">
              <Heart size={16} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-start justify-start text-start px-4">
          <span className="flex items-center gap-1">
            <p>4.7</p>
            <Star className="text-[#FFB30F]" size={16} />
            (12.2K)
          </span>
          <b>Jambati Bowls</b>
          <b className="text-[#39B856]">$ 115,000</b>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
