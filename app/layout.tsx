import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";
import { SITE_NAME, SITE_URL, ADMISSIONS_PHONE_DISPLAY } from "@/lib/constants";
import { GA_ID, IS_ANALYTICS_CONFIGURED } from "@/lib/analytics";
import { YandexMetrica } from "@/components/analytics/YandexMetrica";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "Private Addiction Treatment in Europe | European Recovery Access";
const DESCRIPTION =
  "Confidential placement and admissions coordination for families seeking private addiction treatment in Europe. Treatment matching, travel support and fast availability review.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    // TODO: SITE_URL (lib/constants.ts) is a placeholder domain — update
    // once the production domain is confirmed, which also fixes this canonical.
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    // app/opengraph-image.png (1200x630) is picked up automatically by
    // Next's file-based metadata convention.
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  // Search console ownership verification. Next only renders each meta tag
  // when its value is defined, so these are absent from the page until the
  // corresponding env var is set.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
  },
};

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  telephone: ADMISSIONS_PHONE_DISPLAY,
  areaServed: ["US", "CA"],
};

/**
 * Sibling Service node (not merged into Organization) describing the
 * placement/admissions-coordination service itself, referencing the
 * Organization above as `provider`.
 *
 * Deliberately typed as generic `Service`, not `MedicalBusiness` /
 * `MedicalClinic` / `Physician` / `Hospital` or any other health-provider
 * schema.org type: per 01-product-brief.md this business is not a clinic or
 * medical provider, and misrepresenting it in structured data would be worse
 * than omitting the schema. No aggregateRating/review and no invented
 * numbers, per the same brief.
 */
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: `${SITE_NAME} — Addiction Treatment Placement & Admissions Coordination`,
  serviceType: "Addiction treatment placement and admissions coordination",
  description: DESCRIPTION,
  provider: { "@id": ORGANIZATION_ID },
  areaServed: ["US", "CA"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif4.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-off-white text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        <Header />
        <main className="flex-1 pb-104 pt-(--layout-header-height) tablet:pb-0">{children}</main>
        <Footer />
        <MobileStickyBar />
        <YandexMetrica />
        {IS_ANALYTICS_CONFIGURED && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
