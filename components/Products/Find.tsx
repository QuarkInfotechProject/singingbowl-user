import Image from "next/image"
import { Button } from "../ui/button";

const Find = () => {
  return (
    <div className="w-full">
      <div className="w-full bg-[#EBE9E9] rounded-xl p-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-18 w-full">
          <div className="w-[320px] rounded-full">
            <Image
              src="/assets/images/product/3.png"
              alt="find"
              width={320}
              height={100}
              className="rounded-full"
            />
          </div>
          <div className="w-full lg:w-[50%] flex flex-col items-start justify-start text-start gap-4">
            <h2 className="text-[40px] font-semibold leading-tight">
              Find the right product for your needs
            </h2>
            <p className="text-base text-gray-600">
              The Enigmatic Jambati Bowls: A Deep Dive into History and
              Craftsmanship Jambati bowls, cherished for their deep, resonant
              tones and exquisite craftsmanship, hail from the Himalayan regions
              of Nepal and Tibet. Historically used in spiritual rituals by
              Tibetan Buddhist monks, these bowls feature wide rims, gently
              sloping sides, and flat bottoms, producing harmonious tones that
              enhance meditation and promote healing.
            </p>
            <div className=" flex items-start justify-start text-start">
              <Button className="mx-auto bg-[#802010] rounded-full flex items-start justify-start text-start">
                Visit Store
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Find