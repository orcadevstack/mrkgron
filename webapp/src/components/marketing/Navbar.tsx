"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const [isSolid, setIsSolid] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handler = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const isPastThreshold = currentScrollY > 24;

      if (!isPastThreshold) {
        setIsVisible(true);
        setIsSolid(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      setIsSolid(true);

      if (isScrollingDown) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isLightSurface = isSolid || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${
        menuOpen || isVisible ? "translate-y-0" : "-translate-y-[115%]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className={`marketing-header-shell ${isLightSurface ? "marketing-header-light" : "marketing-header-dark"}`}>
          <div className="flex h-[72px] items-center justify-between gap-4">
          {/* Logo */}
            <BrandLogo tone={isLightSurface ? "dark" : "light"} size="md" className="shrink-0" />

          {/* Desktop Nav */}
            <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`marketing-nav-link ${isLightSurface ? "marketing-nav-link-light" : "marketing-nav-link-dark"}`}
              >
                {link.label}
              </Link>
            ))}
            </nav>

          {/* Desktop CTA */}
            <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isLightSurface ? "text-slate-600 hover:text-brand-dark" : "text-white/82 hover:text-white"
              }`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn-primary text-sm px-5 py-2.5"
            >
              Start Free Trial
            </Link>
            </div>

          {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`rounded-full p-2.5 transition-colors md:hidden ${
                isLightSurface
                  ? "text-slate-700 hover:bg-slate-100 hover:text-brand-dark"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
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
        <div id="mobile-nav" className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:px-8 md:hidden">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
            <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-dark"
              >
                {link.label}
              </Link>
            ))}
              <div className="flex flex-col gap-2 border-t border-slate-200 pt-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-full px-4 py-3 text-center text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-dark"
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
