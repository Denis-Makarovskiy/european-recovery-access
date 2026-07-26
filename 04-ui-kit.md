# 4. UI Kit

## Buttons

### Primary

- Background: Gold 500.
- Text: Navy 950.
- Height: 52 px desktop, 54 px mobile.
- Horizontal padding: 24 px.
- Radius: 10 px.
- Hover: Gold 300.
- Active: Gold 600.
- Focus: 3 px gold focus ring.
- Disabled: Slate 200 background, Slate 500 text.

Label examples:

- Check Availability.
- Speak with Admissions.
- Continue.

### Secondary

- Background: transparent.
- Border: 1 px solid Navy 700.
- Text: Navy 800.
- Hover: Navy 100 tint.

### Dark secondary

Used on dark backgrounds.

- Border: rgba(255,255,255,0.45).
- Text: white.
- Hover background: rgba(255,255,255,0.08).

### Text link

- Text: Navy 800.
- Underline on hover.
- Arrow icon optional.

## Inputs

Height: 52 px.

Default:

- White background.
- Slate 300 border.
- Navy 950 input text.
- Slate 500 placeholder.

Focus:

- Gold 600 border.
- Gold focus ring.

Error:

- Error border.
- Error message below, 14 px.

Fields:

- Text.
- Email.
- Tel.
- Select.
- Textarea.

## Selection chips

Use for assessment answers.

Default:

- White background.
- Slate 200 border.
- Navy 900 text.
- 48 px minimum height.

Selected:

- Gold 100 background.
- Gold 600 border.
- Navy 950 text.
- Check icon.

## Cards

### Benefit card

- White background.
- 16 px radius.
- 32 px padding.
- Low shadow.
- Icon circle 56 px.
- Hover translateY(-6 px) on pointer devices.

### Form card

- Navy 900 background.
- White text.
- 24 px radius.
- 32–40 px padding.
- High shadow.

### Assessment panel

- Off-white or white.
- 24 px radius.
- 40–56 px padding desktop.
- 24 px padding mobile.

### Scenario card

- White background.
- Left gold rule.
- Context label.
- Short problem statement.
- Service response.

## Badge

- Pill shape.
- 28–32 px height.
- Small icon.
- Used for “Confidential”, “Private Pay”, “USA & Canada”.

## Accordion

Closed:

- White background.
- Bottom border.
- 18 px question.
- Plus icon.

Open:

- Minus icon.
- 16–17 px body.
- 16 px top spacing.
- Smooth height transition under 220 ms.

## Progress indicator

Assessment:

- “Step 1 of 4.”
- 4 px progress bar.
- Navy 800 track and Gold 500 progress.

## Navigation

Desktop:

- Text links with 44 px hit area.
- Active/hover state: Navy 900 + subtle underline.

Mobile:

- Full-screen drawer.
- Large links.
- Sticky CTA at bottom.

## Alerts

### Success

- Light green surface.
- Success icon.
- Clear next step.

### Error

- Light red surface.
- Explain what failed.
- Preserve entered form data.

## Loading

Do not use a fake two-second delay.

Use:

- Button spinner during submission.
- “Submitting securely…” label.
- Skeleton only when loading external scheduler.
