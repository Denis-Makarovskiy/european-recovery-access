import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhyEurope } from "@/components/sections/WhyEurope";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Included } from "@/components/sections/Included";
import { TrustProcess } from "@/components/sections/TrustProcess";
import { Suitability } from "@/components/sections/Suitability";
import { Scenarios } from "@/components/sections/Scenarios";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { faq as faqContent } from "@/lib/content";

/**
 * FAQPage schema lives HERE, not in app/layout.tsx: Google's guidance only
 * permits FAQ structured data on pages where the FAQ content is actually
 * visible, and the accordion renders on this page alone. Generated from the
 * same `faq` array the accordion uses, so markup and visible text cannot
 * drift (07-codex-technical-spec.md requires exact correspondence).
 * `stripHtml` is defensive — the copy carries no markup today, but the
 * emitted JSON-LD must never contain any if that changes.
 */
function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqContent.map((item) => ({
    "@type": "Question",
    name: stripHtml(item.question),
    acceptedAnswer: {
      "@type": "Answer",
      text: stripHtml(item.answer),
    },
  })),
};

/**
 * Section 5 ("Interactive Assessment") pulls in react-hook-form, zod and its
 * own share of framer-motion (via Modal's siblings) but sits far below the
 * fold. next/dynamic code-splits its client bundle into a separate chunk
 * fetched after the initial page script, cutting those libraries out of the
 * first-load JS. `ssr` is left at its default (true) — required in a Server
 * Component like this page anyway (next/dynamic forbids `ssr: false` here) —
 * so the section is still fully rendered into the static HTML: its content,
 * the `#assessment` anchor target used by header nav and the mobile sticky
 * bar, and its indexability all stay intact with JavaScript disabled. Since
 * the markup is present from the static HTML itself there is no loading
 * flash to reserve space for — the SSR'd content already occupies its final
 * layout position before the split chunk finishes hydrating it.
 */
const Assessment = dynamic(() => import("@/components/sections/Assessment").then((mod) => mod.Assessment));

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <TrustStrip />
      <WhyEurope />
      <Assessment />
      <HowItWorks />
      <Included />
      <TrustProcess />
      <Suitability />
      <Scenarios />
      <FAQ />
      <FinalCTA />
    </>
  );
}
