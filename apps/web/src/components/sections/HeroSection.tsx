'use client';

import { useRef } from 'react';
import { PROFILE } from '@/data/profile';
import { useInViewport } from '@/hooks/useInViewport';
import { useTypewriter } from '@/hooks/useTypewriter';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInViewport(sectionRef, '100px 0px');

  const { displayedText, hasCompletedFirst } = useTypewriter({
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
      className="relative min-h-[100svh] w-full bg-[#0A0A0A] text-white flex flex-col items-center justify-center px-5 md:px-12 pt-20 md:pt-24 pb-36 md:pb-44 overflow-hidden"
    >
      {/* Center: Full-Black Minimalist Live-Typing Hero Stage (positioned at optical eye level) */}
      <div className="relative z-10 mx-auto w-full max-w-[1100px] flex flex-col items-center text-center">
        <h1 className="w-full text-[clamp(38px,6.8vw,88px)] font-bold leading-[1.04] tracking-[-0.035em] text-white">
          <span
            className={`block text-white transition-all duration-[900ms] will-change-transform ${
              hasCompletedFirst
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-[0.94] translate-y-3 pointer-events-none'
            }`}
            style={{ transitionTimingFunction: 'var(--ease)' }}
          >
            {PROFILE.hero.staticPrefix}
          </span>
          <span
            className="block min-h-[2.2em] sm:min-h-[1.15em] text-white/90 mt-1"
            aria-live="polite"
          >
            {displayedText}
            <span className="typing-caret" aria-hidden="true" />
          </span>
        </h1>

        <div
          className={`mt-10 flex flex-wrap items-center justify-center gap-3.5 transition-all duration-[1000ms] delay-150 will-change-transform ${
            hasCompletedFirst
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-[0.94] translate-y-4 pointer-events-none'
          }`}
          style={{ transitionTimingFunction: 'var(--ease)' }}
        >
          <a
            href={PROFILE.hero.primaryCta.href}
            className="inline-flex items-center gap-3 h-12 px-7 rounded-full bg-white text-[#0A0A0A] text-[14px] font-semibold tracking-[-0.01em] hover:bg-[var(--cobalt)] hover:text-white transition-colors duration-300"
          >
            <span>{PROFILE.hero.primaryCta.label}</span>
            <span aria-hidden="true">↓</span>
          </a>
          <a
            href={PROFILE.hero.secondaryCta.href}
            className="inline-flex items-center gap-2 h-12 px-7 rounded-full border-[1.5px] border-white/40 text-white text-[14px] font-semibold tracking-[-0.01em] hover:border-white hover:bg-white/10 transition-colors duration-300"
          >
            <span>{PROFILE.hero.secondaryCta.label}</span>
          </a>
        </div>
      </div>

      {/* Smooth Bottom Gradient Transition (Black #0A0A0A -> White #FFFFFF) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-56"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10, 10, 10, 0) 0%, rgba(45, 45, 45, 0.35) 38%, rgba(200, 200, 200, 0.72) 72%, #FFFFFF 100%)',
        }}
      />
    </section>
  );
}
