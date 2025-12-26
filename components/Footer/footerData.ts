import { FooterData } from "@/types/footertypes";

export const footerData: FooterData = {
  contactInfo: [
    {
      icon: "/assets/images/icons/time.svg",
      title: "Opening Hours",
      lines: ["Sunday- Friday: 09:00AM - 8:00PM", "Saturday: Closed"],
    },
    {
      icon: "/assets/images/icons/phone.svg",
      title: "Call Us Anytime",
      lines: ["+977-9851352794", "+977-9843488252"],
    },
    {
      icon: "/assets/images/icons/plane.svg",
      title: "Mail Us",
      lines: ["singingbowlvillagenepal@gmail.com"],
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
      "+977-9851352794",
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
    { name: "WhatsApp", href: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/+9779851352794" },
    {
      name: "Instagram",
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/singingbowlvillage/?igsh=MTkxcDY0YzNvbWQyNg%3D%3D&utm_source=qr",
    },
    {
      name: "Facebook",
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/people/Singing-Bowl/61550698021090/",
    },
    {
      name: "YouTube",
      href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@singingbowlvillage",
    },
  ],
  copyright:
    "Copyright © 2025 Singing Bowl Village Nepal. All Rights Reserved.",
  bottomLinks: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of use", href: "/terms-and-condition" },
  ],
};
