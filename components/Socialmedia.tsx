import Link from "next/link";
import { Facebook, Instagram, YouTube, Pinterest } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { FaTiktok } from "react-icons/fa";

const iconMap: Record<string, React.ReactNode> = {
  TikTok: <FaTiktok size={18} />,
  WhatsApp: <WhatsAppIcon sx={{ fontSize: 18 }} />,
  Facebook: <Facebook sx={{ fontSize: 18 }} />,
  Instagram: <Instagram sx={{ fontSize: 18 }} />,
  YouTube: <YouTube sx={{ fontSize: 18 }} />,
  Pinterest: <Pinterest sx={{ fontSize: 18 }} />,
};

const defaultSocialLinks = [
  { name: "TikTok", href: "https://tiktok.com" },
  { name: "WhatsApp", href: "https://wa.me/" },
  { name: "Facebook", href: "https://facebook.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "YouTube", href: "https://youtube.com" },
  { name: "Pinterest", href: "https://pinterest.com" },
];

type SocialmediaProps = {
  socialLinks?: Array<{
    name: string;
    href: string;
  }>;
};

const Socialmedia: React.FC<SocialmediaProps> = ({ socialLinks }) => {
  const links = socialLinks || defaultSocialLinks;

  return (
    <div className="flex items-center gap-3">
      {links.map((social) => (
        <Link
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-gray-900 transition-colors"
          aria-label={social.name}
        >
          {iconMap[social.name]}
        </Link>
      ))}
    </div>
  );
};

export default Socialmedia;
