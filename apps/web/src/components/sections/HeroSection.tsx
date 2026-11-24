'use client';

import { type PointerEvent as ReactPointerEvent, useCallback, useRef, useState } from 'react';
import { PROFILE } from '@/data/profile';
import { useInViewport } from '@/hooks/useInViewport';
import { useTypewriter } from '@/hooks/useTypewriter';
import {
  type HeroFormationId,
  HeroParticleField,
  type HeroPointerState,
  type HeroTargetRect,
} from '@/components/hero/HeroParticleField';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const engineeringRef = useRef<HTMLSpanElement | null>(null);
  const headlineRef = useRef<HTMLSpanElement | null>(null);
  const primaryCtaRef = useRef<HTMLAnchorElement | null>(null);
  const secondaryCtaRef = useRef<HTMLAnchorElement | null>(null);

  const pointerRef = useRef<HeroPointerState>({ x: 0, y: 0, active: false });
  const [activeTarget, setActiveTarget] = useState<HeroFormationId | null>(null);

  const inView = useInViewport(sectionRef, '100px 0px');

  const { displayedText, hasCompletedFirst } = useTypewriter({
    phrases: PROFILE.hero.typingPhrases,
    active: inView,
    typeSpeedMs: 46,
    deleteSpeedMs: 24,
    pauseAfterTypeMs: 2200,
    pauseAfterDeleteMs: 380,
  });

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch') return;
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    pointerRef.current.x = e.clientX - rect.left;
    pointerRef.current.y = e.clientY - rect.top;
    pointerRef.current.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    pointerRef.current.active = false;
    setActiveTarget(null);
  }, []);

  const getTargetRect = useCallback((id: HeroFormationId): HeroTargetRect | null => {
    const section = sectionRef.current;
    if (!section) return null;

    const targetMap: Record<HeroFormationId, HTMLElement | null> = {
      engineering: engineeringRef.current,
      headline: headlineRef.current,
      'primary-cta': primaryCtaRef.current,
      'secondary-cta': secondaryCtaRef.current,
    };

    const el = targetMap[id];
    if (!el) return null;

    const sectionRect = section.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    return {
      x: elRect.left - sectionRect.left,
      y: elRect.top - sectionRect.top,
      width: elRect.width,
      height: elRect.height,
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate min-h-[100svh] w-full text-white flex flex-col items-center justify-center px-5 md:px-12 pt-20 md:pt-24 pb-20 md:pb-28 overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
        backgroundImage:
          'linear-gradient(to bottom, #0A0A0A 0%, #0A0A0A calc(100% - 260px), #101010 calc(100% - 230px), #1E1E1E calc(100% - 195px), #383838 calc(100% - 160px), #626262 calc(100% - 125px), #969696 calc(100% - 92px), #C8C8C8 calc(100% - 62px), #EAEAEA calc(100% - 36px), #F9F9F9 calc(100% - 16px), #FFFFFF calc(100% - 4px), #FFFFFF 100%)',
      }}
    >
      {/* Lightweight 3D Interactive Full-Spectrum Particle Field (spans full hero through bottom gradient) */}
      <HeroParticleField
        active={inView}
        activeTarget={activeTarget}
        getTargetRect={getTargetRect}
        pointerRef={pointerRef}
      />

      {/* Center: Full-Black Minimalist Live-Typing Hero Stage (positioned at optical eye level) */}
      <div className="relative z-10 mx-auto w-full max-w-[1100px] flex flex-col items-center text-center">
        <h1 className="w-full text-white">
          <span
            className={`block text-[clamp(28px,3.8vw,52px)] font-medium leading-[1.08] tracking-[-0.025em] text-white transition-all duration-[900ms] will-change-transform ${hasCompletedFirst
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-[0.94] translate-y-3 pointer-events-none'
              }`}
            style={{ transitionTimingFunction: 'var(--ease)' }}
          >
            <span
              ref={engineeringRef}
              onMouseEnter={() => setActiveTarget('engineering')}
              onMouseLeave={() => setActiveTarget((prev) => (prev === 'engineering' ? null : prev))}
              className="inline-block px-3 -mx-3 cursor-default select-none"
            >
              {PROFILE.hero.staticPrefix}
            </span>
          </span>
          <span
            className="block text-[clamp(38px,6.8vw,88px)] font-bold leading-[1.04] tracking-[-0.035em] min-h-[3.25em] sm:min-h-[2.2em] text-white mt-8 md:mt-12"
            aria-live="polite"
          >
            <span
              ref={headlineRef}
              onMouseEnter={() => setActiveTarget('headline')}
              onMouseLeave={() => setActiveTarget((prev) => (prev === 'headline' ? null : prev))}
              className="inline-block max-w-full min-w-[min(100%,340px)] px-2 cursor-default"
            >
              {displayedText}
              <span className="typing-caret" aria-hidden="true" />
            </span>
          </span>
        </h1>

        <div
          className={`mt-16 md:mt-[88px] w-full flex flex-wrap items-center justify-center gap-3.5 transition-all duration-[1000ms] delay-150 will-change-transform ${hasCompletedFirst
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-[0.94] translate-y-4 pointer-events-none'
            }`}
          style={{ transitionTimingFunction: 'var(--ease)' }}
        >
          <a
            ref={primaryCtaRef}
            href={PROFILE.hero.primaryCta.href}
            onMouseEnter={() => setActiveTarget('primary-cta')}
            onMouseLeave={() => setActiveTarget((prev) => (prev === 'primary-cta' ? null : prev))}
            onFocus={() => setActiveTarget('primary-cta')}
            onBlur={() => setActiveTarget((prev) => (prev === 'primary-cta' ? null : prev))}
            className="inline-flex items-center gap-3 h-12 px-7 rounded-full bg-white text-[#0A0A0A] text-[14px] font-semibold tracking-[-0.01em] hover:bg-[var(--cobalt)] hover:text-white transition-colors duration-300"
          >
            <span>{PROFILE.hero.primaryCta.label}</span>
            <span aria-hidden="true">↓</span>
          </a>
          <a
            ref={secondaryCtaRef}
            href={PROFILE.hero.secondaryCta.href}
            onMouseEnter={() => setActiveTarget('secondary-cta')}
            onMouseLeave={() => setActiveTarget((prev) => (prev === 'secondary-cta' ? null : prev))}
            onFocus={() => setActiveTarget('secondary-cta')}
            onBlur={() => setActiveTarget((prev) => (prev === 'secondary-cta' ? null : prev))}
            className="inline-flex items-center gap-2 h-12 px-7 rounded-full border-[1.5px] border-white/50 bg-[#0A0A0A]/40 text-white text-[14px] font-semibold tracking-[-0.01em] hover:border-white hover:bg-white/15 transition-colors duration-300"
          >
            <span>{PROFILE.hero.secondaryCta.label}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
