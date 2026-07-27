/**
 * Production copy, transcribed verbatim from 05-content-en.md.
 *
 * Do not edit copy here without updating 05-content-en.md (or vice versa) —
 * this file is the single runtime source of truth for section text so
 * strings never get scattered/duplicated across components.
 *
 * The "Testimonials" section (02-page-structure.md #10) is implemented as
 * `scenarios` below, using the "Scenarios (section 10 replacement)" copy
 * from 05-content-en.md: three illustrative, clearly-labelled example
 * situations, not client stories/testimonials.
 */

export interface NavContent {
  items: string[];
  utility: string;
  cta: string;
}

export const nav: NavContent = {
  items: ["Why Europe", "How It Works", "What's Included", "FAQ"],
  utility: "100% Confidential",
  cta: "Check Availability",
};

export interface HeroContent {
  eyebrow: string;
  headline: string;
  body: string;
  proofBullets: string[];
  primaryCta: string;
  secondaryCta: string;
  microcopy: string;
}

export const hero: HeroContent = {
  eyebrow: "PRIVATE ADDICTION-TREATMENT PLACEMENT IN EUROPE",
  headline: "When treatment can't wait.",
  body: "When your loved one is ready to accept help, the window can be brief. We help families in the United States and Canada identify suitable European treatment options, confirm availability and coordinate admission and travel.",
  proofBullets: [
    "Private-pay admission without insurance delays.",
    "English-speaking coordination from first call to arrival.",
    "A new environment away from familiar triggers and routines.",
  ],
  primaryCta: "Check Availability",
  secondaryCta: "Call Admissions",
  microcopy: "Free initial consultation. No obligation. Completely confidential.",
};

export interface HeroFormContent {
  title: string;
  subtitle: string;
  fields: string[];
  /**
   * Options for the "Who needs treatment?" field. Not enumerated in
   * 05-content-en.md (only the field label is given there) — added here
   * (components/sections/Hero.tsx) as a plain relationship-to-patient list,
   * matching the "Relationship to patient" optional field named in
   * 06-interactions-and-analytics.md. No clinical or outcome content implied.
   */
  relationshipOptions: string[];
  urgencyOptions: string[];
  submit: string;
  securityNote: string;
}

export const heroForm: HeroFormContent = {
  title: "Request a confidential consultation",
  subtitle:
    "Tell us a little about the situation. An admissions coordinator will contact you to discuss the next step.",
  fields: ["Full name", "Phone number", "Email address", "Who needs treatment?", "How urgent is the situation?"],
  relationshipOptions: ["Myself", "My spouse or partner", "My child", "My parent", "Another family member", "A friend"],
  urgencyOptions: ["Today", "Within a few days", "This week", "Researching options"],
  submit: "Speak with Admissions",
  securityNote: "Your information is handled confidentially and is used only to respond to your request.",
};

export const trustStrip: string[] = [
  "Independent placement service",
  "English-speaking coordination",
  "Private-pay access",
  "Supporting families in the US and Canada",
];

export interface WhyEuropeCard {
  title: string;
  body: string;
}

export interface WhyEuropeContent {
  heading: string;
  intro: string;
  cards: WhyEuropeCard[];
}

export const whyEurope: WhyEuropeContent = {
  heading: "Why families consider treatment in Europe",
  intro:
    "For some families, traveling for treatment creates the practical and psychological separation needed to begin again in a genuinely different environment.",
  cards: [
    {
      title: "Faster access",
      body: "Suitable programs may have availability within days, depending on clinical fit and current capacity.",
    },
    {
      title: "A genuinely new environment",
      body: "Treatment begins away from the places, people and routines connected with continued use.",
    },
    {
      title: "Distance from familiar triggers",
      body: "Being far from home can make impulsive returns to the previous environment more difficult and give treatment time to take hold.",
    },
    {
      title: "One coordinator",
      body: "We help coordinate assessment, placement, travel, airport pickup and communication with the family.",
    },
  ],
};

export interface AssessmentStep1 {
  question: string;
  options: string[];
}
export interface AssessmentStep2 {
  question: string;
  options: string[];
}
export interface AssessmentStep3 {
  question: string;
  options: string[];
  underageNote: string;
}
export interface AssessmentStep4 {
  question: string;
  fields: string[];
  consent: string;
  submit: string;
}

export interface AssessmentContent {
  heading: string;
  body: string;
  confidentialityNote: string;
  step1: AssessmentStep1;
  step2: AssessmentStep2;
  step3: AssessmentStep3;
  step4: AssessmentStep4;
  confirmation: { title: string; body: string };
  schedulerCta: string;
}

