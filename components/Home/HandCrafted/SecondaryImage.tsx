interface SecondaryImageProps {
  src: string;
  alt: string;
}

const SecondaryImage: React.FC<SecondaryImageProps> = ({ src, alt }) => {
  return (
    <div className="rounded-lg overflow-hidden h-full">
      <img
        src={src}
        alt={alt}
        className="w-full h-[204px] object-cover rounded-lg"
      />
    </div>
  );
};

export default SecondaryImage;
