import Link from "next/link";
import {
  ArrowRight,
  Globe,
  TrendingUp,
  Zap,
  CheckCircle2,
  Building2,
  Store,
  Rocket,
} from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Solutions — LizConMart",
  description: "LizConMart solutions for enterprises, SMEs, and startups.",
};

const solutions = [
  {
    id: "enterprises",
    icon: Building2,
    iconBg: "bg-brand-blue/10 text-brand-blue",
    label: "For Enterprises",
    headline: "Scalable power for complex organizations",
    sub: "Enterprise teams need a platform that handles scale, compliance, and deep customization without compromise. LizConMart delivers all three.",
    points: [
      "Scalable multi-tenant architecture supporting thousands of users",
      "Advanced compliance: GDPR, SOC 2, ISO 27001, HIPAA-ready",
      "Dedicated customer success and enterprise SLA",
      "Custom analytics pipelines and data warehouse integrations",
      "SSO, SAML, and role-based access control",
      "White-label and custom domain options",
      "On-premise and private cloud deployment",
    ],
    cta: "/contact#demo",
    ctaLabel: "Talk to Sales",
    accent: "border-brand-blue",
    badgeColor: "bg-brand-blue/10 text-brand-blue",
  },
  {
    id: "smes",
    icon: Store,
    iconBg: "bg-brand-accent/10 text-brand-accent",
    label: "For SMEs",
    headline: "Affordable tools that punch above their weight",
    sub: "Growing businesses need powerful tools that are easy to use, quick to deploy, and designed to scale as they do — without enterprise price tags.",
    points: [
      "Intuitive UI designed for non-technical teams",
      "Affordable tiered pricing with no hidden fees",
      "48-hour onboarding and guided setup",
      "Pre-built campaign templates and playbooks",
      "Integrated e-commerce storefront in minutes",
      "AI-powered recommendations on every plan",
      "Live chat support 5 days a week",
    ],
    cta: "/register",
    ctaLabel: "Start Free Trial",
    accent: "border-brand-accent",
    badgeColor: "bg-brand-accent/10 text-brand-accent",
    featured: true,
  },
  {
    id: "startups",
    icon: Rocket,
    iconBg: "bg-brand-gold/10 text-brand-gold",
    label: "For Startups",
    headline: "Launch fast, grow faster",
    sub: "Startups need to move quickly and validate their market. LizConMart gives you the growth engine to acquire, engage, and retain customers from day one.",
    points: [
      "Growth-focused modules with startup pricing",
      "Marketing automation from day one",
      "Built-in A/B testing and conversion optimization",
      "Integrated analytics to track growth metrics",
      "API-first architecture for custom integrations",
      "Startup program with extended trials and credits",
      "Community and founder network access",
    ],
    cta: "/register",
    ctaLabel: "Get Started Free",
    accent: "border-brand-gold",
    badgeColor: "bg-brand-gold/10 text-amber-700",
  },
];

const industries = [
  "Retail & E-Commerce",
  "Financial Services",
  "Healthcare",
  "Education & EdTech",
  "Media & Publishing",
  "Hospitality & Travel",
  "Professional Services",
  "Non-Profit",
];

export default function SolutionsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-hero-gradient hero-grid py-24 relative overflow-hidden">
          <div className="orb w-96 h-96 bg-brand-accent/20 -top-20 -right-20" />
          <div className="orb w-72 h-72 bg-brand-gold/10 bottom-0 left-20" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="tag-pill bg-white/10 text-white/80 mb-6 inline-block">
              Solutions
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mt-4">
              A solution for{" "}
              <span className="text-brand-gold">every business</span>
            </h1>
            <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto">
              Whether you run a startup or a global enterprise, LizConMart has
              a tailored solution to help you communicate smarter, analyze
              deeper, and grow faster.
            </p>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {solutions.map((sol) => {
                const Icon = sol.icon;
                return (
                  <div
                    key={sol.id}
                    id={sol.id}
                    className={`rounded-2xl border-2 ${sol.accent} p-8 flex flex-col ${
                      sol.featured
                        ? "ring-2 ring-brand-accent/25 shadow-xl relative"
                        : "shadow-sm"
                    }`}
                  >
                    {sol.featured && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 tag-pill bg-brand-accent text-white text-xs">
                        Most Popular
                      </span>
                    )}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${sol.iconBg}`}>
                      <Icon size={22} />
                    </div>
                    <span className={`tag-pill mb-3 ${sol.badgeColor}`}>{sol.label}</span>
                    <h2 className="text-xl font-bold text-brand-dark leading-snug mb-3">
                      {sol.headline}
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6">
                      {sol.sub}
                    </p>
                    <ul className="space-y-2.5 flex-1 mb-8">
                      {sol.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 size={15} className="text-brand-accent mt-0.5 shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <Link href={sol.cta} className="btn-primary text-center">
                      {sol.ctaLabel} <ArrowRight size={15} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-20 bg-brand-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="tag-pill bg-brand-indigo/10 text-brand-indigo mb-4">
              Industries
            </span>
            <h2 className="section-heading mt-3">
              Trusted across <span className="gradient-text">every sector</span>
            </h2>
            <p className="section-subheading mx-auto text-center mt-3">
              LizConMart is built to be industry-agnostic — our customers span
              retail, finance, healthcare, education, and beyond.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {industries.map((ind) => (
                <span
                  key={ind}
                  className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 shadow-sm"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-hero-gradient hero-grid relative overflow-hidden text-center">
          <div className="orb w-80 h-80 bg-brand-accent/20 top-0 right-1/3" />
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Not sure which solution is right for you?
            </h2>
            <p className="mt-4 text-white/60 text-lg">
              Our team will match you with the perfect plan for your goals,
              team size, and budget.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact#demo" className="btn-gold text-base px-8 py-3.5">
                Talk to an Expert <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="btn-outline text-base px-8 py-3.5">
                Compare Plans
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
