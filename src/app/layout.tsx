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
  title: "ThorHub Panel — Hosting Script & Loadstring Roblox",
  description:
    "Panel hosting script pribadi ala Luarmor: upload file .lua, dapatkan loadstring instan untuk banyak game, auto-commit GitHub + auto-deploy Vercel. Tanpa key, tanpa tracking.",
  keywords: [
    "ThorHub",
    "ThorHub Panel",
    "script hosting",
    "loadstring",
    "Roblox",
    "Steal an Egg",
    "executor",
  ],
  authors: [{ name: "ThorHub" }],
  icons: {
    icon: "/assets/logo.png",
  },
  openGraph: {
    title: "ThorHub Panel — Hosting Script & Loadstring",
    description:
      "Upload .lua → loadstring instan. Multi-game, auto-commit GitHub, auto-deploy Vercel. Petir Thor menyambar.",
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
