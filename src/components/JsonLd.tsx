import { site } from "@/data/site";

/**
 * Bakery / LocalBusiness structured data for Google rich results.
 * Rendered as a native script tag (not next/script) per Next.js JSON-LD guide.
 */
export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Bakery", "LocalBusiness"],
    // shortName first for a cleaner Google knowledge / search identity
    name: site.shortName,
    alternateName: [site.name, "Lily's Sweet Treats Haymarket"],
    description: site.description,
    url: site.url,
    // Lead with food photo so rich results / previews show product, not logo
    image: [
      `${site.url}${site.ogImage}`,
      `${site.url}${site.logoFull}`,
    ],
    logo: `${site.url}${site.logo}`,
    telephone: site.phone,
    email: site.email,
    priceRange: "$$",
    servesCuisine: "Bakery",
    // City-level only — full street address is private (porch pickup, not a storefront)
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: "Haymarket",
      containedInPlace: {
        "@type": "State",
        name: "Virginia",
      },
    },
    sameAs: [site.instagram],
    // Porch pickup windows — not a full retail storefront
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "16:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "11:00",
      },
    ],
    potentialAction: {
      "@type": "OrderAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/order`,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      deliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModePickUp",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
