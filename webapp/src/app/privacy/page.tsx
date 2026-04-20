import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock, Globe } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export const metadata = {
  title: "Privacy Policy — LizConMart",
  description: "Learn how LizConMart protects, processes, and governs customer data.",
};

const sections = [
  {
    title: "Information We Collect",
    copy: "LizConMart processes account, billing, operational, and usage data required to deliver communications, analytics, and commerce functionality across your workspace.",
  },
  {
    title: "How We Use Data",
    copy: "We use platform data to authenticate users, support customer operations, improve reporting quality, secure the service, and fulfill contractual service obligations.",
  },
  {
    title: "Security & Retention",
    copy: "Customer data is protected through access controls, encrypted transport, tenant-aware processing, and retention practices aligned to contractual and regulatory requirements.",
  },
  {
    title: "Your Controls",
    copy: "Workspace administrators can request export, correction, or deletion support through LizConMart support and enterprise account channels.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="bg-hero-gradient hero-grid py-24">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <span className="tag-pill bg-white/10 text-white/80">Privacy Policy</span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Privacy built for <span className="text-brand-gold">institutional trust</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/70">
              LizConMart is designed to handle customer and operational data with clarity, restraint, and enterprise-level governance.
            </p>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <aside className="app-panel p-8">
              <div className="space-y-6 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 text-brand-accent" size={18} />
                  <p>Privacy practices are aligned to secure, multi-tenant SaaS operations.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 text-brand-accent" size={18} />
                  <p>Access to workspace data is limited by role, session controls, and account context.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 text-brand-accent" size={18} />
                  <p>Regional operating teams can coordinate with LizConMart for compliance and data residency requirements.</p>
                </div>
              </div>
            </aside>
            <div className="space-y-6">
              {sections.map((section) => (
                <article key={section.title} className="app-panel p-8">
                  <h2 className="text-xl font-bold text-brand-dark">{section.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{section.copy}</p>
                </article>
              ))}
              <div className="app-panel bg-brand-light p-8">
                <h2 className="text-xl font-bold text-brand-dark">Questions about privacy?</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Contact the LizConMart team for enterprise privacy requests, security review coordination, or data governance documentation.
                </p>
                <Link href="/contact" className="btn-primary mt-6 inline-flex">
                  Contact LizConMart <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}