# 7. Technical Specification for Codex

## Objective

Build a production-ready, responsive landing page for **European Recovery Access**, an independent addiction-treatment placement and admissions coordination service for families in the United States and Canada.

The implementation must closely follow the supplied visual direction and design system while prioritizing conversion, speed, accessibility and maintainability.

## Required stack

- Next.js 15 or current stable version.
- App Router.
- TypeScript in strict mode.
- Tailwind CSS.
- React Hook Form.
- Zod validation.
- Lucide React icons.
- Framer Motion only for subtle entrance and accordion motion.
- `next/font` for Inter and Source Serif 4.

## Project structure

```text
app/
  layout.tsx
  page.tsx
  privacy/page.tsx
  terms/page.tsx
  api/lead/route.ts
components/
  layout/
    Header.tsx
    Footer.tsx
    MobileStickyBar.tsx
  sections/
    Hero.tsx
    TrustStrip.tsx
    WhyEurope.tsx
    Assessment.tsx
    HowItWorks.tsx
    Included.tsx
    TrustProcess.tsx
    Suitability.tsx
    FAQ.tsx
    FinalCTA.tsx
  ui/
    Button.tsx
    Input.tsx
    Select.tsx
    ChoiceChip.tsx
    Card.tsx
    Accordion.tsx
    Progress.tsx
    Modal.tsx
lib/
  analytics.ts
  validation.ts
  content.ts
  constants.ts
public/
  images/
  icons/
```

## Page requirements

### Header

- Sticky.
- Desktop navigation with smooth scroll.
- Mobile menu drawer.
- Phone CTA.
- Header background changes after scroll.

### Hero

- Responsive image using `next/image`.
- Dark gradient overlay.
- Left copy column.
- Right consultation form on desktop.
- On mobile, replace the form card with a CTA that opens the form in a modal or bottom sheet.

### Assessment

- Four-step form.
- Preserve answers between steps.
- Back and Continue controls.
- Keyboard accessible choice chips.
- Progress indicator.
- Final submission through `/api/lead`.
- Display success and error states.

### FAQ

- Accessible accordion.
- One item may be open at a time.
- Update `aria-expanded` and `aria-controls`.

### Mobile sticky bar

- Visible below 768 px.
- Two actions: Call and Check Availability.
- Respect safe-area insets on iOS.

## Lead API

Create a server route:

`POST /api/lead`

Input schema:

```ts
{
  source: 'hero_form' | 'assessment';
  fullName: string;
  phone?: string;
  email?: string;
  country?: string;
  relationship?: string;
  patientAge?: string;
  concern?: string;
  urgency?: string;
  callbackTime?: string;
  consent: true;
}
```

Requirements:

- Validate using Zod.
- Require at least phone or email.
- Sanitize strings.
- Add rate limiting.
- Add honeypot field.
- Do not log full sensitive payloads.
- Return generic public errors.

MVP integration options:

1. Post to a configurable webhook.
2. Send through Resend.
3. Save to a CRM endpoint.

Use environment variables:

```text
LEAD_WEBHOOK_URL=
RESEND_API_KEY=
ADMISSIONS_EMAIL=
NEXT_PUBLIC_ADMISSIONS_PHONE=
NEXT_PUBLIC_SCHEDULER_URL=
NEXT_PUBLIC_GA_ID=
```

If integrations are not configured, the development build may write a redacted lead summary to the server console.

## Analytics

Implement helper functions in `lib/analytics.ts`.

Do not send personally identifiable information or sensitive health information to analytics.

Track:

- CTA clicks.
- Assessment start.
- Step completion.
- Successful lead submission.
- Scheduler opening.
- Phone clicks.
- FAQ opens.

## SEO

Metadata:

Title:

`Private Addiction Treatment in Europe | European Recovery Access`

Description:

`Confidential placement and admissions coordination for families seeking private addiction treatment in Europe. Treatment matching, travel support and fast availability review.`

Requirements:

- Canonical URL placeholder.
- Open Graph metadata.
- Twitter card metadata.
- Organization schema.
- FAQ schema only if visible FAQ content exactly matches the schema.
- Semantic headings.
- One H1.

## Performance

Target Lighthouse mobile:

- Performance: 90+.
- Accessibility: 95+.
- Best practices: 95+.
- SEO: 95+.

Requirements:

- Hero image AVIF/WebP.
- Correct image sizes.
- No autoplay video.
- Minimal client components.
- Lazy-load below-fold images.
- Avoid layout shift.

## Accessibility

- WCAG AA.
- Full keyboard navigation.
- Visible focus states.
- Form labels always present.
- Error summaries for submission failures.
- Reduced-motion support.
- Minimum tap target 44 px.

## Styling rules

- Use tokens from `design-tokens.json`.
- Do not hardcode repeated colors or spacing values.
- Avoid excessive rounded cards.
- No gradients except hero overlays and subtle final CTA background.
- No bright medical blue.
- No stock “doctor with clipboard” imagery.

## Content

Use the exact production copy in `05-content-en.md` as the initial content source.

Store section copy in `lib/content.ts` rather than scattering long strings throughout components.

## Legal pages

Create simple placeholder pages for:

- Privacy Policy.
- Terms of Use.

Include a visible disclaimer that the service is not an emergency service or treatment provider.

## Definition of done

- Responsive at 375, 768, 1024, 1280 and 1440 px.
- No horizontal scrolling.
- Forms work with keyboard and screen reader.
- API validates and handles errors.
- Mobile sticky bar works with iOS safe area.
- All CTAs use consistent event tracking.
- No fabricated testimonials or outcome claims.
- Content is editable from a central content file.
- README contains local setup and deployment instructions.
