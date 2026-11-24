'use client';

import { useEffect, useId, useRef } from 'react';

interface InkRevealPosterProps {
  imageSrc: string;
  alt: string;
  revealKey: string;
}

const CIRCLES: ReadonlyArray<readonly [cx: number, cy: number, delayMs: number]> = [
  [220, 260, 0],
  [640, 420, 120],
  [450, 140, 220],
  [160, 500, 300],
  [760, 200, 360],
  [480, 540, 420],
  [420, 320, 180],
];

export function InkRevealPoster({ imageSrc, alt, revealKey }: InkRevealPosterProps) {
  const uid = useId().replace(/:/g, '');
  const maskId = `ink-mask-${uid}`;
  const filterId = `ink-filter-${uid}`;
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      circleRefs.current.forEach((c) => {
        if (c) c.setAttribute('r', '760');
      });
      return;
    }

    let rafId = 0;
    const startTime = performance.now() + 180;
    const duration = 1150;

    circleRefs.current.forEach((c) => {
      if (c) c.setAttribute('r', '0');
    });

    const tick = (now: number) => {
      let allDone = true;
      for (let i = 0; i < CIRCLES.length; i++) {
        const el = circleRefs.current[i];
        if (!el) continue;
        const delay = CIRCLES[i][2];
        const elapsed = now - (startTime + delay);
        if (elapsed <= 0) {
          el.setAttribute('r', '0');
          allDone = false;
        } else if (elapsed < duration) {
          const t = elapsed / duration;
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
          el.setAttribute('r', String(Math.round(eased * 760)));
          allDone = false;
        } else {
          el.setAttribute('r', '760');
        }
      }
      if (!allDone) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [revealKey]);

  return (
    <svg
      viewBox="0 0 900 530"
      className="w-full h-auto max-h-[58vh] select-none"
      role="img"
      aria-label={alt}
      style={{ filter: 'drop-shadow(0 26px 34px rgba(20, 16, 10, 0.22))' }}
    >
      <defs>
        <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="120"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <mask id={maskId}>
          <g filter={`url(#${filterId})`}>
            {CIRCLES.map(([cx, cy], idx) => (
              <circle
                key={idx}
                ref={(el) => {
                  circleRefs.current[idx] = el;
                }}
                cx={cx}
                cy={cy}
                r={760}
                fill="#FFFFFF"
              />
            ))}
          </g>
        </mask>
      </defs>

      <image
        href={imageSrc}
        x="0"
        y="0"
        width="900"
        height="530"
        preserveAspectRatio="xMidYMid meet"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
