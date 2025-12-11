import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface Product {
  id: number | string;
  url: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating?: number;
  reviews?: number;
  discount?: string;
  // Add backend fields if they differ
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const hasDiscount = product.originalPrice && product.price !== product.originalPrice;

  return (
    <div className="w-full">
      <Link href={`/products/${product.url}`}>
        <div className="flex flex-col gap-3">
          <div className="w-full w-[200px] h-auto relative">
            <Image
              src={product.image || "/assets/images/product/1.jpg"}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-auto object-cover rounded-xl"
            />
            <div className="absolute top-2 flex w-full items-center justify-between px-3">
              {product.discount && (
                <Badge className="bg-[#802010] text-white">
                  {product.discount}
                </Badge>
              )}
              <div className="p-1 bg-white rounded-full">
                <Heart size={16} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-start justify-start text-start px-4">
            <span className="flex items-center gap-1">
              <p>{product.rating || 4.5}</p>
              <Star className="text-[#FFB30F]" size={16} />
              ({product.reviews || 0})
            </span>
            <b>{product.name}</b>
            <div className="flex items-center gap-2">
              <b className="text-[#39B856]">{product.price}</b>
              {hasDiscount && (
                <span className="text-gray-400 line-through text-sm">
                  {product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
export default ProductCard;

