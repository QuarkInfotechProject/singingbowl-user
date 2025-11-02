import { FooterData } from "@/types/footertypes";
import { ClockIcon, PhoneIcon, MailIcon } from "./icons";

export const footerData: FooterData = {
  contactInfo: [
    {
      icon: ClockIcon,
      title: "Opening Hours",
      lines: ["Monday - Friday 09:00 - 18:00", "Saturday 09:00 - 14:00"],
    },
    {
      icon: PhoneIcon,
      title: "Call Us Anytime",
      lines: ["+977 9841000000"],
    },
    {
      icon: MailIcon,
      title: "Mail Us",
      lines: ["singingbowlvillage@gmail.com", "support@singingbowl.com"],
    },
  ],
  about: {
    title: "SINGING BOWL VILLAGE",
    description:
      "Welcome to the Singing Bowl Gallery and Museum, a sanctuary of rich history and tradition established 40 years ago.",
  },
  information: {
    title: "Information",
    details: [
      "Kwabahal chowk, Thamel-17,",
      "Kathmandu, Nepal,",
      "+977 9841000000",
      "singingbowl@gmail.com",
    ],
  },
  products: {
    title: "Products",
    links: [
      { name: "Ultabiti bowls", href: "#" },
      { name: "Jambati bowls", href: "#" },
      { name: "Full Moon bowls", href: "#" },
      { name: "Carving bowls", href: "#" },
      { name: "Mani bowls", href: "#" },
    ],
  },
  navigation: {
    title: "Navigation",
    links: [
      { name: "Home", href: "#" },
      { name: "Products", href: "#" },
      { name: "About Us", href: "#" },
      { name: "Contacts", href: "#" },
      { name: "Blog", href: "#" },
    ],
  },
  socialLinks: [
    { name: "TikTok", href: "https://tiktok.com" },
    { name: "WhatsApp", href: "https://wa.me/" },
    { name: "Facebook", href: "https://facebook.com" },
    { name: "Instagram", href: "https://instagram.com" },
    { name: "YouTube", href: "https://youtube.com" },
    { name: "Pinterest", href: "https://pinterest.com" },
  ],
  copyright:
    "Copyright @2025. All Right Reserved. Designed and developed by Quark Infotech",
  bottomLinks: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of use", href: "#" },
  ],
};
