import Link from "next/link";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const footerLinks = [
  { label: "Platform", href: "/features" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Wiki", href: "/wiki" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com", icon: Instagram },
  { label: "X", href: "https://x.com", icon: Twitter },
  { label: "YouTube", href: "https://www.youtube.com", icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="min-h-[240px] border-t border-black/10 bg-white text-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-12 md:items-start">
        <div className="md:col-span-3">
          <BrandLogo tone="dark" size="sm" />
          <p className="mt-4 max-w-xs text-sm font-normal leading-6 text-black">
            Institutional intelligence for accountable financial and operational decisions.
          </p>
        </div>
        <nav className="flex flex-wrap justify-start gap-x-4 gap-y-4 text-sm font-normal md:col-span-6 md:justify-center" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-black transition-opacity hover:opacity-80">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-start gap-3 md:col-span-3 md:justify-end" aria-label="Social media">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-black transition-opacity hover:opacity-80"
            >
              <Icon size={20} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm font-normal sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Mrkgron. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-opacity hover:opacity-80">Privacy</Link>
            <Link href="/terms" className="transition-opacity hover:opacity-80">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}