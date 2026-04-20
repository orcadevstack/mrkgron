import Link from "next/link";
import { ArrowRight, BadgeCheck, Scale, Shield } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export const metadata = {
  title: "Terms of Service — LizConMart",
  description: "Review the core service terms that govern LizConMart platform use.",
  openGraph: {
    title: "Terms of Service — LizConMart",
    description: "Clear terms for a serious platform. LizConMart is built for disciplined operators.",
    url: "https://lizconmart.com/terms",
    type: "website",
  },
};

const sections = [
  "Use of LizConMart is subject to authorized workspace access and compliance with account security obligations.",
  "Customers remain responsible for the legality and accuracy of the content, campaigns, products, and data they operate through the platform.",
  "LizConMart may update features, documentation, and service controls to maintain security, reliability, and product performance.",
  "Enterprise customers may operate under additional commercial and data processing terms executed separately.",
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <section className="bg-brand-dark py-24">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <span className="tag-pill bg-white/10 text-white/80">Terms of Service</span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Clear terms for a <span className="gradient-text">serious platform</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/70">
              LizConMart is built for disciplined operators. These terms define the shared expectations for platform use, access, and service integrity.
            </p>
          </div>
        </section>

        <section className="bg-brand-light py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="app-panel p-8">
                <BadgeCheck size={22} className="text-brand-accent" />
                <h2 className="mt-4 text-lg font-bold text-brand-dark">Authorized use</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">Only approved users may access LizConMart workspaces and service controls.</p>
              </div>
              <div className="app-panel p-8">
                <Scale size={22} className="text-brand-accent" />
                <h2 className="mt-4 text-lg font-bold text-brand-dark">Operational responsibility</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">Workspace teams remain accountable for lawful messaging, product data, and campaign execution.</p>
              </div>
              <div className="app-panel p-8">
                <Shield size={22} className="text-brand-accent" />
                <h2 className="mt-4 text-lg font-bold text-brand-dark">Service integrity</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">Security, abuse prevention, and platform reliability controls are mandatory and may evolve over time.</p>
              </div>
            </div>
            <div className="app-panel mt-8 p-8">
              <ul className="space-y-4 text-sm leading-7 text-slate-600">
                {sections.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-brand-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn-primary mt-8 inline-flex">
                Request commercial terms <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}