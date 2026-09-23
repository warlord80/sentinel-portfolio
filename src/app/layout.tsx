import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClientShell } from "@/components/layout/client-shell";
import { site } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.author.name} | ${site.author.jobTitle}`,
    template: `%s | ${site.author.name}`,
  },
  description: site.description,
  authors: [{ name: site.author.name }],
  creator: site.author.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.author.name,
    title: `${site.author.name} | ${site.author.jobTitle}`,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: `${site.author.name} — ${site.author.jobTitle}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.author.name} | ${site.author.jobTitle}`,
    description: site.description,
    images: [site.ogImage],
    creator: "@youravgtechdude",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: site.url,
  },
  other: {
    "theme-color": "#0A0A0D",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.author.name,
    url: site.url,
    jobTitle: site.author.jobTitle,
    description: site.shortDescription,
    email: site.author.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
    },
    sameAs: Object.values(site.social),
    knowsAbout: site.knowsAbout,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.author.name,
    url: site.url,
    description: site.shortDescription,
    author: {
      "@type": "Person",
      name: site.author.name,
      url: site.url,
    },
  };

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://*.supabase.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* TODO: Add Google Search Console verification tag when ready */}
        {/* <meta name="google-site-verification" content="YOUR_TOKEN" /> */}
        {/* TODO: Add Bing Webmaster Tools verification when ready */}
        {/* <meta name="msvalidate.01" content="YOUR_TOKEN" /> */}
      </head>
      <body className="relative min-h-full flex flex-col bg-background text-foreground">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
