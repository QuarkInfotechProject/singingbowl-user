
interface FeaturedImageProps {
  src: string;
  alt: string;
  discount?: string;
}

const FeaturedImage: React.FC<FeaturedImageProps> = ({
  src,
  alt,
}) => {
  return (
    <div className="relative rounded-lg overflow-hidden h-full">
      <img
        src={src}
        alt={alt}
        className="w-full h-[458px] object-cover rounded-lg"
      />
    </div>
  );
};

export default FeaturedImage;
