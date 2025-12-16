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
      <div className="flex flex-col md:flex-row items-center gap-2 mb-4 md:mb-0">
        <p className="text-center md:text-left">{copyright}</p>
        <span className="hidden md:inline">|</span>
        <p className="text-center md:text-left">
          Designed and Developed by{" "}
          <a
            href="https://www.quarkinfotech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors underline"
          >
            QuarkInfotech
          </a>
        </p>
      </div>
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
