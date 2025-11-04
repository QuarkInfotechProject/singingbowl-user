import Image from "next/image";
import { ContactInfo } from "@/types/footertypes";

const ContactInfoCard = ({ icon, title, lines }: ContactInfo) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex-shrink-0">
        <Image
          src={icon}
          alt={title}
          width={48}
          height={48}
          className="w-8 h-8"
        />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-lg">{title}</h3>
        {lines.map((line, index) => (
          <p key={index} className="text-sm text-gray-200">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ContactInfoCard;
