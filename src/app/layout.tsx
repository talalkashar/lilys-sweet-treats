import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { BakeryAtmosphere } from "@/components/BakeryAtmosphere";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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
  title: `${site.name} | Pre-order & Porch Pickup`,
  description: site.description,
  openGraph: {
    title: `${site.name} | Pre-order & Porch Pickup`,
    description: site.description,
    url: "https://www.lilyssweettreatsva.com",
    siteName: site.name,
    locale: "en_US",
    type: "website",
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
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <BakeryAtmosphere />

        <Header />
        <main className="relative z-[1] flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
