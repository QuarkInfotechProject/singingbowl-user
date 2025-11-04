import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="w-full items-center flex relative px-20">
      <div className="w-full">
        <Image
          src="/assets/images/home/hero.png"
          alt="Hero Image"
          width={1920}
          height={1080}
          className="w-full h-auto"
        />
      </div>
      <div className=" max-w-3xl absolute bottom-10 left-40">
        <span className="text-[40px] font-bold text-black">
          Be a part of our family and enjoy the Singing Bowl Village experience
        </span>
      </div>
    </div>
  );
}
export default HeroSection