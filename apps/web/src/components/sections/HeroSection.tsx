'use client';

import { useRef } from 'react';
import { PROFILE } from '@/data/profile';
import { useInViewport } from '@/hooks/useInViewport';
import { useTypewriter } from '@/hooks/useTypewriter';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInViewport(sectionRef, '100px 0px');

  const { displayedText, hasTypedOnce } = useTypewriter({
    phrases: PROFILE.hero.typingPhrases,
    active: inView,
    typeSpeedMs: 46,
    deleteSpeedMs: 24,
    pauseAfterTypeMs: 2200,
    pauseAfterDeleteMs: 380,
  });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] w-full flex flex-col justify-between px-4 md:px-9 pt-28 md:pt-36 pb-8 md:pb-10 max-w-[1680px] mx-auto"
    >
      {/* Top Meta Row */}
      <div className="flex items-center justify-between gap-4 border-b border-[var(--hairline)] pb-5">
        <span className="mask-line">
          <span className="animate-mask-up lbl text-[var(--cobalt)]">
            {PROFILE.eyebrow}
          </span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-2.5 lbl text-[var(--muted)]">
          <span className="w-2 h-2 rounded-full bg-[var(--cobalt)]" />
          <span>EDITION 2023 — 2026</span>
        </span>
      </div>

      {/* Center: Live-Typing Hero Stage (antigravity.google inspired minimalism) */}
      <div className="my-auto py-12 md:py-16 max-w-[1160px]">
        <p className="lbl text-[var(--muted)] mb-5">01 — OVERVIEW</p>

        <h1 className="text-[clamp(36px,6.4vw,86px)] font-semibold leading-[1.03] tracking-[-0.03em] text-[var(--ink)]">
          <span className="block text-[var(--ink)]">{PROFILE.hero.staticPrefix}</span>
          <span
            className="block min-h-[2.15em] sm:min-h-[1.15em] text-[var(--cobalt)] mt-1"
            aria-live="polite"
          >
            {displayedText}
            <span className="typing-caret" aria-hidden="true" />
          </span>
        </h1>

        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <span className="mask-line">
              <p
                className="font-serif-editorial text-[18px] md:text-[20px] leading-[1.55] text-[var(--ink)]/82 max-w-[54ch] transition-transform duration-700"
                style={{
                  transform: hasTypedOnce ? 'translateY(0%)' : 'translateY(108%)',
                  transitionTimingFunction: 'var(--ease)',
                }}
              >
                {PROFILE.hero.subheadline}
              </p>
            </span>
          </div>

          <div className="md:col-span-5 flex flex-wrap items-center md:justify-end gap-3">
            <a
              href={PROFILE.hero.primaryCta.href}
              className="inline-flex items-center gap-3 h-11 px-6 rounded-full bg-[var(--cobalt)] text-[var(--paper)] lbl hover:bg-[var(--ink)] transition-colors duration-300"
            >
              <span>{PROFILE.hero.primaryCta.label}</span>
              <span aria-hidden="true">↓</span>
            </a>
            <a
              href={PROFILE.hero.secondaryCta.href}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-[var(--rule)] text-[var(--ink)] lbl hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors duration-300"
            >
              <span>{PROFILE.hero.secondaryCta.label}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Spatial Anchor Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--hairline)] pt-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="lbl text-[var(--ink)]">{PROFILE.location}</span>
          <span className="w-5 h-px bg-[var(--rule)]/40" />
          <span className="lbl text-[var(--muted)]">{PROFILE.availability}</span>
        </div>

        <a
          href="#projects"
          className="inline-flex items-center gap-3 lbl text-[var(--cobalt)] hover:opacity-75 transition-opacity"
        >
          <span>SCROLL TO VINYL SHELF</span>
          <span className="w-8 h-px bg-[var(--cobalt)]" />
          <span aria-hidden="true">02 ↓</span>
        </a>
      </div>
    </section>
  );
}
