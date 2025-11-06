import React from "react";
import { singingBowlData } from "./singingBowl.data";
import ProductInfo from "./ProductInfo";
import ImageGallery from "./ImageGallery";

const WhySingingBowl: React.FC = () => {
  const {
    title = "",
    description = "",
    size = "",
    materials = "",
    discount,
    images = [],
    buttonText = "",
  } = singingBowlData;

  return (
    <div className="bg-white rounded-lg p-4 md:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 shadow-sm border border-gray-200 rounded-lg p-4 md:p-6 items-center justify-center">
        {/* Left Image Section */}
        <div className="h-full flex flex-col">
          <ImageGallery images={images} discount={discount} />
        </div>

        {/* Right Content Section */}
        <ProductInfo
          title={title}
          description={description}
          size={size}
          materials={materials}
          buttonText={buttonText}
        />
      </div>
    </div>
  );
};

export default WhySingingBowl;
