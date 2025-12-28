"use client";

import { Button } from "@/components/ui/button";
import { Star, Heart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import CartSheet from "../Cart/CartSlide";
import { ProductDetail } from "@/app/(pages)/products/[slug]/page";
import { useCart } from "@/context/CartContext";
import { addToWishlist, fetchWishlist } from "@/lib/apiItems";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductInfoProps {
  product: ProductDetail;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addToCart, isLoading } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Check if product is in wishlist on mount
  useEffect(() => {
    const checkWishlist = async () => {
      if (!isLoggedIn) {
        console.log("Not logged in, skipping wishlist check");
        return;
      }
      try {
        console.log("Checking wishlist for product:", product.uuid);
        const res = await fetchWishlist();
        console.log("Wishlist API response:", res);
        const items = res?.data || res || [];
        console.log("Wishlist items:", items);
        if (Array.isArray(items)) {
          const inWishlist = items.some((item: any) => item.uuid === product.uuid);
          console.log("Product in wishlist:", inWishlist);
          setIsInWishlist(inWishlist);
        }
      } catch (error) {
        console.error("Failed to check wishlist", error);
      }
    };
    checkWishlist();
  }, [isLoggedIn, product.uuid]);


  const incrementQuantity = () => setQuantity(quantity + 1);
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
      stock: product.inStock ? 100 : 0,
      discount: product.discountPercentage
    };
    await addToCart(cartItem, openCart);
  };

  const handleAddToWishlist = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (isInWishlist) {
      toast.info("Already in wishlist");
      return;
    }
    try {
      setWishlistLoading(true);
      await addToWishlist(product.uuid);
      setIsInWishlist(true);
      toast.success("Added to wishlist!");
    } catch (error) {
      console.error("Failed to add to wishlist", error);
      toast.error("Failed to add to wishlist");
    } finally {
      setWishlistLoading(false);
    }
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

        <div className="flex items-center gap-4 mt-4">
          <Button
            onClick={async () => {
              await handleAddToCart(false); // Add to cart without opening sidebar
              router.push('/checkout');
            }}
            disabled={!product.inStock}
            className="flex-1 bg-transparent border border-[#A12717] hover:bg-transparent cursor-pointer text-[#A12717] rounded-full py-6 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </Button>
          <Button
            onClick={() => handleAddToCart()}
            disabled={isLoading || !product.inStock}
            className="flex-1 bg-[#A12717] hover:bg-[#A12717] cursor-pointer text-white rounded-full py-6 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Adding..." : !product.inStock ? "Out of Stock" : "Add to cart"}
          </Button>
        </div>

        {/* Wishlist & Stock Status */}
        <div className="flex items-center gap-8 mt-2">
          <button
            onClick={handleAddToWishlist}
            disabled={wishlistLoading}
            className={`flex items-center gap-2 font-medium cursor-pointer disabled:opacity-50 transition-colors ${isInWishlist ? "text-orange-500" : "text-gray-700 hover:text-gray-900"
              }`}
          >
            {wishlistLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Heart
                size={20}
                className={isInWishlist ? "fill-orange-500" : ""}
              />
            )}
            {wishlistLoading ? "Adding..." : isInWishlist ? "In Wishlist" : "Add to wishlist"}
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
