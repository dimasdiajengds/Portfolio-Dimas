'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export interface ExperienceItem {
  readonly period: string;
  readonly role: string;
  readonly org: string;
  readonly summary: string;
}

interface ExperienceTimelineProps {
  experiences: readonly ExperienceItem[];
}

const SVG_W = 1200;
const SVG_H = 128;
const Y_CREST = 28;
const Y_TROUGH = 98;
const Y_EDGE = 74;
const LEAD_X = 28;

interface WavePoint {
  x: number;
  y: number;
  xPercent: number;
  yPercent: number;
  isTrough: boolean;
}

function buildDesktopWave(count: number) {
  const safeCount = Math.max(1, count);
  const points: WavePoint[] = [];

  for (let i = 0; i < safeCount; i += 1) {
    const xRatio = (i + 0.5) / safeCount;
    const x = xRatio * SVG_W;
    const isTrough = i % 2 === 1;
    const y = isTrough ? Y_TROUGH : Y_CREST;
    points.push({
      x,
      y,
      xPercent: xRatio * 100,
      yPercent: (y / SVG_H) * 100,
      isTrough,
    });
  }

  const first = points[0];
  const last = points[points.length - 1];
  const leadMidX = (LEAD_X + first.x) * 0.5;
  let d = `M ${LEAD_X} ${Y_EDGE} C ${leadMidX.toFixed(1)} ${Y_EDGE}, ${leadMidX.toFixed(1)} ${first.y}, ${first.x.toFixed(1)} ${first.y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const midX = (a.x + b.x) * 0.5;
    d += ` C ${midX.toFixed(1)} ${a.y}, ${midX.toFixed(1)} ${b.y}, ${b.x.toFixed(1)} ${b.y}`;
  }

  const endX = SVG_W - LEAD_X;
  const endMidX = (last.x + endX) * 0.5;
  d += ` C ${endMidX.toFixed(1)} ${last.y}, ${endMidX.toFixed(1)} ${Y_EDGE}, ${endX} ${Y_EDGE}`;

  return { d, points };
}

function buildMobileWavePath(count: number) {
  const totalH = Math.max(1, count) * 100;
  let d = `M 24 0`;
  for (let i = 0; i < count; i += 1) {
    const yTop = i * 100;
    const yMid = yTop + 50;
    const yEnd = yTop + 100;
    const bulgeX = i % 2 === 0 ? 36 : 12;
    d += ` C ${bulgeX} ${yTop + 22}, ${bulgeX} ${yMid - 12}, 24 ${yMid}`;
    d += ` C ${i % 2 === 0 ? 12 : 36} ${yMid + 12}, ${i % 2 === 0 ? 12 : 36} ${yEnd - 22}, 24 ${yEnd}`;
  }
  return { d, totalH };
}

/**
 * Scroll-driven wavy left-to-right experience timeline:
 * - As the user scrolls down from About into the dark Timeline stage, the sinusoidal SVG wave
 *   smoothly fills from left to right via compositor-friendly strokeDashoffset interpolation.
 * - Each career node activates and reveals its work details right as the glowing line crosses it.
 * - Nodes remain clickable/hoverable to inspect and highlight any milestone.
 */
export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const desktopFillPathRef = useRef<SVGPathElement | null>(null);
  const desktopHaloPathRef = useRef<SVGPathElement | null>(null);
  const mobileFillPathRef = useRef<SVGPathElement | null>(null);

  const count = experiences.length;
  const { d: desktopPathD, points: desktopPoints } = useMemo(() => buildDesktopWave(count), [count]);
  const { d: mobilePathD, totalH: mobileTotalH } = useMemo(() => buildMobileWavePath(count), [count]);

  const nodeFractionsRef = useRef<number[]>(
    desktopPoints.map((pt) => (pt.x - LEAD_X) / Math.max(1, SVG_W - LEAD_X * 2)),
  );

  const [revealedCount, setRevealedCount] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const revealedCountRef = useRef(0);
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const minOverrideRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => {
      setReducedMotion(mq.matches);
      if (mq.matches) {
        currentProgressRef.current = 1;
        targetProgressRef.current = 1;
        revealedCountRef.current = count;
        setRevealedCount(count);
      }
    };
    syncPreference();
    mq.addEventListener('change', syncPreference);
    return () => mq.removeEventListener('change', syncPreference);
  }, [count]);

  // Measure exact desktop curve arc-length fractions for node illumination triggers
  useEffect(() => {
    const fallbackFractions = desktopPoints.map(
      (pt) => (pt.x - LEAD_X) / Math.max(1, SVG_W - LEAD_X * 2),
    );

    const measurePaths = () => {
      const fillPath = desktopFillPathRef.current;
      if (fillPath && fillPath.getClientRects().length > 0) {
        try {
          const len = fillPath.getTotalLength();
          if (len > 0) {
            nodeFractionsRef.current = desktopPoints.map((pt) => {
              let lo = 0;
              let hi = len;
              for (let step = 0; step < 18; step += 1) {
                const mid = (lo + hi) * 0.5;
                if (fillPath.getPointAtLength(mid).x < pt.x) lo = mid;
                else hi = mid;
              }
              return ((lo + hi) * 0.5) / len;
            });
            return;
          }
        } catch {
          // Ignore SVG length read failure on hidden containers
        }
      }

      nodeFractionsRef.current = fallbackFractions;
    };

    measurePaths();
    window.addEventListener('resize', measurePaths, { passive: true });
    return () => window.removeEventListener('resize', measurePaths);
  }, [desktopPoints]);

  useEffect(() => {
    const syncPathStroke = (el: SVGPathElement | null, p: number) => {
      if (!el) return;
      if (p <= 0.002) {
        el.style.strokeDashoffset = '1.05';
        el.style.opacity = '0';
      } else {
        el.style.opacity = '1';
        el.style.strokeDashoffset = `${Math.max(0, 1 - p).toFixed(4)}`;
      }
    };

    const applyProgress = (p: number) => {
      const nodeFractions = nodeFractionsRef.current;

      syncPathStroke(desktopFillPathRef.current, p);
      syncPathStroke(desktopHaloPathRef.current, p);
      syncPathStroke(mobileFillPathRef.current, p);

      let nextRevealed = 0;
      for (let i = 0; i < nodeFractions.length; i += 1) {
        if (p >= nodeFractions[i] - 0.015) {
          nextRevealed = i + 1;
        }
      }

      if (nextRevealed !== revealedCountRef.current) {
        revealedCountRef.current = nextRevealed;
        setRevealedCount(nextRevealed);
      }
    };

    const tick = () => {
      const target = Math.max(targetProgressRef.current, minOverrideRef.current);
      const diff = target - currentProgressRef.current;

      if (Math.abs(diff) < 0.0012) {
        currentProgressRef.current = target;
        applyProgress(target);
        rafIdRef.current = null;
        return;
      }

      currentProgressRef.current += diff * 0.14;
      applyProgress(currentProgressRef.current);
      rafIdRef.current = window.requestAnimationFrame(tick);
    };

    const kickLoop = () => {
      if (rafIdRef.current === null) {
        rafIdRef.current = window.requestAnimationFrame(tick);
      }
    };

    const updateTargetFromScroll = () => {
      if (reducedMotion) {
        applyProgress(1);
        return;
      }
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;

      // Start sweeping in as the section enters the lower viewport; complete smoothly when comfortably centered
      const startTop = vh * 0.88;
      const endTop = vh * 0.28;
      const raw = (startTop - rect.top) / Math.max(1, startTop - endTop);
      const clamped = Math.max(0, Math.min(1, raw));

      // Clear manual minimum override once user scrolls back near the top above timeline
      if (clamped < 0.04) {
        minOverrideRef.current = 0;
        setSelectedIdx(null);
      }

      targetProgressRef.current = clamped;
      kickLoop();
    };

    updateTargetFromScroll();
    window.addEventListener('scroll', updateTargetFromScroll, { passive: true });
    window.addEventListener('resize', updateTargetFromScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateTargetFromScroll);
      window.removeEventListener('resize', updateTargetFromScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [count, reducedMotion]);

  const handleSelectNode = (idx: number) => {
    setSelectedIdx(idx);
    const targetFrac = nodeFractionsRef.current[idx] ?? 1;
    if (currentProgressRef.current < targetFrac) {
      const nextP = Math.max(minOverrideRef.current, Math.min(1, targetFrac + 0.02));
      minOverrideRef.current = nextP;
      if (rafIdRef.current === null) {
        currentProgressRef.current = nextP;
        const offsetStr = `${Math.max(0, 1 - nextP).toFixed(4)}`;
        for (const el of [
          desktopFillPathRef.current,
          desktopHaloPathRef.current,
          mobileFillPathRef.current,
        ]) {
          if (el) {
            el.style.opacity = '1';
            el.style.strokeDashoffset = offsetStr;
          }
        }
        revealedCountRef.current = Math.max(revealedCountRef.current, idx + 1);
        setRevealedCount(revealedCountRef.current);
      }
    }
  };

  const activeIdx =
    hoveredIdx ??
    selectedIdx ??
    (revealedCount > 0 ? Math.min(count - 1, revealedCount - 1) : 0);

  return (
    <div ref={containerRef} className="w-full pt-0 pb-10 md:pb-16">
      {/* Header Row */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-[clamp(42px,4.5vw,70px)] font-extrabold leading-[0.98] tracking-[-0.035em] text-white uppercase">
          EXPERIENCE
        </h2>
      </div>

      {/* Desktop: Interactive Horizontal Wavy Curve + Progressive Nodes */}
      <div className="hidden lg:block">
        <div className="relative w-full h-[128px] select-none">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="timelineTrackFade" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="7%" stopColor="#FFFFFF" stopOpacity="0.16" />
                <stop offset="93%" stopColor="#FFFFFF" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="timelineFillFade" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
                <stop offset="6%" stopColor="#FFFFFF" stopOpacity="0.96" />
                <stop offset="94%" stopColor="#FFFFFF" stopOpacity="0.96" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.12" />
              </linearGradient>
            </defs>

            {/* Dim background wavy guide path */}
            <path
              d={desktopPathD}
              fill="none"
              stroke="url(#timelineTrackFade)"
              strokeWidth="1.75"
              strokeLinecap="round"
            />

            {/* Soft luminous aura following the filled segment */}
            <path
              ref={desktopHaloPathRef}
              d={desktopPathD}
              pathLength={1}
              fill="none"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="6"
              strokeLinecap="round"
              style={{ strokeDasharray: 1, strokeDashoffset: 1.05, opacity: 0 }}
            />

            {/* Main illuminated scroll-filling wavy line */}
            <path
              ref={desktopFillPathRef}
              d={desktopPathD}
              pathLength={1}
              fill="none"
              stroke="url(#timelineFillFade)"
              strokeWidth="2.2"
              strokeLinecap="round"
              style={{ strokeDasharray: 1, strokeDashoffset: 1.05, opacity: 0 }}
            />
          </svg>

          {/* Interactive Node Points sitting directly along the wave peaks & troughs */}
          {experiences.map((exp, idx) => {
            const pt = desktopPoints[idx];
            const isReached = reducedMotion || idx < revealedCount;
            const isSpotlight = isReached && activeIdx === idx;
            return (
              <button
                key={`${idx}-${exp.period}-${exp.role}`}
                type="button"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onFocus={() => setHoveredIdx(idx)}
                onBlur={() => setHoveredIdx(null)}
                onClick={() => handleSelectNode(idx)}
                aria-label={`${exp.period}: ${exp.role}`}
                aria-pressed={selectedIdx === idx}
                style={{
                  left: `${pt.xPercent}%`,
                  top: `${pt.yPercent}%`,
                }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {/* Halo ring on active / spotlight node */}
                <span
                  className={`absolute rounded-full transition-all duration-500 ${isSpotlight
                      ? 'w-9 h-9 bg-white/15 scale-100 opacity-100'
                      : 'w-6 h-6 bg-white/0 scale-75 opacity-0 group-hover:opacity-100 group-hover:bg-white/10 group-hover:scale-100'
                    }`}
                />
                {/* Node Ring */}
                <span
                  className={`relative flex items-center justify-center rounded-full border transition-all duration-500 ${isSpotlight
                      ? 'w-6 h-6 bg-white border-white shadow-[0_0_24px_rgba(255,255,255,0.45)] scale-105'
                      : isReached
                        ? 'w-5 h-5 bg-[#0A0A0A] border-white/85 group-hover:border-white group-hover:scale-110'
                        : 'w-4 h-4 bg-[#0A0A0A] border-white/25 group-hover:border-white/55'
                    }`}
                >
                  <span
                    className={`rounded-full transition-colors duration-300 ${isSpotlight
                        ? 'w-1.5 h-1.5 bg-[#0A0A0A]'
                        : isReached
                          ? 'w-1.5 h-1.5 bg-white'
                          : 'w-1 h-1 bg-white/30'
                      }`}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Progressive Work Cards aligned beneath each Wave Point */}
        <div
          className="grid gap-5 xl:gap-7 mt-4"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, count)}, minmax(0, 1fr))` }}
        >
          {experiences.map((exp, idx) => {
            const pt = desktopPoints[idx];
            const isReached = reducedMotion || idx < revealedCount;
            const isSpotlight = isReached && activeIdx === idx;
            return (
              <article
                key={`${idx}-${exp.period}-${exp.role}`}
                onMouseEnter={() => {
                  if (isReached) setHoveredIdx(idx);
                }}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => handleSelectNode(idx)}
                className={`transition-all duration-700 cursor-pointer ${pt.isTrough ? 'pt-10' : 'pt-0'
                  } ${isReached
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6 pointer-events-none'
                  }`}
                style={{ transitionTimingFunction: 'var(--ease)' }}
              >
                <div className="max-w-[290px] mx-auto">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-[5px] text-[11px] font-bold tracking-[0.06em] uppercase transition-colors duration-300 ${isSpotlight
                          ? 'bg-white text-[#0A0A0A]'
                          : 'border border-white/25 text-white/85'
                        }`}
                    >
                      {exp.period}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[18.5px] xl:text-[21px] font-bold leading-[1.15] tracking-[-0.025em] text-white">
                    {exp.role}
                  </h3>

                  <p className="mt-2.5 text-[12px] font-bold tracking-[0.05em] uppercase text-white/75">
                    {exp.org}
                  </p>

                  <p className="mt-3 text-[14px] xl:text-[14.5px] font-medium leading-[1.55] tracking-[-0.01em] text-white/62">
                    {exp.summary}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Mobile / Tablet: Vertical Wavy Interactive Scroll-Filling Timeline */}
      <div className="lg:hidden relative pl-12">
        {/* Left Wavy SVG Spine */}
        <div className="absolute left-0 top-1 bottom-2 w-10 pointer-events-none" aria-hidden="true">
          <svg
            viewBox={`0 0 48 ${mobileTotalH}`}
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <path
              d={mobilePathD}
              fill="none"
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              ref={mobileFillPathRef}
              d={mobilePathD}
              pathLength={1}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ strokeDasharray: 1, strokeDashoffset: 1.05, opacity: 0 }}
            />
          </svg>
        </div>

        <div className="space-y-10">
          {experiences.map((exp, idx) => {
            const isReached = reducedMotion || idx < revealedCount;
            const isSpotlight = isReached && activeIdx === idx;
            return (
              <article
                key={`${idx}-${exp.period}-${exp.role}`}
                onClick={() => handleSelectNode(idx)}
                className="relative"
              >
                {/* Node aligned on vertical spine */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-9 top-1.5 -translate-x-1/2 flex items-center justify-center rounded-full border transition-all duration-500 ${isSpotlight
                      ? 'w-5 h-5 bg-white border-white shadow-[0_0_16px_rgba(255,255,255,0.4)]'
                      : isReached
                        ? 'w-4 h-4 bg-[#0A0A0A] border-white/85'
                        : 'w-3.5 h-3.5 bg-[#0A0A0A] border-white/25'
                    }`}
                >
                  <span
                    className={`rounded-full ${isSpotlight
                        ? 'w-1.5 h-1.5 bg-[#0A0A0A]'
                        : isReached
                          ? 'w-1.5 h-1.5 bg-white'
                          : 'w-1 h-1 bg-white/30'
                      }`}
                  />
                </span>

                <div
                  className={`transition-all duration-700 ${isReached ? 'opacity-100 translate-y-0' : 'opacity-15 translate-y-4'
                    }`}
                  style={{ transitionTimingFunction: 'var(--ease)' }}
                >
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-[5px] text-[11px] font-bold tracking-[0.06em] uppercase ${isSpotlight
                        ? 'bg-white text-[#0A0A0A]'
                        : 'border border-white/25 text-white/85'
                      }`}
                  >
                    {exp.period}
                  </span>

                  <h3 className="mt-3 text-[21px] font-bold leading-[1.18] tracking-[-0.02em] text-white">
                    {exp.role}
                  </h3>

                  <p className="mt-1.5 lbl text-white/75">{exp.org}</p>

                  <p className="mt-2.5 text-[15px] font-medium leading-[1.54] text-white/62 max-w-[48ch]">
                    {exp.summary}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
