import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://earlyhunt.com"),
  title: {
    default: "EarlyHunt — AI Hunt Platform for Weekly Launches",
    template: "%s | EarlyHunt",
  },
  description:
    "Hunt early AI products and weekly launches on EarlyHunt. Browse free founder tools, including the Launch Directory Finder.",
  applicationName: "EarlyHunt",
  authors: [{ name: "EarlyHunt", url: "https://earlyhunt.com" }],
  creator: "EarlyHunt",
  publisher: "EarlyHunt",
  robots: { index: true, follow: true },
  openGraph: {
    siteName: "EarlyHunt",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@praneetbrar",
    creator: "@praneetbrar",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#222288",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white font-sans text-gray-900 antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
