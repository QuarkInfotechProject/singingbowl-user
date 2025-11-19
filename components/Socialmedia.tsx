import Link from "next/link";
import {  Facebook, Instagram } from "@mui/icons-material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const iconMap: Record<string, React.ReactNode> = {
  WhatsApp: <WhatsAppIcon sx={{ fontSize: 18 }} />,
  Instagram: <Instagram sx={{ fontSize: 18 }} />,
  Facebook: <Facebook sx={{ fontSize: 18 }} />,
};

const defaultSocialLinks = [
  { name: "WhatsApp", href: "https://wa.me/+9779851352794" },
  {
    name: "Instagram",
    href: "https://www.instagram.com/singingbowlvillage/?igsh=MTkxcDY0YzNvbWQyNg%3D%3D&utm_source=qr",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/people/Singing-Bowl/61550698021090/",
  },
];

type SocialmediaProps = {
  socialLinks?: Array<{
    name: string;
    href: string;
  }>;
};

const Socialmedia = ({
  socialLinks,
}: SocialmediaProps) => {
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
