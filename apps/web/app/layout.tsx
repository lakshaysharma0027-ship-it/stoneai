import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const siteUrl = `https://${process.env.NEXT_PUBLIC_STONEAI_ROOT_DOMAIN ?? "stoneai.in"}`;

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
  title: "StoneAI",
  description: "AI website builder for templates, publishing, credits, and custom domains.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "StoneAI",
    description: "AI website builder for templates, publishing, credits, and custom domains.",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "StoneAI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StoneAI",
    description: "AI website builder for templates, publishing, credits, and custom domains.",
    images: ["/brand/og-image.png"],
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
        {children}
      </body>
    </html>
  );
}
