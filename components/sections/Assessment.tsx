"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Controller, useForm, type FieldErrors, type Resolver } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChoiceChip } from "@/components/ui/ChoiceChip";
import { Input } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { Select } from "@/components/ui/Select";
import { IS_SCHEDULER_CONFIGURED, LEAD_ENDPOINT, SCHEDULER_URL, SECTION_IDS } from "@/lib/constants";
import { assessment as content } from "@/lib/content";
import {
  trackAssessmentComplete,
  trackAssessmentStart,
  trackAssessmentStepComplete,
  trackLeadSubmit,
  trackLeadSubmitError,
  trackSchedulerOpen,
} from "@/lib/analytics";

const TOTAL_STEPS = 4;

const COUNTRY_OPTIONS = [
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
];

interface AssessmentFormValues {
  concern: string;
  urgency: string;
  patientAge: string;
  country: string;
  fullName: string;
  phone: string;
  email: string;
  callbackTime: string;
  consent: boolean;
  /** Hidden spam-trap field. Real visitors never fill this in. */
  fax_number: string;
}

const DEFAULT_VALUES: AssessmentFormValues = {
  concern: "",
  urgency: "",
  patientAge: "",
  country: "",
  fullName: "",
  phone: "",
  email: "",
  callbackTime: "",
  consent: false,
  fax_number: "",
};

/**
 * Client-side UX validation for the wizard. Deliberately separate from
 * lib/validation.ts's `leadSchema`: the lead payload is re-validated
 * server-side by the Cloudflare Worker in worker/, which keeps its own copy
 * of that schema and remains the source of truth for what is accepted; this
 * one only drives inline/step-level UX (friendly per-field messages, no
 * honeypot field — that's handled purely server-side).
 */
const assessmentSchema = z
  .object({
    concern: z.string().min(1, "Select the option that best describes the main concern."),
    urgency: z.string().min(1, "Select how urgent the situation is."),
    patientAge: z.string().min(1, "Select an age range to continue."),
    country: z.string().min(1, "Select a country."),
    fullName: z.string().trim().min(1, "Enter a contact name.").max(120, "Full name is too long."),
    phone: z
      .string()
      .trim()
      .max(40, "Phone number is too long.")
      .refine(
        (value) => {
          if (!value) return true;
          const digits = value.replace(/\D/g, "");
          return digits.length >= 7 && digits.length <= 15;
        },
        { message: "Enter a valid phone number (any country format is accepted)." },
      ),
    email: z
      .string()
      .trim()
      .max(254, "Email is too long.")
      .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
        message: "Enter a valid email address.",
      }),
    callbackTime: z.string().trim().max(80, "Keep this under 80 characters."),
    consent: z.boolean().refine((value) => value === true, {
      message: "You must agree to be contacted to submit this request.",
    }),
  })
  .refine((data) => Boolean(data.phone.trim()) || Boolean(data.email.trim()), {
    message: "Provide a phone number or an email address.",
    path: ["phone"],
  });

/**
 * Minimal hand-rolled Resolver adapter for React Hook Form.
 *
 * package.json only has bare `react-hook-form` + `zod` — `@hookform/resolvers`
 * is not installed, and this component may not add new dependencies. RHF's
 * resolver contract (node_modules/react-hook-form/dist/types/resolvers.d.ts)
 * is simple enough to satisfy directly: safeParse and map Zod issues onto a
 * FieldErrors object keyed by the first path segment. On success we return
 * the live `values` (not `result.data`) so the untouched honeypot `fax_number`
 * field — intentionally outside `assessmentSchema` — survives into onSubmit.
 */
const resolver: Resolver<AssessmentFormValues> = (values) => {
  const result = assessmentSchema.safeParse(values);
  if (result.success) {
    return { values, errors: {} };
  }
  const errors: Record<string, { type: string; message: string }> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key === undefined) continue;
    const stringKey = String(key);
    if (errors[stringKey]) continue;
    errors[stringKey] = { type: issue.code, message: issue.message };
  }
  return { values: {} as Record<string, never>, errors: errors as FieldErrors<AssessmentFormValues> };
};

