"use client";

import { useForm } from "@formspree/react";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button/Button";
import Input, { fieldErrorClass } from "@/components/Input/Input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function contactFormComplete(email, message) {
  return (
    email.trim().length > 0 &&
    EMAIL_RE.test(email.trim()) &&
    message.trim().length > 0
  );
}

export default function ContactForm({ idPrefix = "", className = "" }) {
  const pid = (name) => (idPrefix ? `${idPrefix}${name}` : name);
  const [state, handleSubmit] = useForm("xpqykkgb");
  const [clientErrors, setClientErrors] = useState({});
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const formWrapRef = useRef(null);

  const canSubmit = contactFormComplete(email, message) && !state.submitting;

  const hasAnyError =
    Object.keys(clientErrors).length > 0 ||
    (state.errors &&
      (state.errors.getFormErrors?.()?.length > 0 ||
        state.errors.getFieldErrors?.("email")?.length ||
        state.errors.getFieldErrors?.("message")?.length));

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

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const em = String(form.email?.value ?? "").trim();
    const msg = String(form.message?.value ?? "").trim();

    const next = {};
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
    state.errors
      ?.getFormErrors?.()
      ?.map((x) => x.message)
      .join(" ") || "";

  const errEmail =
    clientErrors.email || state.errors?.getFieldErrors?.("email")?.[0]?.message;
  const errMessage =
    clientErrors.message ||
    state.errors?.getFieldErrors?.("message")?.[0]?.message;

  return (
    <div ref={formWrapRef} className={className || "scroll-mt-24 p-20"}>
      <h2
        id={pid("heading")}
        className={idPrefix ? "mb-6 text-lg font-bold md:text-2xl" : ""}
      >
        Contact us
      </h2>

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
