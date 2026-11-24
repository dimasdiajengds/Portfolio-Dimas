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
      className="relative min-h-[100svh] w-full flex flex-col justify-between px-5 md:px-12 pt-32 md:pt-40 pb-8 md:pb-10 max-w-[1680px] mx-auto"
    >
      {/* Center: Minimalist Live-Typing Hero Stage */}
      <div className="my-auto py-12 md:py-20 max-w-[1180px]">
        <h1 className="text-[clamp(40px,7vw,92px)] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--ink)]">
          <span className="block text-[var(--ink)]">{PROFILE.hero.staticPrefix}</span>
          <span
            className="block min-h-[2.15em] sm:min-h-[1.12em] text-[var(--ink)]/75 mt-1"
            aria-live="polite"
          >
            {displayedText}
            <span className="typing-caret" aria-hidden="true" />
          </span>
        </h1>

        <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-[46ch]">
            <span className="mask-line">
              <p
                className="text-[18px] md:text-[21px] font-medium leading-[1.45] tracking-[-0.015em] text-[var(--muted)] transition-transform duration-700"
                style={{
                  transform: hasTypedOnce ? 'translateY(0%)' : 'translateY(108%)',
                  transitionTimingFunction: 'var(--ease)',
                }}
              >
                {PROFILE.hero.subheadline}
              </p>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            <a
              href={PROFILE.hero.primaryCta.href}
              className="inline-flex items-center gap-3 h-12 px-7 rounded-full bg-[var(--ink)] text-[var(--paper)] text-[14px] font-semibold tracking-[-0.01em] hover:bg-[var(--cobalt)] transition-colors duration-300"
            >
              <span>{PROFILE.hero.primaryCta.label}</span>
              <span aria-hidden="true">↓</span>
            </a>
            <a
              href={PROFILE.hero.secondaryCta.href}
              className="inline-flex items-center gap-2 h-12 px-7 rounded-full border-[1.5px] border-[var(--ink)] text-[var(--ink)] text-[14px] font-semibold tracking-[-0.01em] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors duration-300"
            >
              <span>{PROFILE.hero.secondaryCta.label}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Spatial Anchor Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--hairline)] pt-5">
        <div className="flex items-center gap-3 text-[13px] font-medium text-[var(--muted)]">
          <span className="w-2 h-2 rounded-full bg-[var(--cobalt)]" />
          <span className="text-[var(--ink)] font-semibold">{PROFILE.location}</span>
          <span>/</span>
          <span>{PROFILE.availability}</span>
        </div>

        <a
          href="#projects"
          className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[var(--ink)] hover:text-[var(--cobalt)] transition-colors"
        >
          <span>Scroll to Projects</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
