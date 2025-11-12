"use client";

import { Button } from "@/components/ui/button";
import { Star, Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";

const ProductInfo = () => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex w-full flex-col gap-8">
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

        <h3 className="text-[#39B856] text-3xl font-semibold">Rs. 115,000</h3>

        <hr className="border-gray-200" />

        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            The Enigmatic Jambati Bowls: A Deep Dive into History and
            Craftsmanship Jambati bowls, cherished for their deep, resonant
            tones and exquisite craftsmanship, hail from the Himalayan regions
            of Nepal and Tibet.
          </p>
          <Button
            variant="outline"
            className="bg-transparent hover:text-[#39B856] hover:bg-transparent border-none cursor-pointer p-0 h-auto font-normal underline"
          >
            More Details
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-full">
            <button onClick={decrementQuantity} className="p-2 cursor-pointer">
              <Minus size={20} />
            </button>
            <span className="px-6 py-2 font-medium">{quantity}</span>
            <button onClick={incrementQuantity} className="p-2 cursor-pointer">
              <Plus size={20} />
            </button>
          </div>
          <Button className="flex-1 bg-[#A12717] hover:bg-[#A12717] cursor-pointer text-white rounded-full py-6 font-semibold text-base">
            Add to cart
          </Button>
        </div>

        <p className="text-red-600 text-sm font-medium">
          Only 10 left in stock
        </p>

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
