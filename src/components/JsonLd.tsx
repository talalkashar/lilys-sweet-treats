import { site } from "@/data/site";

/**
 * Bakery / LocalBusiness structured data for Google rich results.
 * Rendered as a native script tag (not next/script) per Next.js JSON-LD guide.
 */
export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Bakery", "LocalBusiness"],
    name: site.name,
    alternateName: "Lily's Sweet Treats Gainesville",
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
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: "Gainesville",
      containedInPlace: {
        "@type": "State",
        name: "Virginia",
      },
    },
    sameAs: [site.instagram],
    // Weekend pickup windows at Atlas Walk — not a full retail storefront
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
