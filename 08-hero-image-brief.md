# 8. Hero Image Brief

Technical brief for generating the hero background image. Written for an image model (OpenAI `gpt-image-1` / DALL·E 3), but the constraints apply to a licensed photograph equally.

The current build ships a navy gradient placeholder (`hero-gradient-placeholder` in `app/globals.css`). This brief defines what replaces it.

## 1. Output specification

| Parameter | Value |
| --- | --- |
| Generation size | 1536 × 1024 (landscape) |
| Final delivery | 2560 × 1440 and 1280 × 720 |
| Aspect ratio | 16:9, full-bleed |
| Format | AVIF primary, WebP fallback |
| Weight budget | ≤ 250 KB at 2560 px, ≤ 90 KB at 1280 px |
| Colour profile | sRGB |
| Text in image | None. No lettering, signage, watermarks or logos |

Generate at 1536 × 1024, then upscale and crop to 16:9. Do not stretch.

## 2. Composition constraints

The image is a background. Content sits on top of it:

- **Left 0–50 %** — headline, body copy, three proof bullets, primary CTA. Must be visually quiet: sky, water, mist, foliage in shadow, or plain wall. No high-contrast edges, no busy texture, no subject.
- **Right 62–95 %** — the consultation form card sits here on desktop. Anything placed there will be covered. Do not put the subject here.
- **Centre 50–62 % and lower third** — where visual interest belongs.
- A dark navy overlay (`#071A2D`) is applied on top: roughly 85 % opacity at the left edge falling to 35 % at the right. Design for a dark, low-contrast final result — a bright or high-key image will fight the overlay.

Mobile crops to a near-square centre region, so the composition must survive a centre crop.

## 3. Subject direction

Pick one. Variant A is the recommended default.

**A — European residential clinic exterior.** A discreet contemporary residence in an alpine or lakeside setting. Stone and timber, large glazing, low horizontal massing. Early morning, soft overcast daylight, mist in the valley. No signage, no cars, no people.

**B — Quiet interior.** An empty common room in a residential facility: linen upholstery, oak floor, floor-to-ceiling window onto forest or mountain. Natural side light, no lamps switched on. Reads as a private home, not a hospital or a hotel lobby.

**C — Landscape with implied architecture.** Lake or forested valley at first light, a single modern building barely visible in the middle distance. The calmest option, the least literal.

## 4. Mood

Calm, competent, discreet, decisive, human. Premium but not luxurious. A place a family would trust with a serious decision.

Not: clinical, sterile, corporate, aspirational, glamorous, melancholic.

## 5. Prohibited content

From `01-product-brief.md` and `03-design-system.md`:

- Beaches, pools, yachts, spa or resort cues, cocktails, nightlife, any alcohol.
- Medical staff, white coats, stethoscopes, clipboards, hospital corridors, medical equipment.
- Visibly intoxicated, distressed or crying people.
- Locked doors, barred windows, fences, gates, corridors that read as confinement.
- Identifiable faces. Prefer no people at all — a generated person cannot be consent-cleared, and the brief permits human imagery only when licensed.
- National flags, religious symbols, brand marks, recognisable landmarks.
- Bright medical blue. HDR, heavy vignette, lens flare, oversaturation, tilt-shift.

## 6. Palette

Anchor to the design system: navy `#071A2D`–`#1A4E7A`, slate neutrals, muted gold `#CDA55F` only as a warm accent in the light. Desaturated, cool, natural. Green foliage muted, never vivid.

## 7. Prompts

### Variant A — recommended

```text
Wide cinematic architectural photograph of a discreet contemporary residential
retreat in the European Alps at early morning. Low horizontal building in stone,
timber and large glazing, set among pine forest with a misted valley behind it.
Soft overcast daylight, no direct sun, thin ground mist. Deep navy and cool slate
colour palette, desaturated, muted green foliage, one warm amber reflection in the
glass. Left half of the frame is open sky and mist with no detail or contrast; the
building sits in the centre and lower right of the frame. Calm, private, premium,
restrained. Shot on a 35mm lens, natural perspective, no people, no vehicles, no
signage, no text.
```

### Variant B — interior

```text
Wide interior photograph of an empty, quiet common room in a private European
residential retreat. Oak floor, linen upholstered armchairs, a low table, warm
minimal furnishing, floor-to-ceiling window looking onto pine forest and mountains.
Soft natural side light from the left, overcast morning, no artificial lighting.
Deep navy, slate and warm neutral palette, desaturated and calm. The left third of
the frame is a plain shadowed wall with no detail; furniture and window sit centre
and right. Reads as a private home, not a hospital or hotel. No people, no medical
equipment, no signage, no text.
```

### Variant C — landscape

```text
Wide landscape photograph of a still alpine lake at first light, dark pine forest
along the far shore, low mist over the water, mountains fading into cool haze. A
single low modern building with lit windows barely visible in the middle distance
on the right. Deep navy and slate palette, heavily desaturated, soft flat light, no
direct sun. The left half of the frame is empty water and mist with no detail.
Quiet, private, unhurried. No people, no boats, no signage, no text.
```

### Negative prompt

```text
text, letters, watermark, logo, signage, people, faces, medical staff, white coats,
hospital, clinic signage, medical equipment, beach, pool, yacht, resort, spa,
cocktails, alcohol, nightlife, fences, bars on windows, locked doors, bright blue,
oversaturated, HDR, lens flare, heavy vignette, tilt-shift, cartoon, illustration,
3D render, distorted architecture
```

## 8. Acceptance checklist

- [ ] Left half stays legible under white 68 px display type with the navy overlay applied.
- [ ] No subject in the right 62–95 % band, where the form card sits.
- [ ] Composition survives a centre square crop for mobile.
- [ ] No people, no text, no prohibited content from section 5.
- [ ] Palette sits inside the design system; nothing fights the gold CTA.
- [ ] Delivered as AVIF + WebP at both sizes, inside the weight budget.

## 9. Integration

Place the files in `public/images/` as `hero-2560.avif`, `hero-2560.webp`, `hero-1280.avif`, `hero-1280.webp`. Then in `components/sections/Hero.tsx`, replace the `hero-gradient-placeholder` element with `next/image` using `priority`, `fill`, `sizes="100vw"`, and keep the existing overlay layer above it. The gradient remains the loading background, so there is no flash of empty navy.
