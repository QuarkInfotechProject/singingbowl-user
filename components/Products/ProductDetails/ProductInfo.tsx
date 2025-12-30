"use client";

import { Button } from "@/components/ui/button";
import { Star, Heart, Loader2, Plus, Minus } from "lucide-react";
import { useState } from "react";
import CartSheet from "../Cart/CartSlide";
import { ProductDetail } from "@/app/(pages)/products/[slug]/page";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
  product: ProductDetail;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const { addToCart, isLoading } = useCart();
  const { isInWishlist, toggleWishlist, loadingProductId } = useWishlist();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const inWishlist = isInWishlist(product.uuid);
  const wishlistLoading = loadingProductId === product.uuid;


  const incrementQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };
  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  // Generate star rating
  const rating = product.average_rating || 0;

  const fullStars = Math.floor(rating);

  const handleAddToCart = async (openCart: boolean = true) => {
    // Map ProductDetail to CartItem
    const price = parseFloat(product.specialPrice || product.originalPrice);
    const originalPrice = parseFloat(product.originalPrice);
    const cartItem = {
      id: product.uuid, // used uuid instead of id
      name: product.productName,
      price: price, // unitPrice
      originalPrice: originalPrice, // originalPrice from product
      lineTotal: price * quantity, // calculated lineTotal
      quantity: quantity,
      image: product.files.baseImage?.url || "/assets/images/product/1.jpg", // Correct image path
      stock: product.quantity, // Use actual product quantity
      discount: product.discountPercentage
    };
    await addToCart(cartItem, openCart);
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    await toggleWishlist(product.uuid);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex w-full flex-col gap-6">
        <h2 className="font-bold text-4xl">{product.productName}</h2>

        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={i < fullStars ? "text-[#FFB30F] fill-[#FFB30F]" : "text-gray-300"}
              />
            ))}
          </span>
          <span className="text-sm underline hover:no-underline cursor-pointer">
            {product.review_count} reviews
          </span>
        </span>

        <div className="flex items-center gap-3">
          <h3 className="text-[#39B856] text-3xl font-semibold">
            $ {product.specialPrice || product.originalPrice}
          </h3>
          {product.specialPrice && (
            <span className="text-gray-400 line-through text-xl">
              $ {product.originalPrice}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-3">
          {product.description ? (
            <div
              className="text-gray-700 leading-relaxed prose prose-sm max-w-none line-clamp-7"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">No description available.</p>
          )}
          <Button
            variant="outline"
            className="bg-transparent hover:text-[#39B856] hover:bg-transparent border-none cursor-pointer p-0 h-auto font-normal underline"
            onClick={() => {
              const detailsSection = document.getElementById('product-details');
              if (detailsSection) {
                detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            More Details
          </Button>
        </div>

        {/* Quantity Selector - Only show if product has more than 1 in stock */}
        {product.quantity > 1 && (
          <div className="flex items-center gap-4 mt-4">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="h-9 w-9 rounded-full border-gray-300 hover:bg-gray-100 cursor-pointer disabled:opacity-50"
              >
                <Minus size={16} />
              </Button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= product.quantity}
                className="h-9 w-9 rounded-full border-gray-300 hover:bg-gray-100 cursor-pointer disabled:opacity-50"
              >
                <Plus size={16} />
              </Button>
            </div>
            {/* <span className="text-sm text-gray-500">({product.quantity} available)</span> */}
          </div>
        )}

        <div className="flex items-center gap-4 mt-4">
          <Button
            onClick={async () => {
              setBuyNowLoading(true);
              try {
                await handleAddToCart(false); // Add to cart without opening sidebar
                router.push('/checkout');
              } finally {
                setBuyNowLoading(false);
              }
            }}
            disabled={buyNowLoading || !product.inStock}
            className="flex-1 bg-transparent border border-[#A12717] hover:bg-transparent cursor-pointer text-[#A12717] rounded-full py-6 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {buyNowLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Buy Now"
            )}
          </Button>
          <Button
            onClick={() => handleAddToCart()}
            disabled={(isLoading && !buyNowLoading) || !product.inStock}
            className="flex-1 bg-[#A12717] hover:bg-[#A12717] cursor-pointer text-white rounded-full py-6 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && !buyNowLoading ? "Adding..." : !product.inStock ? "Out of Stock" : "Add to cart"}
          </Button>
        </div>

        {/* Wishlist & Stock Status */}
        <div className="flex items-center gap-8 mt-2">
          <button
            onClick={handleToggleWishlist}
            disabled={wishlistLoading}
            className={`flex items-center gap-2 font-medium cursor-pointer disabled:opacity-50 transition-colors ${inWishlist ? "text-red-500" : "text-gray-700 hover:text-gray-900"
              }`}
          >
            {wishlistLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Heart
                size={20}
                className={inWishlist ? "fill-red-500" : ""}
              />
            )}
            {wishlistLoading ? "Updating..." : inWishlist ? "In Wishlist" : "Add to wishlist"}
          </button>
          <span className="flex items-center gap-2 text-gray-700 font-medium ">
            <span className={`text-[#EB5930] ${product.inStock ? "bg-[#FAE8E3]" : "bg-gray-200"} p-1 w-6 h-6 rounded-full flex items-center justify-center`}>
              {product.inStock ? "✓" : "×"}
            </span>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Cart Sheet Component - Kept here to ensure it's rendered, controlled by context */}
        <CartSheet />
      </div>
    </div>
  );
};


export default ProductInfo;
