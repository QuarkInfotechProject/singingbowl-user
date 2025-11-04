import React from "react";
import { ContactInfo } from "@/types/footertypes";
import ContactInfoCard from "./ContactInfoCard";

interface ContactBarProps {
  contactInfo: ContactInfo[];
}

const ContactBar: React.FC<ContactBarProps> = ({ contactInfo }) => {
  return (
    <div
      className="rounded-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-white relative -mb-16 z-10 bg-cover bg-center"
      style={{
        backgroundImage: "url(/assets/images/background.png)",
      }}
    >
      {contactInfo.map((info, index) => (
        <ContactInfoCard
          key={index}
          icon={info.icon}
          title={info.title}
          lines={info.lines}
        />
      ))}
    </div>
  );
};

export default ContactBar;
