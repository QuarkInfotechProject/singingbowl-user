const HeroSection = () => {
  return (
    <div className="w-full items-center flex relative px-1 md:px-20">
      <div className="w-full relative overflow-hidden">
        <video
          src="/assets/video/home.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto rounded-3xl"
        />
      </div>
      <div className="max-w-3xl absolute bottom-1 md:bottom-10 left-4 md:left-40">
        <span className="text-md md:text-[40px] font-bold text-white">
          Be a part of our family and enjoy the Singing Bowl Village experience
        </span>
      </div>
    </div>
  );
};
export default HeroSection;