export const assessment: AssessmentContent = {
  heading: "Is treatment in Europe a realistic option for your family?",
  body: "Answer four short questions. We will review the information and explain which options may be appropriate.",
  confidentialityNote: "Your answers are private and do not commit you to treatment.",
  step1: {
    question: "What is the main concern?",
    options: [
      "Alcohol",
      "Opioids",
      "Cocaine",
      "Methamphetamine",
      "Prescription medication",
      "Multiple substances",
      "Gambling or behavioral addiction",
      "Mental health and substance use",
      "Other",
    ],
  },
  step2: {
    question: "How urgent is the situation?",
    options: [
      "The person is ready now",
      "We need admission within a few days",
      "We are planning for this week",
      "We are researching options",
    ],
  },
  step3: {
    question: "How old is the person who needs treatment?",
    options: ["Under 18", "18–25", "26–40", "41–60", "Over 60"],
    underageNote: "Programs for minors require separate clinical and legal review.",
  },
  step4: {
    question: "Where should we contact you?",
    fields: ["Country", "Full name", "Phone", "Email", "Best time to call"],
    consent: "I agree to be contacted about this request. This is not emergency medical care.",
    submit: "Request My Consultation",
  },
  confirmation: {
    title: "Your request has been received.",
    body: "An admissions coordinator will review the information and contact you using the details provided.",
  },
  schedulerCta: "Choose a Call Time",
};

export interface HowItWorksStep {
  title: string;
  body: string;
}

export interface HowItWorksContent {
  heading: string;
  steps: HowItWorksStep[];
}

export const howItWorks: HowItWorksContent = {
  heading: "A clear path from first call to admission",
  steps: [
    {
      title: "Confidential consultation",
      body: "We listen to what is happening, clarify urgency and explain whether international treatment may be realistic.",
    },
    {
      title: "Initial assessment",
      body: "We gather the clinical, practical and travel information needed to identify appropriate options.",
    },
    {
      title: "Treatment matching",
      body: "We present suitable programs based on clinical needs, budget, availability and level of support.",
    },
    {
      title: "Travel coordination",
      body: "We help organize documentation, flights, arrival instructions, airport pickup and private transfer.",
    },
    {
      title: "Admission and handoff",
      body: "The receiving program completes its admission process and takes responsibility for treatment.",
    },
  ],
};

export interface IncludedContent {
  heading: string;
  items: string[];
  note: string;
}

export const included: IncludedContent = {
  heading: "What we coordinate",
  items: [
    "Initial case review",
    "Treatment-program matching",
    "Availability confirmation",
    "Medical-record coordination",
    "Travel planning",
    "Airport pickup and private transfer",
    "Family communication and aftercare planning",
  ],
  note: "Clinical services are provided by the selected treatment program, not by European Recovery Access.",
};

export interface TrustProcessItem {
  title: string;
  body: string;
}

export interface TrustProcessContent {
  heading: string;
  items: TrustProcessItem[];
}

/** Section 8, "Why Trust the Process" — labelled "Trust section" in 05-content-en.md. */
export const trustProcess: TrustProcessContent = {
  heading: "Built for families who need clarity quickly",
  items: [
    {
      title: "One point of contact",
      body: "You do not have to coordinate several unfamiliar providers at once.",
    },
    {
      title: "Options based on fit",
      body: "We consider clinical needs, urgency, budget, setting and travel requirements.",
    },
    {
      title: "Clear costs before commitment",
      body: "You receive the available program and coordination costs before making a decision.",
    },
    {
      title: "Support across time zones",
      body: "Admissions communication is arranged for families in the United States and Canada.",
    },
  ],
};

export interface SuitabilityContent {
  heading: string;
  suitableList: string[];
  heading2: string;
  unsuitableList: string[];
  emergencyNote: string;
}

export const suitability: SuitabilityContent = {
  heading: "When this service may help",
  suitableList: [
    "Your loved one may accept treatment now.",
    "Local waiting lists are too long.",
    "The current environment is strongly associated with continued use.",
    "Your family wants a structured, private-pay option.",
    "You need help evaluating and coordinating several moving parts.",
  ],
  heading2: "When another first step may be necessary",
  unsuitableList: [
    "There is an immediate medical or psychiatric emergency.",
    "The person needs urgent stabilization before flying.",
    "The person cannot legally travel.",
    "The family is seeking involuntary confinement.",
  ],
  emergencyNote:
    "In an immediate emergency, contact local emergency services or go to the nearest emergency department.",
};

export interface ScenarioCard {
  context: string;
  situation: string;
  response: string;
}

export interface ScenariosContent {
  heading: string;
  subtitle: string;
  cards: ScenarioCard[];
}

/**
 * Section 10 replacement ("Scenarios", 05-content-en.md): three illustrative
 * example situations, explicitly labelled as examples rather than client
 * testimonials/stories per the product constraints in CLAUDE.md.
 */
