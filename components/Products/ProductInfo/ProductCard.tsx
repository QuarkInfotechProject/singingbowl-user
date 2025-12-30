"use client";

import { Badge } from "@/components/ui/badge";
import { Heart, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export interface Product {
  id: number | string;
  uuid?: string;
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
  inStock?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const hasDiscount = product.originalPrice && product.price !== product.originalPrice;
  const { isInWishlist, toggleWishlist, loadingProductId } = useWishlist();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const productId = product.uuid || String(product.id);
  const inWishlist = isInWishlist(productId);
  const isToggling = loadingProductId === productId;

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    await toggleWishlist(productId);
  };

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
              className={`w-full h-[200px] object-cover rounded-xl ${product.inStock === false ? "opacity-50 grayscale" : ""}`}
            />
            {product.inStock === false && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Badge className="bg-gray-900 text-white hover:bg-gray-900">Out of Stock</Badge>
              </div>
            )}
            <div className="absolute top-2 flex w-full items-center justify-between px-3">
              {product.discount && (
                <Badge className="bg-[#802010] text-white">
                  {product.discount}
                </Badge>
              )}
              <button
                onClick={handleWishlistClick}
                disabled={isToggling}
                className="p-1 bg-white rounded-full hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50 ml-auto"
              >
                {isToggling ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Heart
                    size={16}
                    className={inWishlist ? "fill-red-500 text-red-500" : ""}
                  />
                )}
              </button>
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
              <b className="text-[#39B856]">${product.price}</b>
              {hasDiscount && (
                <span className="text-gray-400 line-through text-sm">
                  $ {product.originalPrice}
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


