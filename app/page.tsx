import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhyEurope } from "@/components/sections/WhyEurope";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Included } from "@/components/sections/Included";
import { TrustProcess } from "@/components/sections/TrustProcess";
import { Suitability } from "@/components/sections/Suitability";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

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
      <Hero />
      <TrustStrip />
      <WhyEurope />
      <Assessment />
      <HowItWorks />
      <Included />
      <TrustProcess />
      <Suitability />

      {/*
        TODO(Section 10, "Testimonials" — 02-page-structure.md): the MVP
        recommendation there is "What families usually need help with" plus
        three anonymized scenario cards clearly marked as examples, not
        client stories. 05-content-en.md provides no production copy for
        this section, and per CLAUDE.md's product constraints, no
        testimonial/scenario copy may be invented — so this section is
        intentionally omitted until real copy is drafted. SECTION_IDS.scenarios
        (lib/constants.ts) is reserved for it but currently unused/unlinked.
      */}

      <FAQ />
      <FinalCTA />
    </>
  );
}
