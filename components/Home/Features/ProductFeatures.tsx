import React from "react";
import SectionTitle from "../SectionTitle";

const productData = {
  title: "Product Features",
  headline: "We have made the most",
  highlightedText: "Powerful Healing",
  subHeadline: "System",
  description:
    "Our handcrafted singing bowls are made from high-quality metal alloys, designed to produce rich, calming, and resonant tones. Available in a variety of sizes and finishes, each bowl comes with a wooden mallet and cushion for easy use. Compact and portable, they are perfect for meditation, relaxation, or as a beautiful decorative piece.",
  features: [
    {
      id: 1,
      title: "Stress Relief & Relaxation",
      description: "The vibrations help reduce stress.",
    },
    {
      id: 2,
      title: "Energy Balancing",
      description: "Believed to harmonize energy flow within the body.",
    },
    {
      id: 3,
      title: "Improved Sleep",
      description: "Helps reduce anxiety for better sleep.",
    },
    {
      id: 4,
      title: "Sound Therapy",
      description:
        "Useful for sound healing practices, chakra balancing, and holistic therapy.",
    },
  ],
  image: {
    src: "/assets/images/home/bowl.png",
    alt: "Hand holding a singing bowl with a mallet",
  },
};

const ProductFeatures = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 py-8 lg:pr-20">
      {/* Title - Visible on all screens */}
      <div className="mb-8 lg:mb-0">
        <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black text-center lg:hidden tracking-tight">
          <SectionTitle title="Product Features" />
        </h2>
      </div>

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
            <h2 className="hidden lg:flex font-bold text-4xl md:text-5xl text-black tracking-tight">
              <SectionTitle title="Product Features" />
            </h2>
            <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-gray-800 leading-tight">
              {productData.headline}{" "}
              <span className="text-[#A12717]">
                {productData.highlightedText}
              </span>
              <br />
              {productData.subHeadline}
            </h3>
          </div>

          <div className="flex flex-col gap-6 sm:gap-8 w-full text-center lg:text-left">
            <p className="w-full text-base sm:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">
              {productData.description}
            </p>

            <div>
              <ul className="space-y-3 sm:space-y-4">
                {productData.features.map((feature) => (
                  <li
                    key={feature.id}
                    className="flex items-start justify-center lg:justify-start gap-2 sm:gap-3 px-2 sm:px-0"
                  >
                    <span className="text-[#A12717] font-bold text-lg sm:text-xl mt-1 leading-none flex-shrink-0">
                      •
                    </span>
                    <p className="text-base sm:text-lg text-gray-700 text-left">
                      <span className="font-semibold text-gray-900">
                        {feature.title}
                      </span>{" "}
                      – <span>{feature.description}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