export const scenarios: ScenariosContent = {
  heading: "What families usually need help with",
  subtitle: "Illustrative examples of typical situations — not client stories.",
  cards: [
    {
      context: "The waiting list",
      situation:
        "Their adult son finally agreed to treatment. The nearest suitable program had a six-week waiting list — and his willingness was measured in days.",
      response:
        "We review the situation the same day, confirm availability at matching European programs, and coordinate admission and travel while the window is open.",
    },
    {
      context: "Too close to home",
      situation:
        "A business owner was ready for treatment, but not at a clinic twenty minutes from her office, her clients and her board.",
      response:
        "A discreet placement abroad: one coordinator, a program on another continent, and family updates through a single confidential channel.",
    },
    {
      context: "The same triggers",
      situation: "Two local programs, two relapses — each time back into the same circle, the same streets, the same phone numbers.",
      response:
        "Distance from familiar surroundings may support continued engagement. We match programs where the environment itself is part of the change, with aftercare planned before departure.",
    },
  ],
};

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: "How quickly can admission happen?",
    answer:
      "Availability depends on the person's clinical needs, travel readiness and current program capacity. In suitable cases, admission may be organized within days.",
  },
  {
    question: "Does insurance cover treatment?",
    answer:
      "Most international placements are private-pay. Some families later request reimbursement from their insurer, but coverage is not guaranteed and should be confirmed directly with the insurer.",
  },
  {
    question: "How much does treatment cost?",
    answer:
      "Most European private residential programs our families consider fall between €3,000 and €30,000 per month, depending on the program, level of medical care, accommodation and length of stay. Coordination fees are separate and quoted upfront. You receive the exact program and coordination costs in writing before any commitment.",
  },
  {
    question: "Can the patient leave treatment?",
    answer:
      "Treatment programs are not prisons. Policies differ by provider and local law. Distance from home and unfamiliar surroundings may reduce impulsive returns to the previous environment, but no ethical provider should promise that a competent adult can never leave.",
  },
  {
    question: "Can the family remain involved?",
    answer:
      "Many programs provide scheduled family communication, family sessions or progress updates, subject to patient consent, clinical policy and confidentiality rules.",
  },
  {
    question: "What if detox is needed?",
    answer:
      "The case must be clinically reviewed. Some programs provide or coordinate medical detox, while others require stabilization before residential admission.",
  },
  {
    question: "Are medications allowed?",
    answer:
      "Medication policies depend on the selected program and prescribing clinician. Current medications must be disclosed during assessment.",
  },
  {
    question: "Is a visa required?",
    answer:
      "Requirements depend on citizenship, destination and length of stay. We help clarify the travel documents required for the proposed placement.",
  },
  {
    question: "How long are programs?",
    answer:
      "Program lengths vary. Common residential options range from several weeks to several months, depending on clinical needs and the treatment model.",
  },
  {
    question: "Is the process confidential?",
    answer:
      "We treat all inquiries as confidential and share information only as needed to evaluate and coordinate the requested placement, subject to applicable law and consent.",
  },
];

export interface FinalCtaContent {
  headline: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  microcopy: string;
}

export const finalCta: FinalCtaContent = {
  headline: "Your family may only get one clear window for treatment.",
  body: "We help you understand the options and move quickly when the time is right.",
  primaryCta: "Check Availability",
  secondaryCta: "Call Admissions",
  microcopy: "Free initial consultation. No obligation.",
};

export interface FooterContent {
  descriptor: string;
  disclaimer: string;
  companyLine1: string;
  companyLine2: string;
}

export const footer: FooterContent = {
  descriptor:
    "Independent European addiction-treatment placement and admissions coordination for families in the United States and Canada.",
  disclaimer:
    "European Recovery Access is an independent placement and coordination service. It is not a treatment provider, emergency service or substitute for medical advice. Admission is subject to clinical suitability, legal requirements and provider availability.",
  // "Company block (footer)", 05-content-en.md.
  companyLine1:
    "European Recovery Access is a service of MK REHAB DOO, a limited liability company registered in Montenegro (reg. no. 5-1051097/002, PIB 03459586).",
  companyLine2: "Registered address: Vojina Katnića, ulaz C-14, stan 19, Podgorica, Montenegro.",
};

/**
 * Mandatory disclaimer text from 02-page-structure.md, section 13 (Footer).
 * Distinct wording from `footer.disclaimer` above (05-content-en.md) — used
 * verbatim on the legal pages per the technical spec's instruction to source
 * that specific text from 02-page-structure.md.
 */
export const legalDisclaimer =
  "European Recovery Access is an independent placement and coordination service. It is not an emergency service and does not provide emergency medical care. Program availability and admission depend on clinical suitability and provider capacity.";
