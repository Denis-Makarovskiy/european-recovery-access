import { z } from "zod";

/**
 * Lead payload schema, per the "Lead API" input schema in
 * 07-codex-technical-spec.md. This is the shared shape used by both the
 * hero form and the assessment form; the `/api/lead` route (built in a
 * later task) is responsible for rate limiting, honeypot handling and
 * persistence — this file only owns shape + field-level validation.
 */

export const leadSourceSchema = z.enum(["hero_form", "assessment"]);
export type LeadSource = z.infer<typeof leadSourceSchema>;

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));

export const leadSchema = z
  .object({
    source: leadSourceSchema,
    fullName: z.string().trim().min(1, "Full name is required.").max(120, "Full name is too long."),
    phone: optionalTrimmedString(40),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254)
      .optional()
      .or(z.literal(""))
      .transform((value) => (value ? value : undefined)),
    country: optionalTrimmedString(80),
    relationship: optionalTrimmedString(80),
    patientAge: optionalTrimmedString(40),
    concern: optionalTrimmedString(200),
    urgency: optionalTrimmedString(80),
    callbackTime: optionalTrimmedString(80),
    consent: z.literal(true, {
      error: "You must agree to be contacted to submit this form.",
    }),
  })
  .refine((data) => Boolean(data.phone) || Boolean(data.email), {
    message: "Provide a phone number or an email address.",
    path: ["phone"],
  });

export type LeadInput = z.infer<typeof leadSchema>;

/** Convenience wrapper returning a discriminated success/error result. */
export function parseLead(data: unknown) {
  return leadSchema.safeParse(data);
}
