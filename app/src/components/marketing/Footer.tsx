import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

const footerLinks = [
  { label: "Platform", href: "/features" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <BrandLogo tone="light" size="sm" />
          <p className="mt-4 max-w-md text-sm leading-6 text-white">
            Institutional intelligence for accountable financial and operational decisions.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-medium text-white transition-colors hover:text-[#EE6C4D]">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Mrkgron. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#EE6C4D]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#EE6C4D]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}