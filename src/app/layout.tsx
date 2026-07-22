import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { BakeryAtmosphere } from "@/components/BakeryAtmosphere";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#faf6f1",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.searchTitle,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.shortName,
  keywords: [
    "Lily's Sweet Treats",
    "Lily's Sweet Treats Haymarket",
    "bakery Haymarket VA",
    "home bakery Haymarket",
    "porch pickup bakery",
    "cinnamon rolls Haymarket",
    "sticky buns Virginia",
    "homemade cinnamon rolls",
    "preorder bakery VA",
    "strawberry cinnamon rolls",
    "peach cobbler cinnamon rolls",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: site.searchTitle,
    description: site.description,
    url: site.url,
    siteName: site.shortName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 1200,
        alt: "Fresh homemade cinnamon rolls from Lily's Sweet Treats in Haymarket, VA",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.searchTitle,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 1200,
        alt: "Fresh homemade cinnamon rolls from Lily's Sweet Treats in Haymarket, VA",
      },
    ],
  },
  icons: {
    icon: [{ url: "/brand/logo-mark.png", type: "image/png" }],
    apple: [{ url: "/brand/logo-mark.png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /**
   * Google Search Console ownership.
   * Prefer env override; fall back to the Domain-property token so HTML-tag
   * verification works for the URL-prefix property without extra Vercel setup.
   */
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "hFFZbPnrYg4ddoxt9jpaknU3tITllQmXtXhl49i0ZCA",
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
        <JsonLd />
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
