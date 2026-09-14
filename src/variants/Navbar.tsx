"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import TopBar from "@/variants/TopBar";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Downloads", href: "/downloads" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
  { label: "FAQs", href: "/faq" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="w-full bg-[var(--color-black-nav)] sticky top-0 z-50 border-b border-[var(--color-border)] shadow-[0_2px_16px_rgba(0,0,0,0.6)]">
      {/* Top contact strip — its own row so it never collides with the nav links */}
      <div className="w-full px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border)]">
        {/* <TopBar className="py-2" /> */}
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 py-3 sm:gap-3">
          <Link href="/" className="flex items-center shrink-0">
            <img src="/png-logo.png" alt="Al Burhan Quran Academy" className="h-11 w-11 rounded-full object-cover" />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-black tracking-wide text-white">Al Burhan</span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Quran Academy
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 justify-center min-w-0">
            <ul className="flex items-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`block px-3 py-4 text-sm font-medium tracking-wide transition-all duration-200 border-b-2 xl:px-4 ${isActive
                          ? "text-[var(--color-accent-light)] border-[var(--color-accent)]"
                          : "text-[var(--color-gray-muted)] border-transparent hover:text-white hover:border-[var(--color-accent-light)]"
                        }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            {/* Mobile / Tablet Hamburger */}
            <button
              className="lg:hidden p-2.5 text-[var(--color-gray-muted)] hover:text-white transition-colors rounded-lg hover:bg-white/5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown */}
        {menuOpen && (
          <ul className="lg:hidden border-t border-[var(--color-border)] pb-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 text-sm font-medium transition-all ${isActive
                        ? "text-[var(--color-accent-light)] border-l-2 border-[var(--color-accent)] pl-3"
                        : "text-[var(--color-gray-muted)] hover:text-white hover:pl-3"
                      }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}