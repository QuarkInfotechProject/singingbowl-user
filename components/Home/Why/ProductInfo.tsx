import { SingingBowlProps } from "@/types/SingingBowl.types";
import Link from "next/link";

type ProductInfoProps = Omit<SingingBowlProps, "images" | "discount">;

const ProductInfo: React.FC<ProductInfoProps> = ({
  title,
  description,
  size,
  materials,
  buttonText,
}) => {
  return (
    <div className="flex flex-col gap-8 px-4 lg:px-0">
      <div>
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-gray-700 text-md leading-relaxed text-justify">{description}</p>
      </div>

      <div className="space-y-4">
        <Link href="/products">
          <button className="inline-block bg-[#802010] cursor-pointer hover:bg-[#6b1a0e] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 mt-2">
            {buttonText}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductInfo;
