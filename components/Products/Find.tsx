import Image from "next/image"
import { Button } from "../ui/button";
import Link from "next/link";

const Find = () => {
  return (
    <div className="w-full">
      <div className="w-full bg-[#EBE9E9] rounded-xl p-6">
        <div className="flex flex-col bg-transparent lg:flex-row items-center justify-center gap-18 w-full">
          <div className="w-[320px] bg-transparent ">
            <Image
              src="/assets/images/productCard.png"
              alt="find"
              width={320}
              height={100}
              className="rounded-xl"
            />
          </div>
          <div className="w-full lg:w-[50%] flex flex-col items-start justify-start text-start gap-4">
            <h2 className="text-[40px] font-semibold leading-tight">
             Investment Pieces at Singing Bowl Village
            </h2>
            <p className="text-base text-gray-600">
              At Singing Bowl Village, we proudly present a curated collection of antique and investment-grade art pieces from families across Nepal. Each masterpiece reflects exceptional craftsmanship, timeless elegance, and rare cultural value, making it a must-have for discerning collectors and art enthusiasts. Explore our collection today and bring home a unique Himalayan treasure that elevates any collection
            </p>
            <div className=" flex items-start justify-start text-start">
              <Link href="https://singingbowlvillagenepal.com/products?category=investment-pieces">
                <Button className="mx-auto cursor-pointer bg-[#802010] rounded-full flex items-start justify-start text-start">
                  Visit Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Find