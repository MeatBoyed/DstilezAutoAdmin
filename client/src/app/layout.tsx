import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "../components/Navbar";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <main className="w-full flex justify-center items-center flex-col gap-10">
          <ClerkProvider>
            <Navbar />
            <div className="flex justify-center items-center px-4  w-full sm:max-w-3xl lg:max-w-5xl xl:px-0 min-h-[70vh]">
              <Suspense fallback={<Loader2 size={30} className="animate-spin" />}>
                {children}
                <Toaster richColors closeButton />
              </Suspense>
            </div>
            <Footer />
          </ClerkProvider>
        </main>
      </body>
    </html>
  );
}
