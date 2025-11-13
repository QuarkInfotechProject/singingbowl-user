"use client";

import { Button } from "@/components/ui/button";
import { Star, Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import CartSheet from "../Cart/CartSlide";

const ProductInfo = () => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex w-full flex-col gap-6">
        <h2 className="font-bold text-4xl">Jambati Bowls</h2>

        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Star size={18} className="text-[#FFB30F] fill-[#FFB30F]" />
            <Star size={18} className="text-[#FFB30F] fill-[#FFB30F]" />
            <Star size={18} className="text-[#FFB30F] fill-[#FFB30F]" />
            <Star size={18} className="text-[#FFB30F] fill-[#FFB30F]" />
            <Star
              size={18}
              className="text-[#FFB30F] fill-[#FFB30F]"
              stroke-width={1.5}
            />
          </span>
          <a href="#" className="text-sm underline hover:no-underline">
            288 reviews
          </a>
        </span>

        <h3 className="text-[#39B856] text-3xl font-semibold">$ 1150</h3>

        <hr className="border-gray-200" />

        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            The Enigmatic Jambati Bowls: A Deep Dive into History and
            Craftsmanship Jambati bowls, cherished for their deep, resonant
            tones and exquisite craftsmanship, hail from the Himalayan regions
            of Nepal and Tibet. The Enigmatic Jambati Bowls: A Deep Dive into
            History and Craftsmanship Jambati bowls, cherished for their deep,
            resonant tones and exquisite craftsmanship, hail from the Himalayan
            regions of Nepal and Tibet.
          </p>
          <Button
            variant="outline"
            className="bg-transparent hover:text-[#39B856] hover:bg-transparent border-none cursor-pointer p-0 h-auto font-normal underline"
          >
            More Details
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button className="flex-1 bg-trasnparent border border-[#A12717] hover:bg-trasnparent cursor-pointer text-[#A12717] rounded-full py-6 font-semibold text-base">
            Buy Now
          </Button>
          {/* <Button className="flex-1 bg-[#A12717] hover:bg-[#A12717] cursor-pointer text-white rounded-full py-6 font-semibold text-base">
            Add to cart
          </Button> */}
          <CartSheet />
        </div>

        <div className="flex items-center gap-8">
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium">
            <Heart size={20} />
            Add to wishlist
          </button>
          <span className="flex items-center gap-2 text-gray-700 font-medium ">
            <span className="text-[#EB5930] bg-[#FAE8E3] p-1 w-6 h-6 rounded-full flex items-center justify-center">
              ✓
            </span>
            30 days money back guarantee
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
