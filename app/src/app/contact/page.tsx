"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

const contactOptions = ["Request a demonstration", "Pricing and commercial terms", "Technical support", "Partnerships and institutional enquiries"];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-24">
        <section className="border-b border-black/10 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-[#EE6C4D]">CONTACT MRKGRON</p>
            <div className="mt-6 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h1 className="text-[32px] font-semibold leading-tight text-black">Start an institutional conversation.</h1>
                <p className="mt-6 max-w-lg text-lg leading-8 text-black">Speak with a Mrkgron specialist about your operating requirements, controls, and reporting priorities.</p>
              </div>
              <div className="grid border-l border-t border-black/10 sm:grid-cols-2">
                {contactOptions.map((option, index) => (
                  <div key={option} className="border-b border-r border-black/10 p-6">
                    <p className="text-sm font-medium text-[#EE6C4D]">0{index + 1}</p>
                    <p className="mt-8 text-base font-medium text-black">{option}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.7fr_1.3fr] sm:px-6 lg:px-8">
            <aside>
              <p className="text-sm font-medium text-[#EE6C4D]">DIRECT CONTACT</p>
              <h2 className="mt-4 text-2xl font-semibold text-black">The information your team needs.</h2>
              <dl className="mt-8 space-y-6 border-t border-black/10 pt-6 text-base">
                <div><dt className="text-sm font-medium">Email</dt><dd className="mt-2">support@mrkgron.com</dd></div>
                <div><dt className="text-sm font-medium">Phone</dt><dd className="mt-2">+1-800-MRKGRON</dd></div>
                <div><dt className="text-sm font-medium">Availability</dt><dd className="mt-2">Monday to Friday, 08:00–20:00 ET</dd></div>
              </dl>
            </aside>

            <div className="border border-black/10 p-6">
              {submitted ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-medium text-[#EE6C4D]">MESSAGE RECEIVED</p>
                  <h2 className="mt-4 text-2xl font-semibold">Your enquiry is with our team.</h2>
                  <p className="mt-4 text-base">A Mrkgron specialist will respond within one business day.</p>
                  <button type="button" onClick={() => setSubmitted(false)} className="btn-primary mt-8">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="label-text">Full name<input required name="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="input-field mt-2" /></label>
                    <label className="label-text">Business email<input required type="email" name="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="input-field mt-2" /></label>
                  </div>
                  <label className="label-text">Organization<input name="company" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} className="input-field mt-2" /></label>
                  <label className="label-text">Reason for contact<select required name="subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="input-field mt-2"><option value="">Select an option</option>{contactOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
                  <label className="label-text">Message<textarea required name="message" rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="input-field mt-2 resize-none" /></label>
                  <button type="submit" className="btn-primary w-fit">Submit enquiry <ArrowRight size={16} /></button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}