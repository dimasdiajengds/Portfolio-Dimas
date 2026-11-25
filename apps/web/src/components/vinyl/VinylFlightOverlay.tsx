'use client';

import { useEffect, useRef } from 'react';
import type { ProjectItem } from '@/data/projects';
import { VinylDisc } from '@/components/vinyl/VinylDisc';

export interface VinylSourceRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface VinylFlightRequest {
  id: number;
  project: ProjectItem;
  sourceRect: VinylSourceRect;
}

interface VinylFlightOverlayProps {
  flight: VinylFlightRequest | null;
  onLand: (finalAngleDeg: number) => void;
}

const BASE_DISC_PX = 360;
// Crisp, smooth, zero-reflow 2-stage choreography (~1.14s total, native monitor refresh rate 60/120/144/240Hz):
// Stage 1 (0..320ms): Disc pulls smoothly out from the clicked project vinyl sleeve while camera holds steady.
// Stage 2 (320..1140ms): Camera scroll & vinyl descent glide in 100% lockstep with zero layout reads per frame.
const EJECT_MS = 320;
const GLIDE_MS = 820;
const TOTAL_MS = EJECT_MS + GLIDE_MS;

function easeOutCubic(t: number): number {
  const inv = 1 - t;
  return 1 - inv * inv * inv;
}

/** Smooth C2 quintic ease-in-out (zero velocity & zero acceleration jolt at both ends) */
function smootherstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Synchronized GPU-only vinyl eject & camera-glide overlay.
 * Pre-measures target platter geometry ONCE (zero getBoundingClientRect calls inside the glide rAF loop)
 * so Chromium stays locked at full native refresh rate (60 / 120 / 144 / 240 fps).
 */
