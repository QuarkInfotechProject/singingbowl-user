import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="w-full items-center flex relative px-1 md:px-20">
      <div className="w-full">
        <Image
          src="/assets/images/home/hero.png"
          alt="Hero Image"
          width={1920}
          height={1080}
          className="w-full h-auto"
        />
      </div>
      <div className="max-w-3xl absolute bottom-1 md:bottom-10 left-4 md:left-40">
        <span className="text-md md:text-[40px] font-bold text-black">
          Be a part of our family and enjoy the Singing Bowl Village experience
        </span>
      </div>
    </div>
  );
}
export default HeroSection