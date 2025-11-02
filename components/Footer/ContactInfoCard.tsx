import React from "react";
import { ContactInfo } from "@/types/footertypes";

const ContactInfoCard: React.FC<ContactInfo> = ({
  icon: Icon,
  title,
  lines,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div>
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
