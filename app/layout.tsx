import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";

import "./globals.css";

import Footer from "./_components/footer/footer";
import NavbarMain from "./_components/navbar/navbar-main";
import NotificationListener from "./_components/notification/notification-listener";
import Providers from "./providers";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const defaultDescription =
  "Join MM Tamil Matrimony – trusted Tamil marriage website for brides and grooms. Verified profiles, horoscope match, secure matchmaking and success stories.";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MM Tamil",
    template: "%s | MM Tamil",
  },
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MM Tamil Matrimony",
    description: defaultDescription,
    url: siteUrl,
    siteName: "MM Tamil",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MM Tamil Matrimony",
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/assets/mmtlogo.png",
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="bg-[#FFF8F5] font-inter text-[#2C2C2C]">
        <Providers>
          <NavbarMain />
          <NotificationListener />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
