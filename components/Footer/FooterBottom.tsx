import React from "react";
import { FooterLink } from "@/types/footertypes";

interface FooterBottomProps {
  copyright: string;
  bottomLinks: FooterLink[];
}

const FooterBottom: React.FC<FooterBottomProps> = ({
  copyright,
  bottomLinks,
}) => {
  return (
    <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
      <p className="text-center md:text-left mb-4 md:mb-0">{copyright}</p>
      <div className="flex space-x-6">
        {bottomLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="hover:text-white transition-colors underline"
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterBottom;
