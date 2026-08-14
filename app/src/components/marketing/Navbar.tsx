"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="marketing-header-shell">
          <div className="grid h-[72px] grid-cols-[1fr_auto_1fr] items-center xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <BrandLogo tone="dark" size="md" className="justify-self-center xl:justify-self-start" />

            <nav className="hidden items-center justify-self-center gap-4 xl:flex" aria-label="Primary navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`marketing-nav-link ${pathname === link.href ? "marketing-nav-link-active" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center justify-self-end xl:flex">
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-6 py-3 text-base font-medium text-black transition-opacity hover:opacity-80"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-base">
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
        <div id="mobile-nav" className="mx-auto max-w-7xl px-6 xl:hidden">
          <div className="overflow-hidden border border-black/10 bg-white">
            <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block border-l-2 px-4 py-3 text-base font-medium text-black transition-opacity hover:opacity-80 ${
                  pathname === link.href ? "border-[#EE6C4D]" : "border-transparent"
                }`}
              >
                {link.label}
              </Link>
            ))}
              <div className="flex flex-col gap-2 border-t border-black/10 pt-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-center text-base font-medium text-black transition-opacity hover:opacity-80"
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
