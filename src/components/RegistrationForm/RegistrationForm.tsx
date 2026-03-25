"use client";

import { useForm } from "@formspree/react";
import type { SubmissionError } from "@formspree/core";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/Button/Button";
import Input, { fieldErrorClass } from "@/components/Input/Input";

type RegistrationFields = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  vehicle: string;
  instagram?: string;
};

const FIELD_NAMES: (keyof RegistrationFields)[] = [
  "firstName",
  "lastName",
  "email",
  "city",
  "vehicle",
  "instagram",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_NAMES = [
  "firstName",
  "lastName",
  "email",
  "city",
  "vehicle",
] as const satisfies readonly (keyof RegistrationFields)[];

type RequiredName = (typeof REQUIRED_NAMES)[number];

const REQUIRED_FIELD_STATE: Record<RequiredName, string> = {
  firstName: "",
  lastName: "",
  email: "",
  city: "",
  vehicle: "",
};

function requiredFieldsComplete(v: Record<RequiredName, string>) {
  return (
    v.firstName.trim() &&
    v.lastName.trim() &&
    v.email.trim() &&
    EMAIL_RE.test(v.email.trim()) &&
    v.city.trim() &&
    v.vehicle.trim()
  );
}

function fieldMessages(
  errors: SubmissionError<RegistrationFields> | null | undefined,
  field: keyof RegistrationFields
) {
  if (!errors) return null;
  const list = errors.getFieldErrors(field);
  if (!list?.length) return null;
  return list.map((e) => e.message).join(", ");
}

function formMessages(
  errors: SubmissionError<RegistrationFields> | null | undefined
) {
  if (!errors) return [];
  return errors.getFormErrors();
}

function hasServerFieldError(
  errors: SubmissionError<RegistrationFields> | null | undefined
) {
  return FIELD_NAMES.some((f) => fieldMessages(errors, f));
}

type RegistrationFormProps = {
  idPrefix?: string;
  className?: string;
};

const RegistrationForm = ({
  idPrefix = "",
  className = "",
}: RegistrationFormProps) => {
  const pid = (name: string) => (idPrefix ? `${idPrefix}${name}` : name);
  const [state, handleSubmit] = useForm<RegistrationFields>("meerpbnj");
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof RegistrationFields, string>>
  >({});
  const [requiredValues, setRequiredValues] = useState<
    Record<RequiredName, string>
  >(() => ({ ...REQUIRED_FIELD_STATE }));
  const formWrapRef = useRef<HTMLDivElement>(null);

  const canSubmit = requiredFieldsComplete(requiredValues) && !state.submitting;

  const hasAnyError =
    Object.keys(clientErrors).length > 0 ||
    formMessages(state.errors).length > 0 ||
    hasServerFieldError(state.errors);

  useEffect(() => {
    if (!hasAnyError) return;
    formWrapRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [hasAnyError, clientErrors, state.errors]);

  if (state.succeeded) {
    return (
      <p className="pr-6">
        Glad to have you with us! You&apos;ll be the first to know about
        upcoming meetups and events in the Houston area.
      </p>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = String(fd.get("firstName") ?? "").trim();
    const lastName = String(fd.get("lastName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const city = String(fd.get("city") ?? "").trim();
    const vehicle = String(fd.get("vehicle") ?? "").trim();

    const next: Partial<Record<keyof RegistrationFields, string>> = {};
    if (!firstName) next.firstName = "Please enter your first name.";
    if (!lastName) next.lastName = "Please enter your last name.";
    if (!email) next.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(email))
      next.email = "Please enter a valid email address.";
    if (!city) next.city = "Please enter the city you live in.";
    if (!vehicle)
      next.vehicle = "Please tell us about your vehicle (make, model, year).";

    setClientErrors(next);
    if (Object.keys(next).length > 0) return;

    setClientErrors({});
    await handleSubmit(e);
  }

  const formLevel = formMessages(state.errors);

  const err = (name: keyof RegistrationFields) =>
    clientErrors[name] || fieldMessages(state.errors, name);

  return (
    <div ref={formWrapRef} className={className}>
      <h3 id={pid("heading")} className="mb-6">
        Membership Registration
      </h3>

      <form
        noValidate
        onSubmit={onSubmit}
        onChange={(e: FormEvent<HTMLFormElement>) => {
          const t = e.target;
          if (
            !(t instanceof HTMLInputElement) &&
            !(t instanceof HTMLTextAreaElement)
          )
            return;
          const { name, value } = t;
          if (
            name &&
            (REQUIRED_NAMES as readonly string[]).includes(name)
          ) {
            setRequiredValues((prev) => ({
              ...prev,
              [name as RequiredName]: value,
            }));
          }
        }}
        className="flex flex-col gap-4"
      >
        {formLevel.length > 0 && (
          <div className={`${fieldErrorClass} mb-4`} role="alert">
            {formLevel.map((errItem) => errItem.message).join(" ")}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Input
            className="min-w-0"
            id={pid("firstName")}
            name="firstName"
            label="First Name"
            autoComplete="given-name"
            required
            htmlRequired
            error={err("firstName")}
          />
          <Input
            className="min-w-0"
            id={pid("lastName")}
            name="lastName"
            label="Last Name"
            autoComplete="family-name"
            required
            htmlRequired
            error={err("lastName")}
          />
        </div>

        <Input
          id={pid("email")}
          name="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          required
          htmlRequired
          error={err("email")}
        />

        <Input
          id={pid("city")}
          name="city"
          label="What city do you live in?"
          autoComplete="address-level2"
          required
          htmlRequired
          error={err("city")}
        />

        <Input
          as="textarea"
          id={pid("vehicle")}
          name="vehicle"
          label="Tell us about your vehicle (make, model, year)"
          rows={4}
          placeholder="e.g. Land Rover Defender 110, 2022"
          required
          htmlRequired
          error={err("vehicle")}
        />

        <Input
          id={pid("instagram")}
          name="instagram"
          label="Instagram handle"
          autoComplete="username"
          placeholder="@yourhandle or yourhandle"
          error={err("instagram")}
        />

        <Button
          type="submit"
          disabled={!canSubmit}
          title={
            state.submitting || canSubmit
              ? undefined
              : "Complete all required fields to submit"
          }
        >
          {state.submitting ? "Sending…" : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
