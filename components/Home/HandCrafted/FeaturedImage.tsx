import DiscountBadge from "./DiscountBadge";

interface FeaturedImageProps {
  src: string;
  alt: string;
  discount?: string;
}

const FeaturedImage: React.FC<FeaturedImageProps> = ({
  src,
  alt,
  discount,
}) => {
  return (
    <div className="relative rounded-lg overflow-hidden h-full">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto md:h-[416px] object-cover rounded-lg"
      />
      {discount && <DiscountBadge discount={discount} />}
    </div>
  );
};

export default FeaturedImage;
