import { useState, type FormEvent } from "react";
import { copy } from "../app/i18n";
import type { Locale } from "../types";

const signupApi = import.meta.env.VITE_NEICA_SIGNUP_API?.trim();
const consentVersion = "newsletter-early-access-2026-09";

export default function EarlyAccessForm({ locale }: { locale: Locale }) {
  const text = copy[locale].community;
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signupApi || state === "submitting") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("company")) return;
    setState("submitting");
    try {
      const response = await fetch(signupApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") || "").trim(),
          locale,
          consentVersion,
          consent: data.get("consent") === "on",
          company: String(data.get("company") || ""),
        }),
      });
      if (!response.ok) throw new Error("Signup failed");
      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="early-access" aria-labelledby="early-access-heading">
      <span className="page-label">{text.earlyLabel}</span>
      <h2 id="early-access-heading">{text.earlyHeading}</h2>
      <p>{text.earlyBody}</p>
      <form onSubmit={submit}>
        <label className="early-access-email-label" htmlFor="early-access-email">{text.emailLabel}</label>
        <div className="early-access-input-row">
          <input
            id="early-access-email"
            type="email"
            name="email"
            placeholder={text.emailPlaceholder}
            autoComplete="email"
            maxLength={254}
            required
            disabled={!signupApi || state === "submitting"}
          />
          <button type="submit" disabled={!signupApi || state === "submitting"}>
            {state === "submitting" ? text.submitting : text.submit}
          </button>
        </div>
        <input className="sr-only" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <label className="early-access-consent">
          <input type="checkbox" name="consent" required disabled={!signupApi || state === "submitting"} />
          <span>{text.consent}</span>
        </label>
        <p className="early-access-status" aria-live="polite">
          {!signupApi ? text.unavailable : state === "success" ? text.success : state === "error" ? text.error : ""}
        </p>
      </form>
    </section>
  );
}
