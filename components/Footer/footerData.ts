import { FooterData } from "@/types/footertypes";

export const footerData: FooterData = {
  contactInfo: [
    {
      icon: "/assets/images/icons/time.svg",
      title: "Opening Hours",
      lines: ["Monday - Friday 09:00 - 18:00", "Saturday 09:00 - 14:00"],
    },
    {
      icon: "/assets/images/icons/phone.svg",
      title: "Call Us Anytime",
      lines: ["+977 9841000000"],
    },
    {
      icon: "/assets/images/icons/plane.svg",
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
      "singingbowlvillagenepal@gmail.com",
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
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      { name: "About Us", href: "/about_us" },
      { name: "Contacts", href: "/contact_us" },
      { name: "Blog", href: "/blog" },
      { name: "Gallery", href: "/gallery" },
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
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of use", href: "/terms-of-use" },
  ],
};
