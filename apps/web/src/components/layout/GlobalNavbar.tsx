'use client';

import { useEffect, useState } from 'react';
import { PROFILE } from '@/data/profile';

type SocialId = (typeof PROFILE.headerSocials)[number]['id'];

function SolidSocialIcon({ id }: { id: SocialId }) {
  switch (id) {
    case 'linkedin':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
        </svg>
      );
  }
}

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
        <div className="h-[76px] md:h-[92px] px-5 md:px-12 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] max-w-[1680px] mx-auto">
          {/* Left: Minimalist Brand (D! identity) */}
          <a
            href="#hero"
            className={`md:justify-self-start flex items-center gap-3.5 group focus:outline-none transition-colors duration-300 ${
              scrolled ? 'text-[var(--ink)]' : 'text-white'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <img
              src={scrolled ? '/assets/logo/Light-r2.png' : '/assets/logo/Dark-r2.png'}
              alt={PROFILE.brandMark}
              className="h-[30px] w-auto object-contain"
            />
            <span className="text-[15px] md:text-[16px] font-bold tracking-[-0.01em]">
              {PROFILE.shortName}
            </span>
          </a>

          {/* Center: Clean Minimalist 3-Point Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex md:justify-self-center items-center gap-12"
          >
            {PROFILE.navLinks.map((link) => {
              const isActive = activeId === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative py-1.5 text-[16px] md:text-[17px] font-bold tracking-[-0.01em] transition-colors duration-200 ${
                    scrolled
                      ? isActive
                        ? 'text-[var(--ink)]'
                        : 'text-[var(--ink)]/60 hover:text-[var(--ink)]'
                      : isActive
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
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

          {/* Right: Solid Social Icons (Light on dark hero / Dark on light sections) + Mobile Burger */}
          <div className="md:justify-self-end flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {PROFILE.headerSocials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                    scrolled
                      ? 'text-[var(--ink)] hover:text-[var(--cobalt)]'
                      : 'text-white hover:text-[var(--cobalt)]'
                  }`}
                >
                  <SolidSocialIcon id={social.id} />
                </a>
              ))}
            </div>

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
            <div className="flex items-center gap-4">
              {PROFILE.headerSocials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center w-10 h-10 text-[var(--ink)] hover:text-[var(--cobalt)] transition-colors"
                >
                  <SolidSocialIcon id={social.id} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
