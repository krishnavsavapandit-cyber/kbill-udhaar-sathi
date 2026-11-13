import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Udhaar Saathi | Digital Khata for Local Shopkeepers",
  description: "A fast, simple, mobile-first credit notebook (udhaar khata) for small shopkeepers in India.",
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
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <LanguageProvider>
          <div className="flex-1 max-w-md mx-auto w-full bg-white shadow-xl min-h-screen flex flex-col border-x border-slate-200/80">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
