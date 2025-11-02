import React from "react";
import { ContactInfo } from "@/types/footertypes";
import ContactInfoCard from "./ContactInfoCard";

interface ContactBarProps {
  contactInfo: ContactInfo[];
}

const ContactBar: React.FC<ContactBarProps> = ({ contactInfo }) => {
  return (
    <div
      className="bg-[#802010] rounded-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-white relative -mb-16 z-10"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2399301d' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
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
