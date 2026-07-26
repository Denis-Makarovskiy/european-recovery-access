import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";
import { SITE_NAME, SITE_URL, ADMISSIONS_PHONE_DISPLAY } from "@/lib/constants";
import { GA_ID, IS_ANALYTICS_CONFIGURED } from "@/lib/analytics";

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
    // No licensed OG image exists yet — omitted rather than pointing at a
    // fabricated asset. Add one (1200x630) before launch.
  },
  twitter: {
    // "summary_large_image" needs an accompanying image; using "summary"
    // until a real OG/Twitter image is produced.
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  telephone: ADMISSIONS_PHONE_DISPLAY,
  areaServed: ["US", "CA"],
  // FAQPage schema is intentionally omitted here: 07-codex-technical-spec.md
  // only allows it once it exactly matches the visible FAQ content, and the
  // FAQ section itself hasn't been built yet.
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
        <Header />
        <main className="flex-1 pb-104 pt-(--layout-header-height) tablet:pb-0">{children}</main>
        <Footer />
        <MobileStickyBar />
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
