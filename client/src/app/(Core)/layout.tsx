import { checkRole } from "@/lib/roles";
import { localBusinessData, siteConfig } from "@/lib/siteConfig";
import StructuredData from "@/lib/StructuredData";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  authors: siteConfig.authors,
  keywords: siteConfig.keywords,
  openGraph: {
    title: siteConfig.openGraph.title,
    description: siteConfig.openGraph.description,
    url: siteConfig.openGraph.url,
    // images: siteConfig.openGraph.images,
  },
  // twitter: {
  //   card: siteConfig.twitter.card,
  //   title: siteConfig.twitter.title,
  //   description: siteConfig.twitter.description,
  // },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole("admin")) {
    redirect("/notallowed");
  }
  return (
    <>
      {children}
      <StructuredData data={localBusinessData} />
    </>
  );
}
