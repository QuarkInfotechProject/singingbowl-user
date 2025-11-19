const HeroSection = () => {
  return (
    <div className="w-full items-center flex relative ">
      <div className="w-full relative overflow-hidden">
        <video
          src="https://singingbowlwebsite.oss-ap-southeast-1.aliyuncs.com/public/home.MP4?OSSAccessKeyId=LTAI5tBLcHS1BZEEJDorpqSF&Expires=1795078819&Signature=7jxAlg7szkK324GUK0IVCOs4Xc4%3D"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto" 
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
