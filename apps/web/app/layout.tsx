import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";
import { StructuredData } from "@/components/marketing/StructuredData";
import { STONEAI_DEFAULT_DESCRIPTION, STONEAI_SITE_URL, STONEAI_X_URL } from "@/lib/site";
import "./globals.css";

const siteUrl = STONEAI_SITE_URL;

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "StoneAI — AI Website Builder",
    template: "%s · StoneAI",
  },
  description: STONEAI_DEFAULT_DESCRIPTION,
  keywords: [
    "AI website builder",
    "website builder",
    "3D website builder",
    "AI website generator",
    "build website with AI",
    "no code website builder",
  ],
  applicationName: "StoneAI",
  authors: [{ name: "StoneAI", url: siteUrl }],
  creator: "StoneAI",
  publisher: "StoneAI",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "StoneAI",
    title: "StoneAI — AI Website Builder",
    description: STONEAI_DEFAULT_DESCRIPTION,
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "StoneAI" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@StoneAIusa",
    creator: "@StoneAIusa",
    title: "StoneAI — AI Website Builder",
    description: STONEAI_DEFAULT_DESCRIPTION,
    images: ["/brand/og-image.png"],
  },
  other: {
    "twitter:url": STONEAI_X_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StructuredData />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