export function VinylFlightOverlay({ flight, onLand }: VinylFlightOverlayProps) {
  const discRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const onLandRef = useRef(onLand);
  onLandRef.current = onLand;

  useEffect(() => {
    if (!flight) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      const target = document.getElementById('project-detail');
      target?.scrollIntoView({ behavior: 'auto', block: 'start' });
      onLandRef.current(0);
      return;
    }

    const discEl = discRef.current;
    if (!discEl) return;

    const { sourceRect } = flight;
    const startScrollY = window.scrollY;
    const startSize = Math.max(120, sourceRect.height * 0.95);

    // Align starting disc directly over the real peeking vinyl on the right side of the WebP jacket
    const peekCenterX = sourceRect.left + sourceRect.width * 0.65;
    const peekCenterY = sourceRect.top + sourceRect.height * 0.5;
    const releaseWorldY = peekCenterY + startScrollY;
    const ejectOffsetX = Math.min(sourceRect.width * 0.28, 130);

    const startTime = performance.now();
    let rafId = 0;
    let userTookScroll = false;
    let geometryLocked = false;
    let targetScrollY = startScrollY;

    // Pre-computed document-space destination of #turntable-platter (read ONCE, zero per-frame reflow!)
    let platterDocX = window.innerWidth * 0.68;
    let platterDocY = startScrollY + window.innerHeight * 1.48;
    let platterSize = Math.min(340, window.innerWidth * 0.32);

    const cancelAutoScroll = () => {
      userTookScroll = true;
    };
    window.addEventListener('wheel', cancelAutoScroll, { passive: true });
    window.addEventListener('touchstart', cancelAutoScroll, { passive: true });

    const lockTargetGeometry = () => {
      const curScroll = window.scrollY;
      const detailEl = document.getElementById('project-detail');
      if (detailEl) {
        // Leave clean breathing room below the fixed navbar (76px mobile / 92px desktop)
        const navClearance = window.innerWidth >= 768 ? 52 : 40;
        const rawTop = detailEl.getBoundingClientRect().top + curScroll - navClearance;
        const maxScroll = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        targetScrollY = Math.max(0, Math.min(rawTop, maxScroll));
      }

      const platterEl = document.getElementById('turntable-platter');
      if (platterEl) {
        const rect = platterEl.getBoundingClientRect();
        if (rect.width > 24 && rect.height > 24) {
          platterDocX = rect.left + rect.width * 0.5;
          platterDocY = rect.top + rect.height * 0.5 + curScroll;
          platterSize = rect.width;
        }
      }
    };

    const step = (now: number) => {
      const elapsed = now - startTime;

      let curX: number;
      let curY: number;
      let curSize: number;
      let rotDeg: number;
      let opacity = 1;
      let elevation = 0;

      if (elapsed <= EJECT_MS) {
        // Stage 1: Vinyl slides smoothly out to the right from the peeking LP while camera holds steady
        const u = Math.max(0, Math.min(1, elapsed / EJECT_MS));
        const e = easeOutCubic(u);
        curX = peekCenterX + ejectOffsetX * e;
        curY = peekCenterY;
        curSize = startSize * (0.98 + 0.04 * e);
        rotDeg = 64 * e;
        opacity = Math.min(1, elapsed / 55);
        elevation = e * 0.45;
      } else {
        // Read target platter geometry ONCE at start of Stage 2 (zero layout thrashing during glide!)
        if (!geometryLocked) {
          geometryLocked = true;
          lockTargetGeometry();
        }

        // Stage 2: Unified smooth camera scroll + vinyl descent (pure math + GPU transform = native >60fps!)
        const p = Math.max(0, Math.min(1, (elapsed - EJECT_MS) / GLIDE_MS));
        const e = smootherstep(p);

        let curScrollY: number;
        if (!userTookScroll) {
          curScrollY = lerp(startScrollY, targetScrollY, e);
          window.scrollTo({ top: curScrollY, behavior: 'instant' });
        } else {
          curScrollY = window.scrollY;
        }

        const releaseScreenX = peekCenterX + ejectOffsetX;
        const releaseScreenY = releaseWorldY - curScrollY;
        const targetScreenX = platterDocX;
        const targetScreenY = platterDocY - curScrollY;
        const arcWave = Math.sin(p * Math.PI);

        curX = lerp(releaseScreenX, targetScreenX, e) + arcWave * 24;
        curY = lerp(releaseScreenY, targetScreenY, e) - arcWave * 14;
        curSize = lerp(startSize * 1.02, platterSize, e);
        // Smooth clockwise spin matching ~33 1/3 RPM cadence on arrival
        rotDeg = 64 + 240 * p;
        elevation = 0.45 * (1 - p) + arcWave * 0.48;
      }

      const scale = curSize / BASE_DISC_PX;
      const tx = curX - BASE_DISC_PX * 0.5;
      const ty = curY - BASE_DISC_PX * 0.5;

      discEl.style.opacity = String(opacity);
      discEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotate(${rotDeg.toFixed(2)}deg)`;

      const shadowEl = shadowRef.current;
      if (shadowEl) {
        const shadowOffset = 8 + elevation * 20;
        const shadowScale = scale * (0.96 + elevation * 0.06);
        shadowEl.style.opacity = (opacity * (0.14 + elevation * 0.14)).toFixed(3);
        shadowEl.style.transform = `translate3d(${tx.toFixed(2)}px, ${(ty + shadowOffset).toFixed(2)}px, 0) scale(${shadowScale.toFixed(4)})`;
      }

      if (elapsed < TOTAL_MS) {
        rafId = window.requestAnimationFrame(step);
      } else {
        onLandRef.current(rotDeg % 360);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', cancelAutoScroll);
      window.removeEventListener('touchstart', cancelAutoScroll);
    };
  }, [flight]);

  if (!flight) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    >
      {/* Lightweight radial drop shadow disc (compositor-only, zero blur filter) */}
      <div
        ref={shadowRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: `${BASE_DISC_PX}px`,
          height: `${BASE_DISC_PX}px`,
          borderRadius: '9999px',
          background:
            'radial-gradient(circle, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.26) 56%, rgba(10,10,10,0) 74%)',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          contain: 'strict',
          opacity: 0,
        }}
      />

      {/* Flying 12" vinyl disc promoted to a single cached GPU layer for 120/144/240Hz smoothness */}
      <div
        ref={discRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: `${BASE_DISC_PX}px`,
          height: `${BASE_DISC_PX}px`,
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          contain: 'layout style paint',
          opacity: 0,
        }}
      >
        <VinylDisc project={flight.project} />
      </div>
    </div>
  );
}
