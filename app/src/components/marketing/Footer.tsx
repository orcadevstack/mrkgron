"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const footerLinks = {
  Platform: [
    { label: "Features", href: "/features" },
    { label: "Solutions", href: "/solutions" },
    { label: "Pricing", href: "/pricing" },
    { label: "Integrations", href: "/features#platform" },
    { label: "Roadmap", href: "/resources" },
  ],
  Resources: [
    { label: "Blog", href: "/resources#blog" },
    { label: "Case Studies", href: "/resources#case-studies" },
    { label: "Whitepapers", href: "/resources#whitepapers" },
    { label: "Webinars", href: "/resources#webinars" },
    { label: "Documentation", href: "/resources#docs" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Values", href: "/about#values" },
    { label: "Leadership", href: "/about#leadership" },
    { label: "Offices", href: "/about#offices" },
  ],
};

const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "Twitter/X", href: "https://twitter.com", icon: Twitter },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      {/* Newsletter Banner */}
      <div className="border-y border-white/10 bg-gradient-to-r from-brand-blue/30 to-brand-indigo/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                Stay updated with Mrkgron insights.
              </h3>
              <p className="text-white/60 mt-1 text-sm">
                Platform updates, marketing strategies, and industry trends — straight to your inbox.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full md:w-auto gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <BrandLogo tone="light" size="sm" className="mb-4" />
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              Empowering organizations with clarity, automation, and measurable
              results — marketing, analytics, and commerce in one ecosystem.
            </p>

            <div className="mt-6 space-y-2">
              <a
                href="mailto:support@mrkgron.com"
                className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors"
              >
                <Mail size={14} className="text-brand-accent" />
                support@mrkgron.com
              </a>
              <a
                href="tel:+18005492678"
                className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors"
              >
                <Phone size={14} className="text-brand-accent" />
                +1-800-LIZ-CMRT
              </a>
              <p className="flex items-start gap-2 text-sm text-white/55">
                <MapPin size={14} className="text-brand-accent mt-0.5 shrink-0" />
                US · Europe · Africa · Asia
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-accent/20 hover:text-brand-accent flex items-center justify-center text-white/50 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Mrkgron. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
