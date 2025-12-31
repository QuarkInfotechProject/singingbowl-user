
import Image from "next/image";

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
    <div className="w-full rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt}
        className="object-cover rounded-lg"
        width={1000}
        height={1000}
        style={{ width: "100%", height: "auto" }}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
};

export default FeaturedImage;
