import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { BakeryAtmosphere } from "@/components/BakeryAtmosphere";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileStickyCta } from "@/components/MobileStickyCta";
import { ViewMode } from "@/components/ViewMode";
import { site } from "@/data/site";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lilyssweettreatsva.com"),
  title: {
    default: `${site.name} | Pre-order & Porch Pickup`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.shortName,
  keywords: [
    "bakery",
    "porch pickup",
    "Haymarket VA",
    "cinnamon rolls",
    "sticky buns",
    "strawberry cinnamon rolls",
    "peach cobbler cinnamon rolls",
    "party tray",
    "preorder",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} | Pre-order & Porch Pickup`,
    description: site.description,
    url: "https://www.lilyssweettreatsva.com",
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/brand/logo-full.png",
        width: 1200,
        height: 630,
        alt: `${site.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Pre-order & Porch Pickup`,
    description: site.description,
    images: ["/brand/logo-full.png"],
  },
  icons: {
    icon: [{ url: "/brand/logo-mark.png", type: "image/png" }],
    apple: [{ url: "/brand/logo-mark.png" }],
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <ViewMode />
        <BakeryAtmosphere />

        <Header />
        <main className="relative z-[1] flex-1">{children}</main>
        <Footer />
        <MobileStickyCta />
      </body>
    </html>
  );
}
