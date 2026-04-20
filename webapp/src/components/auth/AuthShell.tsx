import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

const highlights = [
  "Enterprise-grade security and role controls",
  "Unified communications, analytics, and commerce",
  "Operational clarity across every customer touchpoint",
];

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="auth-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden auth-card lg:grid-cols-[1.1fr_0.9fr]">
        <aside className="relative hidden overflow-hidden bg-hero-gradient p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="orb -left-14 top-10 h-56 w-56 bg-brand-accent/25" />
          <div className="orb bottom-0 right-0 h-72 w-72 bg-brand-gold/10" />
          <div className="relative z-10">
            <BrandLogo tone="light" size="md" />
            <p className="mt-10 page-eyebrow border-white/20 bg-white/10 text-white/80">
              Platform Access
            </p>
            <h1 className="mt-5 max-w-md text-4xl font-bold leading-tight">
              {title}
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/70">
              {subtitle}
            </p>
          </div>
          <div className="relative z-10 grid gap-4">
            {highlights.map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-gold">
                  {index === 0 ? <ShieldCheck size={16} /> : <Sparkles size={16} />}
                  LizConMart Standard
                </div>
                <p className="text-sm leading-6 text-white/75">{item}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <BrandLogo size="sm" className="mb-8 lg:hidden" />
            <div className="mb-8 lg:hidden">
              <h1 className="text-3xl font-bold tracking-tight text-brand-dark">{title}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">{subtitle}</p>
            </div>
            <div className="app-panel p-6 sm:p-8">
              {children}
            </div>
            <div className="mt-5 text-center text-sm text-slate-500">{footer}</div>
          </div>
        </section>
      </div>
    </div>
  );
}