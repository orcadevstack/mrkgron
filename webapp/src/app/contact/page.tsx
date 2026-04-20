"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin, Clock, CheckCircle2, Zap } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

const offices = [
  { region: "United States", city: "New York, NY", address: "350 Fifth Avenue, Suite 4800" },
  { region: "Europe", city: "London, UK", address: "1 Canada Square, Canary Wharf" },
  { region: "Africa", city: "Lagos, Nigeria", address: "Victoria Island Business Hub" },
  { region: "Asia", city: "Singapore", address: "1 Raffles Place, Tower 2" },
];

const reasons = [
  "Request a personalised demo",
  "Ask about pricing or plans",
  "Get technical or API support",
  "Discuss enterprise or partnership opportunities",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production this would POST to the API
    setSubmitted(true);
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        {/* Hero */}
        <section className="bg-hero-gradient hero-grid py-24 relative overflow-hidden">
          <div className="orb w-80 h-80 bg-brand-accent/20 top-0 right-1/4" />
          <div className="orb w-64 h-64 bg-brand-gold/10 bottom-0 left-1/4" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="tag-pill bg-white/10 text-white/80 mb-6 inline-block">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mt-4">
              Let&apos;s talk about{" "}
              <span className="text-brand-gold">your growth</span>
            </h1>
            <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto">
              Whether you want a demo, have a support question, or want to
              explore enterprise options — our team is here to help.
            </p>
          </div>
        </section>

        {/* Contact Grid */}
        <section id="demo" className="py-24 bg-brand-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Left: Form */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 md:p-10">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
                      <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-dark mb-3">Message sent!</h2>
                    <p className="text-slate-500">
                      Thank you for reaching out. Our team will get back to you
                      within one business day.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", company: "", subject: "", message: "" }); }}
                      className="mt-8 btn-primary"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-brand-dark mb-1">Send us a message</h2>
                    <p className="text-slate-500 text-sm mb-8">
                      Fill in the form and a member of our team will respond within 24 hours.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Full Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Jane Smith"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email Address <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="jane@company.com"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          placeholder="Acme Corp"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Subject <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="subject"
                          required
                          value={form.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition bg-white"
                        >
                          <option value="">Select a topic…</option>
                          <option>Request a Demo</option>
                          <option>Pricing & Plans</option>
                          <option>Technical Support</option>
                          <option>Enterprise Sales</option>
                          <option>Partnership</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Message <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          name="message"
                          required
                          rows={5}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Tell us how we can help…"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition resize-none"
                        />
                      </div>

                      <button type="submit" className="btn-primary w-full py-3 text-base">
                        Send Message <ArrowRight size={16} />
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Right: Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-brand-dark mb-3">
                    How can we help?
                  </h2>
                  <ul className="space-y-2.5">
                    {reasons.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={15} className="text-brand-accent mt-0.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact details */}
                <div className="space-y-4">
                  <a
                    href="mailto:support@lizconmart.com"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-brand-accent/30 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-brand-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                      <p className="font-semibold text-brand-dark group-hover:text-brand-accent transition-colors">
                        support@lizconmart.com
                      </p>
                    </div>
                  </a>

                  <a
                    href="tel:+18005492678"
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-brand-accent/30 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-brand-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Phone</p>
                      <p className="font-semibold text-brand-dark group-hover:text-brand-accent transition-colors">
                        +1-800-LIZ-CMRT
                      </p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center shrink-0">
                      <Clock size={18} className="text-brand-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Support Hours</p>
                      <p className="font-semibold text-brand-dark">Mon–Fri, 8 AM – 8 PM ET</p>
                    </div>
                  </div>
                </div>

                {/* Demo CTA */}
                <div className="rounded-2xl bg-brand-dark p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={16} className="text-brand-gold" />
                    <span className="text-sm font-semibold text-brand-gold">Book a Demo</span>
                  </div>
                  <p className="text-sm text-white/70 mb-4 leading-relaxed">
                    See LizConMart in action with a personalised 30-minute
                    demo tailored to your business and industry.
                  </p>
                  <Link href="/register" className="btn-gold text-sm inline-flex">
                    Schedule a Demo <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="tag-pill bg-brand-indigo/10 text-brand-indigo mb-4 inline-block">
                Global Offices
              </span>
              <h2 className="section-heading mt-3">
                Find us <span className="gradient-text">worldwide</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {offices.map((office) => (
                <div key={office.region} className="card-feature text-center">
                  <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin size={18} className="text-brand-accent" />
                  </div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{office.region}</p>
                  <h3 className="font-bold text-brand-dark mb-1">{office.city}</h3>
                  <p className="text-sm text-slate-500">{office.address}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
