"use client";

import { useState, type FormEvent } from "react";
import { submitContact } from "@/lib/api";

const serviceOptions = [
  "Tile",
  "Plumbing",
  "HVAC",
  "Electrical",
  "Roofing",
  "Remodeling",
  "General Contracting",
  "Other",
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submitContact({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        companyName: (formData.get("company") as string) || undefined,
        service: (formData.get("service") as string) || undefined,
        message: (formData.get("message") as string) || undefined,
        wantAudit: formData.get("audit") === "on",
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Contact form error:", err);
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-surface rounded-2xl p-10 border border-secondary/20 text-center">
        <div className="text-4xl text-secondary mb-4">&#10003;</div>
        <h3 className="text-xl font-bold mb-2">
          Thanks for reaching out!
        </h3>
        <p className="text-muted">
          I&apos;ll review your information and send you a detailed audit within
          48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-muted-light mb-2">
            Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-200 placeholder:text-muted/50"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted-light mb-2">
            Email <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-200 placeholder:text-muted/50"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-muted-light mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-200 placeholder:text-muted/50"
            placeholder="(541) 000-0000"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-muted-light mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-200 placeholder:text-muted/50"
            placeholder="Your company"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-muted-light mb-2">
          Your Service / Trade
        </label>
        <select
          id="service"
          name="service"
          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm transition-all duration-200"
        >
          <option value="">Select your trade...</option>
          {serviceOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-muted-light mb-2">
          Message / Project Details
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-y transition-all duration-200 placeholder:text-muted/50"
          placeholder="Tell me about your business and what you're looking for..."
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="audit"
          name="audit"
          defaultChecked
          className="mt-1 w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary accent-primary"
        />
        <label htmlFor="audit" className="text-sm text-muted">
          I want a free website audit
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-8 py-4 rounded-full text-base font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
      >
        {loading ? "Sending..." : "Get Your Free Audit"}
      </button>
    </form>
  );
}