"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Check, Lock, Phone } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ADMISSIONS_PHONE_HREF, SECTION_IDS } from "@/lib/constants";
import { hero as content, heroForm } from "@/lib/content";
import { trackCallClick, trackHeroCtaClick, trackLeadSubmit, trackLeadSubmitError } from "@/lib/analytics";

const URGENCY_OPTIONS = heroForm.urgencyOptions.map((label) => ({ label, value: label }));
const RELATIONSHIP_OPTIONS = heroForm.relationshipOptions.map((label) => ({ label, value: label }));

interface HeroFormValues {
  fullName: string;
  phone: string;
  email: string;
  relationship: string;
  urgency: string;
  consent: boolean;
  /** Hidden spam-trap field, mirroring components/sections/Assessment.tsx. */
  company: string;
}

const DEFAULT_VALUES: HeroFormValues = {
  fullName: "",
  phone: "",
  email: "",
  relationship: "",
  urgency: "",
  consent: false,
  company: "",
};

type FormStatus = "idle" | "success" | "error";

/**
 * Input/Select (components/ui/Input.tsx, Select.tsx) hardcode a navy-900
 * label and slate-500 hint color — correct on the white assessment panel,
 * but unreadable on this section's navy-900 form-card surface (same color
 * as the background). Those primitives are out of scope to edit here, so
 * the fix is a scoped Tailwind arbitrary-variant override applied only to
 * the "dark" (card) instance, restyling labels/hints/errors via existing
 * color tokens rather than touching the shared components.
 */
const DARK_SURFACE_FIELD_OVERRIDES =
  "[&_label]:text-white [&_[id$='-hint']]:text-white/70 [&_[id$='-error']]:text-gold-300";

/**
 * Hero consultation form (02-page-structure.md #2, "Consultation form card"
 * + 05-content-en.md "Hero form"). Rendered twice from Hero() below — once
 * inside the always-visible desktop form card, once inside the mobile
 * Modal — so every field id is namespaced by `idPrefix` to avoid duplicate
 * DOM ids between the two instances.
 *
 * Uses React Hook Form's uncontrolled `register()` (name/onChange/onBlur/ref,
 * no `value` prop) rather than passing a controlled `value` to `Select`:
 * Select.tsx unconditionally sets `defaultValue={defaultValue ?? ""}` on the
 * underlying `<select>`, so also passing a controlled `value` prop (as this
 * component originally did with plain useState) trips React's "a component
 * is changing an uncontrolled input to be controlled" warning. `register()`
 * is the same uncontrolled pattern already used successfully for `Select` in
 * components/sections/Assessment.tsx.
 */
