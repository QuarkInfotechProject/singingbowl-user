import React from "react";

export interface ContactInfo {
  icon: React.ElementType;
  title: string;
  lines: string[];
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterColumnData {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  name: string;
  href: string;
}

export interface FooterData {
  contactInfo: ContactInfo[];
  about: {
    title: string;
    description: string;
  };
  information: {
    title: string;
    details: string[];
  };
  products: FooterColumnData;
  navigation: FooterColumnData;
  socialLinks: SocialLink[];
  copyright: string;
  bottomLinks: FooterLink[];
}
