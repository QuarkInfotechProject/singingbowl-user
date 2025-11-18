import React from "react";
import { FooterData } from "@/types/footertypes";
import FooterColumn from "./FooterColumn";
import Socialmedia from "../Socialmedia";
import Image from "next/image";

type FooterMainProps = Pick<
  FooterData,
  "about" | "information" | "products" | "navigation" | "socialLinks"
>;

const FooterMain: React.FC<FooterMainProps> = ({
  about,
  information,
  products,
  navigation,
  socialLinks,
}) => {
  // Only render if data is provided
  if (!about || !information || !products || !navigation) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-32 pb-12">
      {/* About Section */}
      <div className="space-y-4">
               <Image src="/assets/logo/logo3.png" alt="Logo" width={150} height={50} />
       
        <p className="text-sm">{about.description}</p>
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Follow Us</h3>
          <Socialmedia socialLinks={socialLinks} />
        </div>
      </div>

      {/* Information Section */}
      <div className="space-y-4">
        <h2 className="text-white text-lg font-semibold">
          {information.title}
        </h2>
        <div className="text-sm space-y-2">
          {information.details.map((line: string, index: number) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>

      {/* Products Column */}
      <FooterColumn title={products.title} links={products.links} />

      {/* Navigation Column */}
      <FooterColumn title={navigation.title} links={navigation.links} />
    </div>
  );
};

export default FooterMain;