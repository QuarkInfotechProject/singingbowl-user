import Link from "next/link";

import { Facebook, Instagram, YouTube, Pinterest } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { FaTiktok } from "react-icons/fa";

const socialLinks = [
  { name: "TikTok", icon: <FaTiktok size={18} />, url: "https://tiktok.com" },
  {
    name: "WhatsApp",
    icon: <WhatsAppIcon sx={{ fontSize: 18 }} />,
    url: "https://wa.me/",
  },
  {
    name: "Facebook",
    icon: <Facebook sx={{ fontSize: 18 }} />,
    url: "https://facebook.com",
  },
  {
    name: "Instagram",
    icon: <Instagram sx={{ fontSize: 18 }} />,
    url: "https://instagram.com",
  },
  {
    name: "YouTube",
    icon: <YouTube sx={{ fontSize: 18 }} />,
    url: "https://youtube.com",
  },
  {
    name: "Pinterest",
    icon: <Pinterest sx={{ fontSize: 18 }} />,
    url: "https://pinterest.com",
  },
];

const Socialmedia = () => {
  return (
    <div className="flex items-center gap-3">
      {socialLinks.map((social) => (
        <Link
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-gray-900 transition-colors"
          aria-label={social.name}
        >
          {social.icon}
        </Link>
      ))}
    </div>
  );
};
export default Socialmedia;
