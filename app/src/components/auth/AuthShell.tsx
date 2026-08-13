import Link from "next/link";
import { ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden border border-black/10 bg-white lg:grid-cols-[1.1fr_0.9fr]">
        <aside className="hidden border-r border-black/10 p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <BrandLogo size="lg" />
            <p className="mt-8 text-sm font-medium text-[#EE6C4D]">Platform access</p>
            <h1 className="mt-4 max-w-md text-3xl font-semibold leading-snug text-black">
              {title}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-black">
              {subtitle}
            </p>
          </div>
          <div className="grid gap-4">
            {highlights.map((item, index) => (
              <div key={item} className="border-l-2 border-[#EE6C4D] pl-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-black">
                  <ShieldCheck size={16} />
                  Mrkgron Standard
                </div>
                <p className="text-sm leading-6 text-black">{item}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-14">
          <div className="w-full max-w-md">
            <BrandLogo size="sm" className="mb-6 lg:hidden" />
            <div className="mb-6 lg:hidden">
              <h1 className="text-2xl font-semibold text-black">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-black">{subtitle}</p>
            </div>
            <div className="app-panel p-6 sm:p-8">
              {children}
            </div>
            <div className="mt-4 text-center text-sm text-black">{footer}</div>
          </div>
        </section>
      </div>
    </div>
  );
}