import FeaturedImage from "./FeaturedImage";
import SecondaryImage from "./SecondaryImage";

interface ImageGalleryProps {
  images: string[];
  discount?: string;
}

const ImageGallery = ({
  images,
  discount,
}: ImageGalleryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
      {/* Main large image */}
      <div className="rounded-lg overflow-hidden">
        <FeaturedImage
          src={images[0]}
          alt="Singing Bowl in use"
          discount={discount}
        />
      </div>

      {/* Right column with smaller images */}
      <div className="grid grid-cols-1 gap-2 h-full">
        <div className="rounded-lg overflow-hidden">
          <SecondaryImage src={images[1]} alt="Singing Bowl detail" />
        </div>
        <div className="rounded-lg overflow-hidden">
          <SecondaryImage src={images[2]} alt="Singing Bowl usage" />
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
