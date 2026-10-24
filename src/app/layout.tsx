import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "ThorHub — Script Roblox Steal an Egg (Gratis, Tanpa Key)",
  description:
    "ThorHub: script lengkat 150+ fitur untuk Roblox Steal an Egg. Auto Steal, Auto Hatch, ESP, Combat, Auto Hop. Gratis, tanpa key, tanpa tracking.",
  keywords: [
    "ThorHub",
    "Steal an Egg",
    "Roblox",
    "script",
    "auto steal",
    "auto hatch",
    "ESP",
  ],
  authors: [{ name: "ThorHub" }],
  icons: {
    icon: "/assets/logo.png",
  },
  openGraph: {
    title: "ThorHub — Script Steal an Egg",
    description:
      "150+ fitur · Gratis · Tanpa Key · Tanpa Tracking. Petir Thor menyambar egg Eternal.",
    siteName: "ThorHub",
    type: "website",
    images: ["/assets/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
