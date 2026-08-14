import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const footerLinks = [
  { label: "Platform", href: "/features" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com", icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com", icon: Facebook },
  { label: "X", href: "https://x.com", icon: Twitter },
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
          <div className="mt-6 flex items-center gap-4" aria-label="Social media">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-white transition-opacity hover:opacity-60 active:opacity-80"
              >
                <Icon size={20} strokeWidth={1.5} />
              </a>
            ))}
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="text-white transition-opacity hover:opacity-60 active:opacity-80"
            >
              <img src="https://cdn.simpleicons.org/tiktok/FFFFFF" alt="" width="20" height="20" />
            </a>
          </div>
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