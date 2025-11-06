import FeaturedImage from "./FeaturedImage";

interface ImageGalleryProps {
  images: string[];
  discount?: string;
}

const ImageGallery = ({
  images,
  discount,
}: ImageGalleryProps) => {
  return (
    <div className="h-full">
      {/* Main large image */}
      <div className="rounded-lg overflow-hidden">
        <FeaturedImage
          src={images[0]}
          alt="Singing Bowl in use"
          discount={discount}
        />
      </div>
    </div>
  );
};

export default ImageGallery;
