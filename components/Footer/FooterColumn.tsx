import React from "react";
import { FooterColumnData } from "@/types/footertypes";

const FooterColumn: React.FC<FooterColumnData> = ({ title, links }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-white text-lg font-semibold">{title}</h2>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="text-sm hover:text-white transition-colors"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterColumn;
