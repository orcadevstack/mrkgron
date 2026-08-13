"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewCampaignPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Campaign Builder</p>
        <h2 className="page-title">Create a new campaign draft</h2>
        <p className="page-copy">Prepare the campaign details your team needs before activation. This screen is optimized for tomorrow’s client showcase flow.</p>
      </section>

      <section className="app-panel p-6 lg:p-8">
        {submitted ? (
          <div className="rounded-2xl bg-brand-light p-6 text-sm text-slate-700">
            Campaign draft captured successfully. Your operator team can now continue setup from the communications workspace.
            <div className="mt-4">
              <Link href="/communications" className="btn-primary inline-flex">Return to campaigns</Link>
            </div>
          </div>
        ) : (
          <form
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label-text">Campaign name</label>
                <input className="input-field" placeholder="Q2 Retention Push" required />
              </div>
              <div>
                <label className="label-text">Channel</label>
                <select className="input-field" required defaultValue="">
                  <option value="" disabled>Select a channel</option>
                  <option>Email</option>
                  <option>SMS</option>
                  <option>Push</option>
                  <option>WhatsApp</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label-text">Objective</label>
              <textarea className="input-field min-h-32" placeholder="Describe the campaign objective, audience, and conversion goal." required />
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary">Save campaign draft</button>
              <Link href="/communications" className="btn-outline border-brand-accent/25 text-brand-accent hover:bg-brand-accent/5">Cancel</Link>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}