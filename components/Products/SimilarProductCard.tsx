"use client";

import { Badge } from "@/components/ui/badge";
import { Heart, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export interface SimilarProduct {
    id: string;
    uuid?: string;
    productName: string;
    url: string;
    brandId: number;
    bestSeller: boolean;
    isNew: boolean;
    onSale: boolean;
    soldCount: number;
    inStock: boolean;
    originalPrice: string;
    specialPrice: string;
    priceDifferencePercentage: number;
    reviewCount: number;
    rating: number;
    baseImage: string;
    productOption: any;
}

interface SimilarProductCardProps {
    product: SimilarProduct;
}

const SimilarProductCard = ({ product }: SimilarProductCardProps) => {
    const hasDiscount =
        product.specialPrice &&
        product.specialPrice !== "" &&
        product.specialPrice !== product.originalPrice;

    const displayPrice = hasDiscount
        ? product.specialPrice
        : product.originalPrice;

    const { isInWishlist, toggleWishlist, loadingProductId } = useWishlist();
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const productId = product.uuid || product.id;
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
                <div className="flex flex-col gap-3 group">
                    <div className="w-full h-auto relative overflow-hidden rounded-xl">
                        <Image
                            src={product.baseImage || "/assets/images/product/1.jpg"}
                            alt={product.productName}
                            width={200}
                            height={200}
                            className={`w-full h-[200px] object-cover transition-transform duration-300 group-hover:scale-105 ${product.inStock === false ? "opacity-50 grayscale" : ""
                                }`}
                        />
                        {product.inStock === false && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <Badge className="bg-gray-900 text-white hover:bg-gray-900">
                                    Out of Stock
                                </Badge>
                            </div>
                        )}
                        <div className="absolute top-2 flex w-full items-center justify-between px-3">
                            <div className="flex gap-2">
                                {product.priceDifferencePercentage > 0 && (
                                    <Badge className="bg-[#802010] text-white">
                                        -{product.priceDifferencePercentage}%
                                    </Badge>
                                )}
                                {product.bestSeller && (
                                    <Badge className="bg-yellow-500 text-white">Best Seller</Badge>
                                )}
                                {product.isNew && (
                                    <Badge className="bg-blue-500 text-white">New</Badge>
                                )}
                            </div>
                            <button
                                onClick={handleWishlistClick}
                                disabled={isToggling}
                                className="p-1 bg-white rounded-full hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50"
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
                    <div className="flex flex-col gap-1 items-start justify-start text-start px-1">
                        <span className="flex items-center gap-1 text-sm">
                            <p>{product.rating || 0}</p>
                            <Star className="text-[#FFB30F] fill-[#FFB30F]" size={14} />
                            <span className="text-gray-500">({product.reviewCount || 0})</span>
                        </span>
                        <b className="text-sm line-clamp-2">
                            {product.productName}
                        </b>
                        <div className="flex items-center gap-2 flex-wrap">
                            <b className="text-[#39B856]">${displayPrice}</b>
                            {hasDiscount && (
                                <span className="text-gray-400 line-through text-sm">
                                    ${product.originalPrice}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default SimilarProductCard;

