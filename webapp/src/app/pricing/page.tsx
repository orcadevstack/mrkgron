import Link from "next/link";
import { Fragment } from "react";
import { ArrowRight, CheckCircle2, X, Zap } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Pricing — LizConMart",
  description: "Transparent, flexible pricing plans for every business.",
};

type Plan = {
  name: string;
  price: string;
  period: string;
  sub: string;
  cta: string;
  ctaHref: string;
  featured?: boolean;
  accentClass: string;
  badgeClass: string;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$49",
    period: "/ month",
    sub: "Perfect for small teams getting started with marketing automation.",
    cta: "Start Free Trial",
    ctaHref: "/register",
    accentClass: "border-slate-200",
    badgeClass: "bg-slate-100 text-slate-600",
    features: [
      "Up to 5,000 contacts",
      "3 active email campaigns",
      "Basic analytics dashboard",
      "1 storefront",
      "Email support",
      "Pre-built templates",
      "API access (read-only)",
    ],
  },
  {
    name: "Professional",
    price: "$149",
    period: "/ month",
    sub: "For growing businesses that need full automation and deeper analytics.",
    cta: "Start Free Trial",
    ctaHref: "/register",
    featured: true,
    accentClass: "border-brand-accent",
    badgeClass: "bg-brand-accent/10 text-brand-accent",
    features: [
      "Up to 50,000 contacts",
      "Unlimited campaigns",
      "Advanced analytics & BI",
      "3 storefronts",
      "Automated customer journeys",
      "CRM & segmentation",
      "Priority live chat support",
      "Full API & webhooks",
      "A/B testing",
      "Custom reports",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    sub: "For large organizations with advanced compliance, scale, and support needs.",
    cta: "Contact Sales",
    ctaHref: "/contact#demo",
    accentClass: "border-brand-navy",
    badgeClass: "bg-brand-dark/10 text-brand-dark",
    features: [
      "Unlimited contacts",
      "Unlimited campaigns & storefronts",
      "Custom analytics pipelines",
      "Dedicated account manager",
      "SLA with 99.99% uptime",
      "SSO / SAML / RBAC",
      "On-premise / private cloud",
      "Custom integrations",
      "SOC 2 & GDPR compliance",
      "White-label options",
      "24/7 enterprise support",
    ],
  },
];

const featureMatrix = {
  "Core Features": {
    "Contact management": ["5,000", "50,000", "Unlimited"],
    "Email campaigns": ["3 active", "Unlimited", "Unlimited"],
    "SMS campaigns": [false, true, true],
    "Campaign templates": [true, true, true],
    "A/B testing": [false, true, true],
  },
  "Analytics & BI": {
    "Basic dashboard": [true, true, true],
    "Advanced analytics": [false, true, true],
    "Custom reports": [false, true, true],
    "Predictive analytics": [false, false, true],
    "Data export": [false, true, true],
  },
  "Commerce": {
    "Storefronts": ["1", "3", "Unlimited"],
    "Product catalog": [true, true, true],
    "Payment integration": [true, true, true],
    "Logistics coordination": [false, true, true],
  },
  "Platform": {
    "API access": ["Read-only", "Full", "Full + custom"],
    "Integrations": ["20+", "100+", "200+"],
    "SSO / SAML": [false, false, true],
    "Role-based access": [false, true, true],
    "SLA uptime": ["99.9%", "99.9%", "99.99%"],
  },
  "Support": {
    "Email support": [true, true, true],
    "Live chat": [false, true, true],
    "Dedicated manager": [false, false, true],
    "24/7 support": [false, false, true],
  },
};

function CheckOrX({ value }: { value: string | boolean }) {
  if (value === true)
    return <CheckCircle2 size={18} className="text-brand-accent mx-auto" />;
  if (value === false)
    return <X size={16} className="text-slate-300 mx-auto" />;
  return <span className="text-sm text-slate-600">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-hero-gradient hero-grid py-28 text-center relative overflow-hidden">
          <div className="orb w-80 h-80 bg-brand-accent/20 top-0 left-1/4" />
          <div className="orb w-64 h-64 bg-brand-indigo/15 -bottom-20 -right-10" />
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <span className="tag-pill bg-white/10 text-white/80 mb-6 inline-block tracking-widest">
              Pricing
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.08] tracking-[-0.03em] mt-4">
              Simple, transparent pricing.{" "}
              <span className="text-brand-gold">No surprises.</span>
            </h1>
            <p className="mt-5 text-lg text-white/65 leading-relaxed">
              Start free, upgrade when you need to. Every plan includes a
              14-day free trial — no credit card required.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="text-sm text-white/50">Monthly</span>
              <div className="relative w-12 h-6 rounded-full bg-brand-accent cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow" />
              </div>
              <span className="text-sm text-white font-semibold">
                Annual <span className="text-brand-gold ml-1">Save 20%</span>
              </span>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-20 bg-brand-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-3xl border-2 ${plan.accentClass} p-8 flex flex-col ${
                    plan.featured ? "ring-2 ring-brand-accent/25 shadow-xl relative" : "shadow-sm"
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-accent text-white text-xs font-semibold shadow-lg">
                        <Zap size={11} /> Most Popular
                      </span>
                    </div>
                  )}

                  <span className={`tag-pill mb-4 ${plan.badgeClass}`}>{plan.name}</span>

                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-bold text-brand-dark">{plan.price}</span>
                    {plan.period && (
                      <span className="text-slate-400 text-sm mb-1.5">{plan.period}</span>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">{plan.sub}</p>

                  <ul className="space-y-2.5 flex-1 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={15} className="text-brand-accent mt-0.5 shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.ctaHref}
                    className={
                      plan.featured
                        ? "btn-primary text-center"
                        : "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-brand-dark font-semibold text-sm hover:border-brand-accent hover:text-brand-accent transition-colors text-center"
                    }
                  >
                    {plan.cta} <ArrowRight size={15} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 bg-white overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-heading">
                Full features <span className="gradient-text">comparison</span>
              </h2>
              <p className="section-subheading mx-auto text-center mt-3">
                See exactly what you get on each plan.
              </p>
            </div>

            <div className="min-w-full overflow-x-auto rounded-3xl border border-slate-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-4 px-6 text-slate-400 font-medium w-1/3">Feature</th>
                    {plans.map((p) => (
                      <th key={p.name} className={`py-4 px-6 text-center font-bold ${p.featured ? "text-brand-accent" : "text-brand-dark"}`}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(featureMatrix).map(([category, rows]) => (
                    <Fragment key={category}>
                      <tr className="bg-brand-light/60">
                        <td colSpan={4} className="py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {category}
                        </td>
                      </tr>
                      {Object.entries(rows).map(([feat, values]) => (
                        <tr key={feat} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-6 text-slate-600">{feat}</td>
                          {(values as (string | boolean)[]).map((val, i) => (
                            <td key={i} className="py-3.5 px-6 text-center">
                              <CheckOrX value={val} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Strip */}
        <section className="py-20 bg-brand-light">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="section-heading">
              Questions? <span className="gradient-text">We have answers.</span>
            </h2>
            <p className="section-subheading mx-auto text-center mt-3">
              Still not sure which plan is right for you? Talk to our team —
              we'll help you find the best fit.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact#demo" className="btn-primary text-base px-8 py-3.5">
                Talk to Sales <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-brand-accent text-brand-accent font-semibold text-base hover:bg-brand-accent/5 transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
