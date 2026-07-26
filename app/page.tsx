import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhyEurope } from "@/components/sections/WhyEurope";
import { Assessment } from "@/components/sections/Assessment";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Included } from "@/components/sections/Included";
import { TrustProcess } from "@/components/sections/TrustProcess";
import { Suitability } from "@/components/sections/Suitability";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

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
