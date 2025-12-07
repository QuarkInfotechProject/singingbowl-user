interface Specification {
  icon: string;
  content: string;
}

interface IconCardProps {
  specifications?: Specification[];
}

const IconCard = ({ specifications = [] }: IconCardProps) => {
  // If no specs from API, show nothing or a placeholder
  if (specifications.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="w-full bg-[#E8ECEA] p-4">
        <div className="flex items-center justify-center gap-10 md:gap-20 w-full flex-wrap">
          {specifications.map((spec, index) => (
            <div key={index} className="flex flex-col items-center gap-2 text-center">
              <span className="text-2xl">{spec.icon}</span>
              <span className="text-sm font-medium">{spec.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default IconCard