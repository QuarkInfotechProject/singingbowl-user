import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Header/Navbar";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Footer from "@/components/Footer/Footer";

// Google Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Singing Bowl Nepal - Mindfulness & Healing",
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
  authors: [{ name: "Singing Bowl Nepal", url: "https://singingbowl.com" }],
  openGraph: {
    title: "Singing Bowl Nepal - Mindfulness & Healing",
    description:
      "Explore handcrafted singing bowls from Nepal. Enhance meditation, mindfulness, and healing with authentic Himalayan bowls.",
    url: "https://singingbowl.com",
    siteName: "Singing Bowl Nepal",
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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
