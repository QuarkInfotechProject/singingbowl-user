"use client";

interface ProductInfoProps {
  name: string;
  description: string;
}

export default function ProductInfo({ name, description }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:gap-1 md:gap-2 items-center text-center w-full">
      <h3 className="font-semibold text-xs sm:text-base md:text-lg lg:text-xl text-black line-clamp-2">
        {name}
      </h3>
      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 block">
        {description}
      </p>
    </div>
  );
}
