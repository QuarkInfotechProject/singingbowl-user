const HeroSection = () => {
  return (
    <div className="w-full items-center flex relative ">
      <div className="w-full relative overflow-hidden">
        <video
          src={process.env.NEXT_PUBLIC_HERO_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="auto"
          className="w-full h-[66vh] object-cover"
        />
      </div>
    </div>
  );
};
export default HeroSection;
