import Link from "next/link";
import { ArrowRight, BarChart3, Check, Database, Radio, ShieldCheck, Workflow } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

const capabilities = [
  { icon: Database, title: "A governed source of truth", description: "Bring revenue, customer, and operational data into a single financial record for every team." },
  { icon: BarChart3, title: "Decisions at the right moment", description: "See the metrics that need attention, their context, and the action that protects performance." },
  { icon: Workflow, title: "Execution with control", description: "Turn approved operating rules into accountable workflows across the organization." },
];

const monthlyRevenue = [42, 50, 48, 57, 62, 60, 69, 73, 80, 76, 86, 92];

function ProductConsole() {
  return (
    <div className="border border-black/10 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
        <div>
          <p className="text-sm font-medium text-black">Executive overview</p>
          <p className="mt-1 text-sm text-black">Consolidated operating position · August 2026</p>
        </div>
        <span className="border border-black px-3 py-2 text-xs font-medium text-black">Reporting currency · USD</span>
      </div>
      <div className="grid gap-4 py-4 md:grid-cols-3">
        {[["Net revenue", "$2,406,182", "+18.2%"], ["Operating margin", "28.4%", "+2.6 pts"], ["Forecast confidence", "94%", "On plan"]].map(([label, value, change]) => (
          <div key={label} className="border border-black/10 p-4">
            <p className="text-sm text-black">{label}</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-black">{value}</p>
              <p className="text-sm font-medium text-[#EE6C4D]">{change}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 border-t border-black/10 pt-4 lg:grid-cols-[1.55fr_0.85fr]">
        <div className="border border-black/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-black">Revenue performance</p>
              <p className="mt-1 text-sm text-black">Actual revenue against operating plan</p>
            </div>
            <p className="text-sm font-medium text-[#EE6C4D]">Above plan</p>
          </div>
          <div className="mt-8 flex h-40 items-end gap-1.5">
            {monthlyRevenue.map((height, index) => (
              <div key={height} className="flex h-full flex-1 items-end bg-black/[0.03]">
                <div className={index > 8 ? "w-full bg-[#EE6C4D]" : "w-full bg-black"} style={{ height: `${height}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-black"><span>Sep</span><span>Oct</span><span>Nov</span><span>Current</span></div>
        </div>
        <div className="border border-black/10 p-4">
          <p className="text-sm font-medium text-black">Priority review</p>
          <p className="mt-3 text-sm leading-6 text-black">Lifecycle email is outperforming paid social on contribution margin. Review the next budget allocation.</p>
          <div className="mt-8 border-t border-black/10 pt-4">
            <p className="text-sm font-medium text-black">12% reallocation proposed</p>
            <p className="mt-1 text-sm text-[#EE6C4D]">Decision required this week</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="border-b border-black/10 bg-white pt-32 sm:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-12 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:pb-16">
          <div>
            <p className="text-sm font-medium text-[#EE6C4D]">MRKGRON / EXECUTIVE INTELLIGENCE</p>
            <h1 className="mt-6 max-w-3xl text-[32px] font-semibold leading-tight text-black">The operating system for informed financial decisions.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black">Mrkgron gives executives one authoritative view of performance, risk, and opportunity across the organization.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact#demo" className="btn-primary">Request a demonstration <ArrowRight size={16} /></Link>
              <Link href="/features" className="btn-outline">Explore the platform</Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 border-l border-t border-black/10">
            {[["01", "One operating record"], ["02", "Decision-ready reporting"], ["03", "Governed automation"], ["04", "Enterprise controls"]].map(([number, label]) => (
              <div key={number} className="border-b border-r border-black/10 p-4 sm:p-6"><dt className="text-sm text-[#EE6C4D]">{number}</dt><dd className="mt-8 text-sm font-medium text-black">{label}</dd></div>
            ))}
          </dl>
        </div>
        <ProductConsole />
      </div>
    </section>
  );
}

function TwilioIntegrationSignal() {
  return (
    <section className="border-b border-black/10 bg-white py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-medium text-[#EE6C4D]">COMMUNICATIONS INTEGRATION</p>
          <h2 className="mt-4 text-2xl font-semibold text-black">Twilio SMS delivery, governed in one operating record.</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-black">
            Route approved customer communications through Twilio while retaining delivery status,
            consent, and operational context in Mrkgron.
          </p>
        </div>
        <div className="border border-black/10 bg-white p-4 sm:p-6" aria-label="Twilio delivery activity">
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <div className="flex items-center gap-3">
              <Radio size={20} strokeWidth={1.5} className="text-[#EE6C4D]" />
              <div>
                <p className="text-base font-medium text-black">Twilio SMS delivery</p>
                <p className="mt-1 text-sm text-black">Live communications signal</p>
              </div>
            </div>
            <span className="border border-[#EE6C4D] px-3 py-2 text-sm font-medium text-black">Connected</span>
          </div>
          <div className="integration-flow mt-4 border border-black/10 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-black">Consent-approved message</p>
              <Check size={20} strokeWidth={1.5} className="shrink-0 text-[#EE6C4D]" />
            </div>
            <div className="mt-4 h-px overflow-hidden bg-black/10">
              <div className="integration-flow-signal h-full bg-[#EE6C4D]" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-black">
              <span>Queued by Mrkgron</span>
              <span>Delivery confirmed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const metadata = {
  title: "Mrkgron | Executive Intelligence Platform",
  description: "The institutional operating system for informed financial decisions.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <section className="border-b border-black/10 bg-black py-6 text-white"><div className="mx-auto grid max-w-7xl gap-4 px-4 text-sm sm:grid-cols-3 sm:px-6 lg:px-8"><p>Institutional reporting</p><p>Enterprise governance</p><p>Operational intelligence</p></div></section>
        <TwilioIntegrationSignal />
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl"><p className="text-sm font-medium text-[#EE6C4D]">THE PLATFORM</p><h2 className="mt-4 text-2xl font-semibold text-black">Built for the discipline of modern operations.</h2><p className="mt-4 text-base leading-7 text-black">A consistent system for seeing the business clearly, governing its data, and acting with confidence.</p></div>
            <div className="mt-12 grid border-l border-t border-black/10 md:grid-cols-3">
              {capabilities.map(({ icon: Icon, title, description }) => <article key={title} className="border-b border-r border-black/10 p-6"><Icon size={20} strokeWidth={1.5} className="text-black" /><h3 className="mt-12 text-xl font-medium text-black">{title}</h3><p className="mt-4 text-base leading-7 text-black">{description}</p></article>)}
            </div>
          </div>
        </section>
        <section className="border-y border-black/10 bg-white py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
            <div><p className="text-sm font-medium text-[#EE6C4D]">CONTROL BY DESIGN</p><h2 className="mt-4 text-2xl font-semibold text-black">Authority without ambiguity.</h2></div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="border-l-2 border-[#EE6C4D] pl-4"><ShieldCheck size={20} strokeWidth={1.5} /><h3 className="mt-4 text-lg font-medium">Governed access</h3><p className="mt-3 text-base leading-7 text-black">Clear roles, accountable actions, and durable audit trails across every operating unit.</p></div>
              <div className="border-l-2 border-black pl-4"><BarChart3 size={20} strokeWidth={1.5} /><h3 className="mt-4 text-lg font-medium">Board-ready clarity</h3><p className="mt-3 text-base leading-7 text-black">Consistent measures and concise reporting built for the decisions leaders have to make.</p></div>
            </div>
          </div>
        </section>
        <section className="bg-black py-12 text-white sm:py-16"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:px-8"><div className="max-w-2xl"><p className="text-sm font-medium text-[#EE6C4D]">MRKGRON</p><h2 className="mt-4 text-2xl font-semibold">Put one operating standard behind every decision.</h2></div><Link href="/contact#demo" className="btn-primary w-fit">Speak with Mrkgron <ArrowRight size={16} /></Link></div></section>
      </main>
      <Footer />
    </>
  );
}