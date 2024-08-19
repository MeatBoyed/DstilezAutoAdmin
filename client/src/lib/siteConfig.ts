// siteConfig.js
export const siteConfig = {
  title: "Dstilez Auto Admin",
  description: "Dstilez Auto Admin - A comprehensive management tool for automotive needs.",
  authors: [{ name: "Nerf Designs" }],
  keywords: ["Auto", "Admin", "Management", "Dstilez"],
  openGraph: {
    title: "Dstilez Auto Admin",
    description: "A comprehensive management tool for automotive needs.",
    url: "https://nerfdesigns.com",
    // images: [
    //   { url: "URL_to_your_image" }, // Replace with actual image URL
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dstilez Auto Admin",
    description: "A comprehensive management tool for automotive needs.",
  },
};

// data/structuredData.ts
export const localBusinessData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Dstilez Auto Admin",
  // image: "URL_to_your_image",
  address: {
    "@type": "PostalAddress",
    streetAddress: "10 A, Government Rd",
    addressLocality: "Johannesburg North",
    addressRegion: "Fourways",
    postalCode: "2188",
    addressCountry: "ZA",
  },
  telephone: "+27 010 220 5599",
  url: "https://admin.dstilezauto.co.za",
  description: "A comprehensive management tool for automotive needs.",
  openingHours: "Mo-Sat 09:00-17:00",
};