function HeroForm({ idPrefix, surface }: { idPrefix: string; surface: "dark" | "light" }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({ defaultValues: DEFAULT_VALUES, mode: "onBlur" });

  // Guards against duplicate rapid submissions via RHF's own in-flight
  // tracking (formState.isSubmitting) rather than a manual ref: reading a
  // ref inside the function passed to handleSubmit() trips the React
  // Compiler's "refs during render" check, since that call happens at
  // render time even though the callback itself only runs on submit.
  const onSubmit = handleSubmit(async (values) => {
    if (!values.phone.trim() && !values.email.trim()) {
      setError("phone", { type: "manual", message: "Provide a phone number or an email address." });
      return;
    }
    setSubmitError(null);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "hero_form",
          fullName: values.fullName,
          phone: values.phone || undefined,
          email: values.email || undefined,
          relationship: values.relationship || undefined,
          urgency: values.urgency || undefined,
          consent: values.consent,
          company: values.company,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.ok) {
        throw new Error(
          typeof payload?.error === "string"
            ? payload.error
            : "We could not submit your request. Please try again, or call Admissions directly.",
        );
      }

      trackLeadSubmit({ urgency: values.urgency || undefined });
      setStatus("success");
    } catch (error) {
      trackLeadSubmitError({ urgency: values.urgency || undefined });
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not submit your request. Please try again, or call Admissions directly.",
      );
      setStatus("error");
    }
  });

  if (status === "success") {
    return (
      <div role="status" className="flex items-start gap-12 rounded-control bg-success/10 p-16">
        <Check aria-hidden className="mt-2 size-20 shrink-0 text-success" />
        <div>
          <p className="font-sans text-body font-weight-semibold text-navy-950">Your request has been received.</p>
          <p className="mt-8 font-sans text-body-s text-navy-800">
            An admissions coordinator will contact you using the details provided.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={["flex flex-col gap-20", surface === "dark" ? DARK_SURFACE_FIELD_OVERRIDES : ""].join(" ")}
    >
      {/* Hidden honeypot: real visitors never see or fill this in. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${idPrefix}-company`}>Leave this field blank</label>
        <input id={`${idPrefix}-company`} type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      {submitError && (
        <div role="alert" className="flex items-start gap-8 rounded-control bg-error/10 p-16">
          <span className="font-sans text-body-s text-error">{submitError}</span>
        </div>
      )}

      <Input
        label="Full name"
        id={`${idPrefix}-fullName`}
        type="text"
        autoComplete="name"
        required
        error={errors.fullName?.message}
        {...register("fullName", { required: "Enter a contact name." })}
      />
      <Input
        label="Phone number"
        id={`${idPrefix}-phone`}
        type="tel"
        autoComplete="tel"
        hint="Provide a phone number or an email address."
        error={errors.phone?.message}
        {...register("phone", {
          validate: (value) => {
            if (!value) return true;
            const digits = value.replace(/\D/g, "");
            return (digits.length >= 7 && digits.length <= 15) || "Enter a valid phone number.";
          },
        })}
      />
      <Input
        label="Email address"
        id={`${idPrefix}-email`}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email", {
          validate: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Enter a valid email address.",
        })}
      />
      <Select
        label="Who needs treatment?"
        id={`${idPrefix}-relationship`}
        options={RELATIONSHIP_OPTIONS}
        placeholder="Select an option"
        {...register("relationship")}
      />
      <Select
        label="How urgent is the situation?"
        id={`${idPrefix}-urgency`}
        options={URGENCY_OPTIONS}
        placeholder="Select an option"
        {...register("urgency")}
      />

      <div>
        <label htmlFor={`${idPrefix}-consent`} className="tap-target flex cursor-pointer items-start gap-12">
          <input
            id={`${idPrefix}-consent`}
            type="checkbox"
            className="focus-ring mt-2 size-20 shrink-0 rounded-sm border-token-interactive [accent-color:var(--color-gold-600)]"
            aria-invalid={Boolean(errors.consent) || undefined}
            aria-describedby={errors.consent ? `${idPrefix}-consent-error` : undefined}
            {...register("consent", { required: "You must agree to be contacted to submit this request." })}
          />
          <span className="font-sans text-body-s">
            I agree to be contacted about this request. This is not emergency medical care.
          </span>
        </label>
        {errors.consent && (
          <p id={`${idPrefix}-consent-error`} role="alert" className="mt-8 font-sans text-body-s text-error">
            {errors.consent.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
        {isSubmitting ? "Submitting securely…" : heroForm.submit}
      </Button>

      <p className="flex items-start gap-8 font-sans text-body-s">
        <Lock aria-hidden className="mt-2 size-14 shrink-0 text-gold-500" />
        <span>{heroForm.securityNote}</span>
      </p>
    </form>
  );
}

/**
 * Section 2, "Hero" (02-page-structure.md): two-column desktop layout (7/5)
 * over the token-driven navy gradient placeholder (no licensed hero photo
 * exists yet, see app/globals.css `hero-gradient-placeholder`). Below the
 * desktop-small breakpoint the visible form card is replaced by a CTA that
 * opens the same form in the shared Modal primitive, per spec.
 */
export function Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  const headingId = useId();

  function handlePrimaryCtaClick(context: "scroll" | "modal") {
    trackHeroCtaClick({ device_category: context === "modal" ? "mobile" : "desktop" });
    if (context === "modal") setModalOpen(true);
  }

  return (
    <section
      id={SECTION_IDS.hero}
      aria-labelledby={headingId}
      className="hero-gradient-placeholder relative isolate min-h-(--size-hero-min-height) overflow-hidden py-64 tablet:py-80"
    >
      {/* Hero photograph per 08-hero-image-brief.md, variant A. The gradient
          utility on the section stays as the loading background, so there is
          no flash of empty navy before the image decodes. */}
      <Image
        src="/images/hero-2560.avif"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover object-right"
      />
      <div aria-hidden className="hero-photo-overlay absolute inset-0 -z-10" />
      <div className="container-max relative grid grid-cols-1 items-center gap-40 desktop-small:grid-cols-12 desktop-small:gap-24">
        <div className="desktop-small:col-span-7">
          <p className="font-sans text-eyebrow font-weight-bold uppercase tracking-eyebrow text-gold-300">
            {content.eyebrow}
          </p>
          <h1
            id={headingId}
            className="mt-16 font-serif text-h1-mobile text-white tablet:text-display-l desktop:text-display-xl"
          >
            {content.headline}
          </h1>
          <p className="mt-24 max-w-(--size-form-card-max) font-sans text-body-l text-white/85">{content.body}</p>

          <ul className="mt-24 flex flex-col gap-12">
            {content.proofBullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-12 font-sans text-body text-white/90">
                <Check aria-hidden className="mt-2 size-20 shrink-0 text-gold-300" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-32 flex flex-col gap-16 tablet:flex-row tablet:items-center">
            <ButtonLink
              href="#hero-form-card"
              variant="primary"
              className="hidden desktop-small:inline-flex"
              onClick={() => handlePrimaryCtaClick("scroll")}
            >
              {content.primaryCta}
            </ButtonLink>
            <Button
              type="button"
              variant="primary"
              className="desktop-small:hidden"
              onClick={() => handlePrimaryCtaClick("modal")}
            >
              {content.primaryCta}
            </Button>

            <ButtonLink
              href={ADMISSIONS_PHONE_HREF}
              variant="darkSecondary"
              icon={<Phone aria-hidden className="size-16" />}
              iconPosition="start"
              onClick={() => trackCallClick({ device_category: "desktop" })}
            >
              {content.secondaryCta}
            </ButtonLink>
          </div>

          <p className="mt-24 font-sans text-body-s text-white/70">{content.microcopy}</p>
        </div>

        <div id="hero-form-card" className="hidden scroll-mt-(--layout-header-height) desktop-small:col-span-5 desktop-small:block">
          <Card variant="form" className="ml-auto">
            <h2 className="font-serif text-h4 text-white">{heroForm.title}</h2>
            <p className="mt-8 font-sans text-body-s text-white/80">{heroForm.subtitle}</p>
            <div className="mt-24">
              <HeroForm idPrefix="hero-desktop" surface="dark" />
            </div>
          </Card>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={heroForm.title} variant="bottomSheet">
        <p className="mb-16 font-sans text-body-s text-slate-700">{heroForm.subtitle}</p>
        <HeroForm idPrefix="hero-mobile" surface="light" />
      </Modal>
    </section>
  );
}
