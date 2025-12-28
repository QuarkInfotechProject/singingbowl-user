import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Header/Navbar";
import MobileBottomNav from "@/components/Header/MobileBottomNav";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "sonner";


// Google Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://singingbowlvillagenepal.com"),
  alternates: {
    canonical: "/",
  },
  title: "Singing Bowl Village Nepal - Mindfulness & Healing",
  description:
    "Explore handcrafted singing bowls from Nepal. Enhance meditation, mindfulness, and healing with authentic Himalayan bowls.",
  keywords: [
    "Singing Bowl",
    "Nepal",
    "Meditation",
    "Mindfulness",
    "Healing",
    "Himalayan Bowls",
  ],
  authors: [{ name: "Singing Bowl Village Nepal", url: "https://www.singingbowlvillagenepal.com/" }],
  openGraph: {
    title: "Singing Bowl Village Nepal - Mindfulness & Healing",
    description:
      "Explore handcrafted singing bowls from Nepal. Enhance meditation, mindfulness, and healing with authentic Himalayan bowls.",
    url: "https://singingbowlvillagenepal.com",
    siteName: "Singing Bowl Village Nepal",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Handcrafted Singing Bowl from Nepal",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Singing Bowl Nepal - Mindfulness & Healing",
    description:
      "Explore handcrafted singing bowls from Nepal. Enhance meditation, mindfulness, and healing with authentic Himalayan bowls.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{ children: React.ReactNode; auth: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased pb-0 lg:pb-0`}>
        <Providers>
          <Toaster richColors position="top-right" />
          <Navbar />
          <MobileBottomNav />
          <div className="pb-16 lg:pb-0">
            {children}
            {auth}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
