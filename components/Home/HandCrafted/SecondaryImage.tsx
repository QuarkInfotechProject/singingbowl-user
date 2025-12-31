import Image from "next/image";

interface SecondaryImageProps {
  src: string;
  alt: string;
}

const SecondaryImage: React.FC<SecondaryImageProps> = ({ src, alt }) => {
  return (
    <div className="w-full rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt}
        className="object-cover rounded-lg"
        width={1000}
        height={1000}
        style={{ width: "100%", height: "180px" }}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
};

export default SecondaryImage;
