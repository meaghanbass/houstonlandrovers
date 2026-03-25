"use client";

import { useForm } from "@formspree/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/Button/Button";
import Input, { fieldErrorClass } from "@/components/Input/Input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactFields = {
  email: string;
  message: string;
};

function contactFormComplete(email: string, message: string) {
  return (
    email.trim().length > 0 &&
    EMAIL_RE.test(email.trim()) &&
    message.trim().length > 0
  );
}

type ContactFormProps = {
  idPrefix?: string;
  className?: string;
};

export default function ContactForm({
  idPrefix = "",
  className = "",
}: ContactFormProps) {
  const pid = (name: string) => (idPrefix ? `${idPrefix}${name}` : name);
  const [state, handleSubmit] = useForm<ContactFields>("xpqykkgb");
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof ContactFields, string>>
  >({});
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const formWrapRef = useRef<HTMLDivElement>(null);

  const canSubmit = contactFormComplete(email, message) && !state.submitting;

  const errors = state.errors;

  const hasAnyError =
    Object.keys(clientErrors).length > 0 ||
    (errors &&
      (errors.getFormErrors().length > 0 ||
        (errors.getFieldErrors("email")?.length ?? 0) > 0 ||
        (errors.getFieldErrors("message")?.length ?? 0) > 0));

  useEffect(() => {
    if (!hasAnyError) return;
    formWrapRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [hasAnyError, clientErrors, state.errors]);

  if (state.succeeded) {
    return (
      <p className="text-lg font-medium text-neutral-800">
        Thanks — we&apos;ve received your message and will get back to you soon.
      </p>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const em = String(fd.get("email") ?? "").trim();
    const msg = String(fd.get("message") ?? "").trim();

    const next: Partial<Record<keyof ContactFields, string>> = {};
    if (!em) next.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(em))
      next.email = "Please enter a valid email address.";
    if (!msg) next.message = "Please enter a message.";

    setClientErrors(next);
    if (Object.keys(next).length > 0) return;

    setClientErrors({});
    await handleSubmit(e);
  }

  const formLevel =
    errors
      ?.getFormErrors()
      .map((x) => x.message)
      .join(" ") || "";

  const errEmail =
    clientErrors.email || errors?.getFieldErrors("email")?.[0]?.message;
  const errMessage =
    clientErrors.message || errors?.getFieldErrors("message")?.[0]?.message;

  return (
    <div ref={formWrapRef} className={className}>
      <h3 id={pid("heading")} className="mb-6">
        Contact us
      </h3>

      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
        <input type="hidden" name="_subject" value="HLR — Contact form" />

        {formLevel ? (
          <div className={`${fieldErrorClass} mb-2`} role="alert">
            {formLevel}
          </div>
        ) : null}

        <Input
          id={pid("email")}
          name="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errEmail}
        />

        <Input
          as="textarea"
          id={pid("message")}
          name="message"
          label="Message"
          rows={6}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={errMessage}
        />

        <Button
          type="submit"
          disabled={!canSubmit}
          title={
            state.submitting || canSubmit
              ? undefined
              : "Enter a valid email and message to submit"
          }
        >
          {state.submitting ? "Sending…" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
