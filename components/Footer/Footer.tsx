import React from "react";
import ContactBar from "./ContactBar";
import FooterMain from "./FooterMain";
import FooterBottom from "./FooterBottom";
import { footerData } from "./footerData";

const Footer: React.FC = () => {
  return (
    <footer className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactBar contactInfo={footerData.contactInfo} />
      </div>
      <div className="bg-black text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FooterMain
            about={footerData.about}
            information={footerData.information}
            products={footerData.products}
            navigation={footerData.navigation}
            socialLinks={footerData.socialLinks}
          />
          <FooterBottom
            copyright={footerData.copyright}
            bottomLinks={footerData.bottomLinks}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
