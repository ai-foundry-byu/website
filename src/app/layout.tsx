import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { CurtainRouteProvider } from "@/components/CurtainRoute";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Transitional / editorial serif for headlines — the Lyon/Tiempos free analog.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const TITLE = "AI Foundry | BYU Marriott School of Business";
const DESCRIPTION =
  "An AI-native product studio and consultancy, and an experiential learning program of the BYU Marriott School of Business. Students scope real projects and ship production systems for real clients.";

export const metadata: Metadata = {
  // byu-aifoundry.com currently serves a second live copy of this site from
  // another Vercel account. Until that redirects, this tells search engines
  // which host is authoritative and makes every OG/Twitter image URL absolute
  // against the official domain rather than whichever host served the page.
  metadataBase: new URL("https://aifoundry.byu.edu"),
  alternates: { canonical: "/" },
  // Subpages set only their own title; this appends the identification that
  // brand rules require, so "AI Foundry" never appears on its own.
  title: {
    default: TITLE,
    template: "%s | AI Foundry, BYU Marriott School of Business",
  },
  description: DESCRIPTION,
  // A plain BYU navy square, a deliberate placeholder: the anvil mark is
  // under consideration and no official logo is approved yet (2026-08-01).
  // When one is, regenerate this whole set from it. The SVG is listed first
  // because browsers that understand it prefer it and it stays sharp at any
  // size; the PNG is the fallback for those that do not. src/app/favicon.ico
  // is picked up by Next automatically and covers everything older.
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/favicon-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BYU AI Foundry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-scroll-behavior is required as of Next 16. globals.css sets
    // scroll-behavior: smooth for the #quote anchor, and without this
    // attribute Next no longer suppresses it during route changes, so
    // navigating between pages would slowly glide instead of landing at top.
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      {/* CurtainRouteProvider is the corbin-curtain-site preview experiment:
          header-nav route changes run behind a curtain. Pages stay server-
          rendered — children cross the boundary as a ReactNode prop. Remove
          this wrapper (and CurtainRoute.tsx) to kill the experiment. */}
      <body className="min-h-full flex flex-col">
        <CurtainRouteProvider>{children}</CurtainRouteProvider>
      </body>
    </html>
  );
}
