'use client';

import { useEffect, useState } from 'react';
import { PROFILE } from '@/data/profile';

export function GlobalNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = PROFILE.navLinks.map((l) => l.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-[#ECE8E0]/92 border-b border-[rgba(20,20,20,0.1)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="h-[60px] md:h-[68px] px-4 md:px-9 flex items-center justify-between max-w-[1680px] mx-auto">
          {/* Left: Minimalist Brand (D! identity) */}
          <a
            href="#hero"
            className="flex items-center gap-3 text-[var(--cobalt)] group focus:outline-none"
            onClick={() => setMenuOpen(false)}
          >
            <span className="inline-flex items-center justify-center h-[22px] px-[7px] border border-[var(--cobalt)] text-[10.5px] font-semibold tracking-[0.12em] leading-none transition-colors duration-300 group-hover:bg-[var(--cobalt)] group-hover:text-[var(--paper)]">
              {PROFILE.brandMark}
            </span>
            <span className="hidden sm:inline-block w-7 h-px bg-[var(--cobalt)]/55" />
            <span className="lbl text-[var(--cobalt)]">{PROFILE.shortName}</span>
          </a>

          {/* Center: Clean Minimalist Nav Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8"
          >
            {PROFILE.navLinks.map((link) => {
              const isActive = activeId === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative py-1 lbl transition-colors duration-200 ${
                    isActive
                      ? 'text-[var(--cobalt)]'
                      : 'text-[var(--ink)]/65 hover:text-[var(--cobalt)]'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[var(--cobalt)] origin-left transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Right: Crisp CTA + Mobile 2-line Burger */}
          <div className="flex items-center gap-4">
            <a
              href={PROFILE.navCta.href}
              className="hidden md:inline-flex items-center gap-2 h-9 px-5 rounded-full bg-[var(--ink)] text-[var(--paper)] lbl hover:bg-[var(--cobalt)] transition-colors duration-300"
            >
              <span>{PROFILE.navCta.label}</span>
              <span aria-hidden="true">↗</span>
            </a>

            <button
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[6px] text-[var(--cobalt)]"
            >
              <span
                className={`block w-[24px] h-[1.5px] bg-current transition-transform duration-300 ${
                  menuOpen ? 'translate-y-[3.75px] rotate-45' : ''
                }`}
              />
              <span
                className={`block w-[24px] h-[1.5px] bg-current transition-transform duration-300 ${
                  menuOpen ? '-translate-y-[3.75px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Minimal Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--sheet)] md:hidden transition-transform duration-500 ${
          menuOpen ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
        style={{ transitionTimingFunction: 'var(--ease)' }}
      >
        <div className="pt-24 px-6 pb-10 h-full flex flex-col justify-between">
          <nav className="flex flex-col border-t border-[var(--hairline)]">
            {PROFILE.navLinks.map((link, idx) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-5 border-b border-[var(--hairline)] flex items-baseline justify-between text-[var(--ink)] hover:text-[var(--cobalt)]"
              >
                <span className="text-2xl font-semibold tracking-tight">{link.label}</span>
                <span className="lbl text-[var(--muted)]">0{idx + 1}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-between pt-6">
            <span className="lbl text-[var(--muted)]">{PROFILE.location}</span>
            <a
              href={PROFILE.navCta.href}
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[var(--cobalt)] text-[var(--paper)] lbl"
            >
              {PROFILE.navCta.label} ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