const STEP_FIELDS: Record<number, (keyof AssessmentFormValues)[]> = {
  1: ["concern"],
  2: ["urgency"],
  3: ["patientAge"],
  4: ["fullName", "phone", "email", "country", "consent"],
};

interface ChipRadioGroupProps {
  legendId: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  columnsClassName?: string;
}

/**
 * Single-select answer group built on the shared `ChoiceChip` primitive.
 * `ChoiceChip` itself renders a togglebutton (`aria-pressed`); here every
 * chip is re-tagged as `role="radio"` inside a `role="radiogroup"` container
 * (correct semantics for "pick exactly one"), with a roving tabindex and
 * arrow-key/Home/End navigation per the WAI-ARIA radiogroup pattern. Space
 * and Enter selection, and the visible focus ring, come for free from the
 * underlying native <button>.
 */
function ChipRadioGroup({
  legendId,
  options,
  value,
  onChange,
  onBlur,
  error,
  columnsClassName = "grid-cols-1 tablet:grid-cols-2",
}: ChipRadioGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const errorId = error ? `${legendId}-error` : undefined;

  function focusIndex(index: number) {
    const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons?.[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = Math.max(0, options.indexOf(value));
    let nextIndex = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % options.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = options.length - 1;
    }
    if (nextIndex >= 0) {
      event.preventDefault();
      onChange(options[nextIndex]);
      focusIndex(nextIndex);
    }
  }

  return (
    <div>
      <div
        ref={containerRef}
        role="radiogroup"
        aria-labelledby={legendId}
        aria-required="true"
        aria-describedby={errorId}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        className={`grid gap-12 ${columnsClassName}`}
      >
        {options.map((option, index) => {
          const selected = value === option;
          const tabbable = value ? selected : index === 0;
          return (
            <ChoiceChip
              key={option}
              role="radio"
              aria-checked={selected}
              aria-pressed={undefined}
              tabIndex={tabbable ? 0 : -1}
              selected={selected}
              onClick={() => onChange(option)}
            >
              {option}
            </ChoiceChip>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-16 font-sans text-body-s text-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** Confirmation state shown after a successful submission. */
function SuccessPanel() {
  return (
    <div role="status" className="flex flex-col gap-24 rounded-control bg-success/10 p-24 tablet:p-32">
      <div className="flex items-start gap-12">
        <CheckCircle2 aria-hidden className="mt-2 size-24 shrink-0 text-success" />
        <div>
          <h3 className="font-serif text-h4 text-navy-950">{content.confirmation.title}</h3>
          <p className="mt-8 font-sans text-body text-navy-900">{content.confirmation.body}</p>
        </div>
      </div>
      <div className="flex flex-col gap-16 tablet:flex-row tablet:items-center">
        {IS_SCHEDULER_CONFIGURED && (
          <ButtonLink
            href={SCHEDULER_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            onClick={() => trackSchedulerOpen()}
          >
            {content.schedulerCta}
          </ButtonLink>
        )}
        <p className="font-sans text-body-s text-navy-800">
          Prefer a callback instead of scheduling online? We already have your details — a coordinator will reach
          out directly.
        </p>
      </div>
    </div>
  );
}

/**
 * Section 5, "Interactive Assessment" (02-page-structure.md): a four-step
 * qualification form inside an elevated two-column panel. Mount as
 * `<Assessment />` — no props — anywhere in app/page.tsx; it owns its own
 * `id={SECTION_IDS.assessment}` anchor target for header/nav/mobile-sticky-bar
 * links.
 */
export function Assessment() {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<"form" | "submitting" | "success">("form");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hasStartedRef = useRef(false);
  const submittingRef = useRef(false);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    formState: { errors, submitCount },
  } = useForm<AssessmentFormValues>({
    resolver,
    defaultValues: DEFAULT_VALUES,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const patientAge = watch("patientAge");

  function markStarted() {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    trackAssessmentStart();
  }

  async function goNext() {
    const fields = STEP_FIELDS[currentStep];
    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) return;

    if (currentStep === 1) {
      trackAssessmentStepComplete(1, { main_concern: getValues("concern") });
    } else if (currentStep === 2) {
      trackAssessmentStepComplete(2, { urgency: getValues("urgency") });
    } else {
      trackAssessmentStepComplete(currentStep);
    }

    setCurrentStep((step) => Math.min(TOTAL_STEPS, step + 1));
  }

  function goBack() {
    setCurrentStep((step) => Math.max(1, step - 1));
  }

  const onSubmit = handleSubmit(async (data) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitError(null);
    setStatus("submitting");

    const analyticsProps = { main_concern: data.concern, urgency: data.urgency };
    trackAssessmentStepComplete(4);
    trackAssessmentComplete(analyticsProps);

    try {
      // Cross-origin POST to the Cloudflare Worker (see worker/); credentials
      // are intentionally omitted so no cookies are sent off-origin.
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "assessment",
          fullName: data.fullName,
          phone: data.phone || undefined,
          email: data.email || undefined,
          country: data.country,
          patientAge: data.patientAge,
          concern: data.concern,
          urgency: data.urgency,
          callbackTime: data.callbackTime || undefined,
          consent: data.consent,
          fax_number: data.fax_number,
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

      trackLeadSubmit(analyticsProps);
      setStatus("success");
    } catch (error) {
      trackLeadSubmitError(analyticsProps);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not submit your request. Please try again, or call Admissions directly.",
      );
      setStatus("form");
    } finally {
      submittingRef.current = false;
    }
  });

  const showValidationSummary = submitCount > 0 && Object.keys(errors).length > 0;

  return (
    <section id={SECTION_IDS.assessment} className="bg-off-white py-(--space-104) tablet:py-(--space-128)">
      <div className="container-max">
        <Card
          variant="panel"
          className="grid grid-cols-1 gap-32 shadow-card-low desktop-small:grid-cols-12 desktop-small:gap-48"
        >
          <div className="desktop-small:col-span-4">
            <h2 className="font-serif text-h3 text-navy-950">{content.heading}</h2>
            <p className="mt-16 font-sans text-body text-slate-700">{content.body}</p>
            <p className="mt-24 flex items-start gap-8 font-sans text-body-s text-navy-800">
              <Lock aria-hidden className="mt-2 size-16 shrink-0 text-gold-600" />
              <span>{content.confidentialityNote}</span>
            </p>
          </div>

          <div className="desktop-small:col-span-8">
            {status === "success" ? (
              <SuccessPanel />
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <Progress step={currentStep} total={TOTAL_STEPS} className="mb-32" />

                {/* Hidden honeypot field: real visitors never see or fill this in. */}
                <div aria-hidden="true" className="pointer-events-none absolute left-[-9999px] h-px w-px overflow-hidden">
                  <label htmlFor="assessment-fax_number">Leave this field blank</label>
                  <input id="assessment-fax_number" type="text" tabIndex={-1} autoComplete="off" {...register("fax_number")} />
                </div>

                {submitError && (
                  <div role="alert" className="mb-24 flex items-start gap-8 rounded-control bg-error/10 p-16">
                    <AlertCircle aria-hidden className="mt-2 size-16 shrink-0 text-error" />
                    <span className="font-sans text-body-s text-error">{submitError}</span>
                  </div>
                )}

                {showValidationSummary && (
                  <div role="alert" className="mb-24 rounded-control bg-error/10 p-16">
                    <p className="font-sans text-body-s font-weight-semibold text-error">
                      Please fix the following before continuing:
                    </p>
                    <ul className="mt-8 list-disc pl-20 font-sans text-body-s text-error">
                      {Object.values(errors).map((fieldError, index) => (
                        <li key={index}>{fieldError?.message as string}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentStep === 1 && (
                  <div>
                    <h3 id="assessment-step1-question" className="font-serif text-h4 text-navy-950">
                      {content.step1.question}
                    </h3>
                    <div className="mt-24">
                      <Controller
                        control={control}
                        name="concern"
                        render={({ field }) => (
                          <ChipRadioGroup
                            legendId="assessment-step1-question"
                            options={content.step1.options}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              markStarted();
                            }}
                            onBlur={field.onBlur}
                            error={errors.concern?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <h3 id="assessment-step2-question" className="font-serif text-h4 text-navy-950">
                      {content.step2.question}
                    </h3>
                    <div className="mt-24">
                      <Controller
                        control={control}
                        name="urgency"
                        render={({ field }) => (
                          <ChipRadioGroup
                            legendId="assessment-step2-question"
                            options={content.step2.options}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              markStarted();
                            }}
                            onBlur={field.onBlur}
                            error={errors.urgency?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <h3 id="assessment-step3-question" className="font-serif text-h4 text-navy-950">
                      {content.step3.question}
                    </h3>
                    <div className="mt-24">
                      <Controller
                        control={control}
                        name="patientAge"
                        render={({ field }) => (
                          <ChipRadioGroup
                            legendId="assessment-step3-question"
                            options={content.step3.options}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              markStarted();
                            }}
                            onBlur={field.onBlur}
                            error={errors.patientAge?.message}
                            columnsClassName="grid-cols-2 tablet:grid-cols-3"
                          />
                        )}
                      />
                    </div>
                    {patientAge === "Under 18" && (
                      <div className="mt-16 flex items-start gap-8 rounded-control bg-warning/10 p-12">
                        <AlertCircle aria-hidden className="mt-2 size-16 shrink-0 text-warning" />
                        <span className="font-sans text-body-s text-navy-900">{content.step3.underageNote}</span>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 4 && (
                  <div>
                    <h3 className="font-serif text-h4 text-navy-950">{content.step4.question}</h3>
                    <div className="mt-24 grid grid-cols-1 gap-20 tablet:grid-cols-2">
                      <Select
                        label="Country"
                        id="assessment-country"
                        options={COUNTRY_OPTIONS}
                        placeholder="Select country"
                        required
                        error={errors.country?.message}
                        wrapperClassName="tablet:col-span-2"
                        {...register("country")}
                      />
                      <Input
                        label="Full name"
                        id="assessment-fullName"
                        type="text"
                        autoComplete="name"
                        required
                        error={errors.fullName?.message}
                        wrapperClassName="tablet:col-span-2"
                        {...register("fullName")}
                      />
                      <Input
                        label="Phone"
                        id="assessment-phone"
                        type="tel"
                        autoComplete="tel"
                        hint="Provide a phone number or an email address."
                        error={errors.phone?.message}
                        {...register("phone")}
                      />
                      <Input
                        label="Email"
                        id="assessment-email"
                        type="email"
                        autoComplete="email"
                        hint="Provide a phone number or an email address."
                        error={errors.email?.message}
                        {...register("email")}
                      />
                      <Input
                        label="Best time to call (optional)"
                        id="assessment-callbackTime"
                        type="text"
                        wrapperClassName="tablet:col-span-2"
                        error={errors.callbackTime?.message}
                        {...register("callbackTime")}
                      />
                    </div>

                    <div className="mt-24">
                      <label htmlFor="assessment-consent" className="tap-target flex cursor-pointer items-start gap-12">
                        <input
                          id="assessment-consent"
                          type="checkbox"
                          className="focus-ring mt-2 size-20 shrink-0 rounded-sm border-token-interactive [accent-color:var(--color-gold-600)]"
                          aria-invalid={Boolean(errors.consent) || undefined}
                          aria-describedby={errors.consent ? "assessment-consent-error" : undefined}
                          {...register("consent")}
                        />
                        <span className="font-sans text-body-s text-navy-900">{content.step4.consent}</span>
                      </label>
                      {errors.consent && (
                        <p id="assessment-consent-error" role="alert" className="mt-8 font-sans text-body-s text-error">
                          {errors.consent.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-32 flex items-center justify-between gap-16">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={goBack}
                      icon={<ArrowLeft aria-hidden className="size-16" />}
                      iconPosition="start"
                    >
                      Back
                    </Button>
                  ) : (
                    <span aria-hidden="true" />
                  )}

                  {currentStep < TOTAL_STEPS ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={goNext}
                      icon={<ArrowRight aria-hidden className="size-16" />}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button type="submit" variant="primary" loading={status === "submitting"}>
                      {status === "submitting" ? "Submitting securely…" : content.step4.submit}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
