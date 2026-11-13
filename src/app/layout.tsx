import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Udhaar Saathi | Digital Khata & Profit Assistant for Local Kirana",
  description: "A fast, friendly, mobile-first and desktop-ready credit notebook (udhaar khata) for small shopkeepers in India.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#047857",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#FAF7F0] text-slate-900 antialiased min-h-screen flex flex-col selection:bg-amber-200 selection:text-amber-950">
        <LanguageProvider>
          <div className="flex-1 w-full min-h-screen flex flex-col">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
