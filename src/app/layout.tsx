import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { CurtainRouteProvider } from "@/components/CurtainRoute";
import { MotionRoot } from "@/components/motion/MotionPrimitives";
import "./globals.css";

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

/** BYU Navy browser chrome on phones, matching the header (AF Stride demo v2). */
export const viewport: Viewport = { themeColor: "#002E5D" }

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
  // AF Stride demo v2 (brand/stride-2026-11): the kit's hand-drawn one-colour
  // favicons of the round 8 master (navy for light browser chrome, white for
  // dark), the navy app icon for iOS, and src/app/favicon.ico for the rest.
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.svg", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
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
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      {/* CurtainRouteProvider runs internal link clicks through the View
          Transitions API (AF Stride demo). Pages stay server-rendered:
          children cross the boundary as a ReactNode prop. Remove this
          wrapper to turn route transitions off. */}
      <body className="min-h-full flex flex-col">
        <noscript><style>{'.m-reveal{opacity:1 !important;transform:none !important}'}</style></noscript>
        {/* MotionRoot sets reducedMotion="user" for the scroll-entrance
            system; the curtain handles reduced motion itself, outside it. */}
        <CurtainRouteProvider>
          <MotionRoot>{children}</MotionRoot>
        </CurtainRouteProvider>
      </body>
    </html>
  );
}
