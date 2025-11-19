
const productData = {
  title: "Product Features",
  highlightedText: "TRANQUILITY. RESONANCE. PEACE.",
  
  image: {
    src: "/assets/images/home/bowl.png",
    alt: "Hand holding a singing bowl with a mallet",
  },
};

const ProductFeatures = () => {
  return (
    <div className="w-full px-2 sm:px-6 lg:px-0 py-8 lg:pr-20">
      {/* Title - Visible on all screens */}
      {/* <div className="mb-8 lg:mb-0">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black text-center lg:hidden tracking-tight">
          <SectionTitle title="Product Features" />
        </h2>
      </div> */}

      <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-20 items-center justify-center">
        {/* Image Section */}
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-start">
          <img
            src={productData.image.src}
            alt={productData.image.alt}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none h-auto object-contain"
          />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-3/5 flex flex-col gap-6 sm:gap-8">
          <div className="text-center lg:text-left flex flex-col gap-6 sm:gap-8">
            {/* <h2 className="hidden lg:flex font-bold text-4xl md:text-5xl text-black tracking-tight">
              <SectionTitle title="Product Features" />
            </h2> */}
            <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-800 leading-tight">
              <span className="text-[#A12717]">
                {productData.highlightedText}
              </span>
              <br />
            </h3>
          </div>

          <div className="flex flex-col gap-6 sm:gap-8 w-full text-center lg:text-left">
            <p className="w-full text-base sm:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">
              What if your greatest healing came not from a pill, but from a
              frequency? Welcome to the future of wellness, where ancient sonic
              wisdom meets modern science.
              <br />
              <br />
              We craft immersive soundscapes that do more than just relax-they
              recalibrate. Feel the profound resonance of bowls and sacred
              instruments guide your brainwaves from chaos to coherence,
              releasing stored anxiety, mental fog, and emotional weight. This
              is a homecoming for your soul. It's time to remember what it feels
              like to be vibrantly, authentically you. Your journey back to
              balance starts with a single, powerful note.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
