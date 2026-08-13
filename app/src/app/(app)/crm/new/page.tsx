"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewCustomerPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Customer Intake</p>
        <h2 className="page-title">Add a customer record</h2>
        <p className="page-copy">Capture essential customer information in a consistent format for CRM, campaign, and commerce operations.</p>
      </section>

      <section className="app-panel p-6 lg:p-8">
        {submitted ? (
          <div className="rounded-2xl bg-brand-light p-6 text-sm text-slate-700">
            Customer intake recorded successfully for demo review.
            <div className="mt-4">
              <Link href="/crm" className="btn-primary inline-flex">Return to CRM</Link>
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
                <label className="label-text">First name</label>
                <input className="input-field" required />
              </div>
              <div>
                <label className="label-text">Last name</label>
                <input className="input-field" required />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label-text">Email</label>
                <input type="email" className="input-field" required />
              </div>
              <div>
                <label className="label-text">Source</label>
                <select className="input-field" defaultValue="web">
                  <option value="web">Web</option>
                  <option value="referral">Referral</option>
                  <option value="social">Social</option>
                  <option value="import">Import</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary">Save customer draft</button>
              <Link href="/crm" className="btn-outline border-brand-accent/25 text-brand-accent hover:bg-brand-accent/5">Cancel</Link>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}