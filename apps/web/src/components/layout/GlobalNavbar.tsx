'use client';

import { useEffect, useState } from 'react';
import { PROFILE } from '@/data/profile';

export function GlobalNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('projects');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const projectsEl = document.getElementById('projects');
      if (projectsEl) {
        const rect = projectsEl.getBoundingClientRect();
        // Transition navbar to light theme smoothly as user approaches the white section
        setScrolled(rect.top <= 160);
      } else {
        setScrolled(window.scrollY > window.innerHeight * 0.78);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-white/95 border-b border-[var(--hairline)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="h-[76px] md:h-[92px] px-5 md:px-12 flex items-center justify-between max-w-[1680px] mx-auto">
          {/* Left: Minimalist Brand (D! identity) */}
          <a
            href="#hero"
            className={`flex items-center gap-3.5 group focus:outline-none transition-colors duration-300 ${
              scrolled ? 'text-[var(--ink)]' : 'text-white'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <span
              className={`inline-flex items-center justify-center h-[30px] px-2.5 border-[1.5px] text-[13px] font-bold tracking-[0.04em] leading-none transition-colors duration-300 ${
                scrolled
                  ? 'border-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)]'
                  : 'border-white group-hover:bg-white group-hover:text-[#0A0A0A]'
              }`}
            >
              {PROFILE.brandMark}
            </span>
            <span className="text-[14px] md:text-[15px] font-bold tracking-[-0.01em]">
              {PROFILE.shortName}
            </span>
          </a>

          {/* Center: Clean Minimalist 3-Point Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-12"
          >
            {PROFILE.navLinks.map((link) => {
              const isActive = activeId === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative py-1.5 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${
                    scrolled
                      ? isActive
                        ? 'text-[var(--ink)]'
                        : 'text-[var(--ink)]/55 hover:text-[var(--ink)]'
                      : isActive
                        ? 'text-white'
                        : 'text-white/65 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[var(--cobalt)] origin-left transition-transform duration-300 ${
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
              className={`hidden md:inline-flex items-center gap-2.5 h-11 px-6 rounded-full text-[13.5px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                scrolled
                  ? 'bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--cobalt)]'
                  : 'bg-white text-[#0A0A0A] hover:bg-[var(--cobalt)] hover:text-white'
              }`}
            >
              <span>{PROFILE.navCta.label}</span>
              <span aria-hidden="true">↗</span>
            </a>

            <button
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              className={`md:hidden w-11 h-11 flex flex-col items-center justify-center gap-[7px] transition-colors duration-300 ${
                scrolled || menuOpen ? 'text-[var(--ink)]' : 'text-white'
              }`}
            >
              <span
                className={`block w-[26px] h-[2px] bg-current transition-transform duration-300 ${
                  menuOpen ? 'translate-y-[4.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block w-[26px] h-[2px] bg-current transition-transform duration-300 ${
                  menuOpen ? '-translate-y-[4.5px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Minimal Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--paper)] md:hidden transition-transform duration-500 ${
          menuOpen ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
        style={{ transitionTimingFunction: 'var(--ease)' }}
      >
        <div className="pt-28 px-6 pb-10 h-full flex flex-col justify-between">
          <nav className="flex flex-col border-t border-[var(--hairline)]">
            {PROFILE.navLinks.map((link, idx) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-6 border-b border-[var(--hairline)] flex items-baseline justify-between text-[var(--ink)] hover:text-[var(--cobalt)]"
              >
                <span className="text-3xl font-bold tracking-tight">{link.label}</span>
                <span className="text-[13px] font-semibold text-[var(--muted)]">0{idx + 1}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-between pt-6">
            <span className="text-[13px] font-medium text-[var(--muted)]">{PROFILE.location}</span>
            <a
              href={PROFILE.navCta.href}
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[var(--ink)] text-[var(--paper)] text-[14px] font-semibold"
            >
              {PROFILE.navCta.label} ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
