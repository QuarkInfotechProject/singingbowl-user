import Image from "next/image";

const IconCard = () => {
  return (
    <div className="w-full">
      <div className="w-full bg-[#E8ECEA] p-4">
        <div className="flex items-center justify-center gap-20 w-full">
          <Image
            src="/assets/images/product/icons/1.svg"
            alt="Icons"
            width={100}
            height={100}
            className="w-28 h-28"
          />

          <Image
            src="/assets/images/product/icons/2.svg"
            alt="Icons"
            width={100}
            height={100}
            className="w-28 h-28"
          />

          <Image
            src="/assets/images/product/icons/3.svg"
            alt="Icons"
            width={100}
            height={100}
            className="w-28 h-28"
          />

          <Image
            src="/assets/images/product/icons/4.svg"
            alt="Icons"
            width={100}
            height={100}
            className="w-28 h-28"
          />
        </div>
      </div>
    </div>
  );
}
export default IconCard