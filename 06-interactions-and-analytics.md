# 6. Interactions, Form Logic and Analytics

## Main conversion paths

Path A:

Hero CTA → Assessment → Contact details → Thank-you state → Scheduler.

Path B:

Hero form → Thank-you state → Scheduler.

Path C:

Call Admissions → Trackable phone call.

Path D:

FAQ or final CTA → Assessment.

## Form behavior

- Preserve data when moving between steps.
- Validate fields inline.
- Format North American phone numbers where possible, but accept international format.
- Do not block submission solely because a phone number does not match a US format.
- Use server-side validation.
- Add hidden spam protection.
- Prevent duplicate rapid submissions.

## Suggested qualification fields

Required:

- Main concern.
- Urgency.
- Patient age.
- Contact name.
- Phone or email.
- Country.
- Consent checkbox.

Optional:

- Relationship to patient.
- Estimated budget range.
- Need for detox.
- Ability to travel.
- Preferred callback time.

For the initial MVP, avoid showing budget as the first question. It can reduce completion and may feel transactional.

## Lead routing

Suggested statuses:

1. New.
2. Attempted contact.
3. Reached.
4. Assessment scheduled.
5. Qualified.
6. Options presented.
7. Admission pending.
8. Admitted.
9. Not suitable.
10. Lost.

## Analytics events

Use GA4 or a privacy-conscious alternative.

Events:

- `page_view`
- `hero_cta_click`
- `call_click`
- `assessment_start`
- `assessment_step_complete`
- `assessment_complete`
- `lead_submit`
- `lead_submit_error`
- `scheduler_open`
- `scheduler_booking_complete`
- `faq_open`
- `scroll_50`
- `scroll_90`

Event properties:

- Device category.
- Country.
- Traffic source.
- Campaign.
- Urgency answer.
- Main concern.
- Assessment step.

Do not send names, phone numbers, email addresses or sensitive clinical free text to analytics platforms.

## MVP success metrics

Primary:

- Qualified consultation requests.
- Cost per qualified consultation.
- Contact rate.
- Consultation-booking rate.

Secondary:

- Hero CTA click-through rate.
- Assessment start rate.
- Assessment completion rate.
- Form completion rate.
- Mobile versus desktop conversion.

## Initial thresholds for decision-making

These are working product thresholds, not universal benchmarks:

- Assessment start: at least 8–12% of relevant paid traffic.
- Assessment completion: at least 35% of starts.
- Lead submission: at least 3–6% of relevant landing-page sessions.
- Contact rate: above 50% of submitted leads.

Evaluate lead quality manually. A lower conversion with serious private-pay families is more valuable than a high conversion full of irrelevant inquiries.

## A/B tests after the first traffic sample

Test 1:

- “When treatment can't wait.”
- Versus “Private addiction treatment in Europe — without long waiting lists.”

Test 2:

- Assessment-first CTA.
- Versus direct consultation form.

Test 3:

- Hero image of a facility.
- Versus calm human/family image.

Test 4:

- “Check Availability.”
- Versus “Speak with Admissions.”

Do not test several major variables at once during low traffic.
