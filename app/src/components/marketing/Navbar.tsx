"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="marketing-header-shell">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-[72px] xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <BrandLogo tone="dark" size="md" className="justify-self-center xl:justify-self-start" />

            <nav className="hidden items-center justify-self-center xl:flex" aria-label="Primary navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="marketing-nav-link marketing-nav-link-light"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center justify-self-end xl:flex">
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-3 text-sm font-medium text-black transition-colors hover:text-[#EE6C4D]"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Start Free Trial
                </Link>
              </div>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="justify-self-end rounded-md p-2.5 text-black transition-colors hover:text-[#EE6C4D] xl:hidden"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-nav" className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:px-8 xl:hidden">
          <div className="overflow-hidden border border-black/10 bg-white">
            <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block border-l-2 border-transparent px-4 py-3 text-sm font-medium text-black transition-colors hover:border-[#EE6C4D]"
              >
                {link.label}
              </Link>
            ))}
              <div className="flex flex-col gap-2 border-t border-black/10 pt-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-center text-sm font-medium text-black transition-colors hover:text-[#EE6C4D]"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="btn-primary text-center"
              >
                Start Free Trial
              </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
