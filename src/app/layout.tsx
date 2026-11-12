import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { RouteTransitions } from "@/components/RouteTransitions";
import { MotionRoot } from "@/components/motion/MotionPrimitives";
import "./globals.css";
import "./hero-build.css";

/**
 * The three families of the design system, and no others. Spec:
 * design_handoff_ai_foundry_website/DESIGN_SYSTEM.md.
 *
 * Archivo MUST load with the wdth axis or every width stop (125 Cast /
 * 100 Plate / 62 Rail) silently renders at 100 and the whole display
 * voice collapses. Width is controlled with font-stretch, never
 * font-variation-settings, because the latter overrides font-weight and
 * breaks fallback behavior.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
});

// Not a variable family on Google Fonts, so the weights are enumerated.
// 300 exists solely for body text on navy grounds (the optical fix).
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
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
  // Runout preview (brand/runout-2026-11): the favicon set, system v3, draft
  // for BYU Marriott approval. icon.svg is the 32px drawing hand-placed on the
  // pixel grid (round 10 runout-cut), navy, white when the browser is dark;
  // favicon-32.png is the same drawing, favicon.ico carries the 16px drawing
  // too, and the 180/512 app icons are the v3 tile (flat Navy, the whole
  // option 44 master in White, no orange). Concept, pending release. The SVG is listed first
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BYU Marriott School of Business and AI Foundry, draft co-brand lockup (draft for BYU Marriott approval)" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

// Runout preview: the browser chrome on phones matches the navy bar.
export const viewport: Viewport = { themeColor: "#002e5d" };

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
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      {/* RouteTransitions (Runout preview) runs internal navigations through
          the View Transitions API; it replaces the curtain experiment here.
          Pages stay server-rendered: children cross the boundary as a
          ReactNode prop. Remove the wrapper to go back to plain routing. */}
      <body className="min-h-full flex flex-col">
        <noscript><style>{'.m-reveal{opacity:1 !important;transform:none !important;filter:none !important}'}</style></noscript>
        {/* MotionRoot sets reducedMotion="user" for the scroll-entrance
            system; the curtain handles reduced motion itself, outside it. */}
        <RouteTransitions>
          <MotionRoot>{children}</MotionRoot>
        </RouteTransitions>
        {/* System v3: the co-brand lockup is a draft until BYU Marriott
            Marketing approves it (Scott Murff's brief), so every page carries
            "Draft for BYU Marriott approval" as a strip across the top of the
            sticky bar (SiteHeader), visible at every scroll position. */}
      </body>
    </html>
  );
}
