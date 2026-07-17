"use client";

import mixpanel from "mixpanel-browser";
import { useState, type FormEvent } from "react";
import Button from "@/components/Button/Button";
import Input, { fieldErrorClass } from "@/components/Input/Input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitState = "idle" | "submitting" | "succeeded" | "failed";

export default function InviteForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [formError, setFormError] = useState("");

  const validEmail = EMAIL_RE.test(email.trim());

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const inviteeEmail = String(formData.get("email") ?? "").trim();
    const website = String(formData.get("website") ?? "");

    if (!inviteeEmail || !EMAIL_RE.test(inviteeEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setFormError("");
    setSubmitState("submitting");
    mixpanel.track("Events Invite Submit");

    try {
      const response = await fetch("/api/klaviyo/invite", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: inviteeEmail, website }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(result?.error || "Unable to send invitation.");
      }

      setEmail("");
      setSubmitState("succeeded");
      mixpanel.track("Events Invite Success");
    } catch (error) {
      setSubmitState("failed");
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to send the invitation. Please try again."
      );
      mixpanel.track("Events Invite Error");
    }
  }

  return (
    <section
      aria-labelledby="invite-heading"
      className="mt-14 rounded-[20px] md:rounded-[40px] bg-(--keswick-green-dark) px-6 py-10 text-white md:px-10 md:py-12"
    >
      <div>
        <h3 id="invite-heading">Invite a fellow Land Rover fan</h3>
        <p className="mt-4 text-white!">
          Know someone who should join us? Enter their email and we&apos;ll send
          them a one-time invitation to register.
        </p>

        <form
          noValidate
          onSubmit={onSubmit}
          className="mt-4 flex flex-col gap-4"
        >
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="invite-website">Website</label>
            <input
              id="invite-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div
            className={`flex flex-col items-start gap-3 sm:flex-row sm:items-center ${
              submitState === "succeeded" ? "hidden" : ""
            }`}
          >
            <Input
              className="w-full flex-1"
              id="invite-email"
              name="email"
              type="email"
              autoComplete="off"
              placeholder="friend@example.com"
              required
              htmlRequired
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) setEmailError("");
                if (submitState === "succeeded") setSubmitState("idle");
              }}
              error={emailError}
            />
            <Button
              type="submit"
              className="bg-white text-black! w-full sm:mb-0 sm:w-auto"
              disabled={!validEmail || submitState === "submitting"}
            >
              {submitState === "submitting" ? "Sending…" : "Send invitation"}
            </Button>
          </div>

          {submitState === "succeeded" ? (
            <p className="text-white!" role="status">
              Invitation sent. Thanks for helping grow the community!
            </p>
          ) : null}

          {formError ? (
            <div className={fieldErrorClass} role="alert">
              {formError}
            </div>
          ) : null}

          <p className="text-white! text-xs! italic">
            We&apos;ll only use this address for this invitation. It won&apos;t
            be added to our marketing list unless they register.
          </p>
        </form>
      </div>
    </section>
  );
}
