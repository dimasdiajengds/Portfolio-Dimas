'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  INITIAL_PROJECT_INDEX,
  PROJECTS,
  VINYL_BACKS_SHEET,
} from '@/data/projects';
import { useInViewport } from '@/hooks/useInViewport';
import {
  type ArcMetrics,
  COPIES,
  PROJECT_COUNT,
  TOTAL_SLOTS,
  buildArcMetrics,
  computeVinylFrame,
  relIndex,
  smoothstep,
} from '@/components/vinyl/arcMath';
import styles from '@/components/vinyl/VinylShelf.module.css';

interface VinylShowcaseSectionProps {
  activeIndex: number;
  externalJumpNonce: number;
  onActiveIndexChange: (index: number) => void;
  onOpenProject: (index: number) => void;
}

const VIRTUAL_ITEMS = Array.from({ length: TOTAL_SLOTS }, (_, v) => ({
  v,
  projectIndex: v % PROJECT_COUNT,
  project: PROJECTS[v % PROJECT_COUNT],
}));

const TIMELINE_TICKS = Array.from({ length: 37 }, (_, i) => i);
const MAJOR_YEARS = [
  { year: 2023, pct: 0 },
  { year: 2024, pct: 33.3333 },
  { year: 2025, pct: 66.6667 },
  { year: 2026, pct: 100 },
] as const;

function swapMaskText(
  container: HTMLDivElement | null,
  nextText: string,
  className: string,
  dir: number,
  reducedMotion: boolean,
) {
  if (!container) return;
  const oldChildren = Array.from(container.children) as HTMLElement[];

  if (reducedMotion || oldChildren.length === 0) {
    container.innerHTML = '';
    const span = document.createElement('span');
    span.className = `${styles.swapSpan} ${className}`;
    span.textContent = nextText;
    container.appendChild(span);
    return;
  }

  const sign = dir >= 0 ? 1 : -1;
  const nextSpan = document.createElement('span');
  nextSpan.className = `${styles.swapSpan} ${className}`;
  nextSpan.textContent = nextText;
  nextSpan.style.position = 'relative';
  container.appendChild(nextSpan);

  nextSpan.animate(
    [{ transform: `translateY(${sign * 105}%)` }, { transform: 'translateY(0%)' }],
    {
      duration: 650,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      fill: 'both',
    },
  );

  oldChildren.forEach((oldEl) => {
    const computed = window.getComputedStyle(oldEl).transform;
    const fromTransform = computed && computed !== 'none' ? computed : 'translateY(0%)';
    oldEl.style.position = 'absolute';
    oldEl.style.left = '0';
    oldEl.style.right = '0';
    oldEl.style.top = '0';
    const anim = oldEl.animate(
      [{ transform: fromTransform }, { transform: `translateY(${-sign * 105}%)` }],
      {
        duration: 650,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        fill: 'both',
      },
    );
    anim.onfinish = () => oldEl.remove();
  });
}

export function VinylShowcaseSection({
  activeIndex,
  externalJumpNonce,
  onActiveIndexChange,
  onOpenProject,
}: VinylShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const probeRef = useRef<HTMLDivElement | null>(null);
  const shelfRef = useRef<HTMLDivElement | null>(null);
  const playRingRef = useRef<HTMLButtonElement | null>(null);
  const timelineDotRef = useRef<HTMLDivElement | null>(null);
  const timelineTrackRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const titleMaskRef = useRef<HTMLDivElement | null>(null);
  const subMaskRef = useRef<HTMLDivElement | null>(null);
  const metaMaskRef = useRef<HTMLDivElement | null>(null);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frontRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backRefs = useRef<(HTMLDivElement | null)[]>([]);
  const edgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const inView = useInViewport(sectionRef, '220px 0px');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Core animation mutable state (zero React re-renders per frame!)
  const startSlot = INITIAL_PROJECT_INDEX + PROJECT_COUNT * 2;
  const sRef = useRef<number>(startSlot);
  const TRef = useRef<number>(startSlot);
  const navDirRef = useRef<1 | -1>(1);
  const activeIdxRef = useRef<number>(INITIAL_PROJECT_INDEX);
  const metricsRef = useRef<ArcMetrics | null>(null);

  const liftsRef = useRef<Float32Array>(new Float32Array(TOTAL_SLOTS));
  const hoveredVirtualRef = useRef<number>(-1);
  const timelineYearRef = useRef<number>(PROJECTS[INITIAL_PROJECT_INDEX].timelineYear);

  // Pointer, tilt, drag, & custom cursor refs
  const pointerRef = useRef({ x: -200, y: -200, inside: false, mode: 'hidden' as string });
  const cursorPosRef = useRef({ x: -200, y: -200 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startT: startSlot,
    pointerId: -1,
    suppressClickUntil: 0,
  });
  const wheelSnapTimerRef = useRef<number | null>(null);

  const onActiveChangeRef = useRef(onActiveIndexChange);
  onActiveChangeRef.current = onActiveIndexChange;
  const onOpenProjectRef = useRef(onOpenProject);
  onOpenProjectRef.current = onOpenProject;

  // Listen to prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Preload priority vinyls first (center + neighbors + 7-in-1 back sheet), then remaining
  useEffect(() => {
    const prioritySrcs = [
      PROJECTS[INITIAL_PROJECT_INDEX].frontImage,
      PROJECTS[(INITIAL_PROJECT_INDEX + 1) % PROJECT_COUNT].frontImage,
      PROJECTS[(INITIAL_PROJECT_INDEX + PROJECT_COUNT - 1) % PROJECT_COUNT].frontImage,
      VINYL_BACKS_SHEET,
    ];
    prioritySrcs.forEach((src) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });

    const loadRest = () => {
      PROJECTS.forEach((p) => {
        if (!prioritySrcs.includes(p.frontImage)) {
          const img = new Image();
          img.decoding = 'async';
          img.src = p.frontImage;
        }
      });
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === 'function') {
      const id = win.requestIdleCallback(loadRest);
      return () => win.cancelIdleCallback?.(id);
    }
    const timer = globalThis.setTimeout(loadRest, 400);
    return () => globalThis.clearTimeout(timer);
  }, []);

  // Initialize caption text once on mount
  useEffect(() => {
    const p = PROJECTS[INITIAL_PROJECT_INDEX];
    swapMaskText(titleMaskRef.current, p.title, styles.titleText, 1, true);
    swapMaskText(subMaskRef.current, `${p.subtitle} / ${p.code}`, styles.subText, 1, true);
    swapMaskText(
      metaMaskRef.current,
      `${p.year} / ${p.theme.toUpperCase()}`,
      styles.yearText,
      1,
      true,
    );
  }, []);

  // Sync external navigation (e.g., Prev/Next buttons clicked inside Section 03)
  useEffect(() => {
    if (externalJumpNonce === 0) return;
    const currentMod =
      ((Math.round(TRef.current) % PROJECT_COUNT) + PROJECT_COUNT) % PROJECT_COUNT;
    let delta = activeIndex - currentMod;
    if (delta > PROJECT_COUNT / 2) delta -= PROJECT_COUNT;
    if (delta < -PROJECT_COUNT / 2) delta += PROJECT_COUNT;
    if (delta !== 0) {
      navDirRef.current = delta > 0 ? 1 : -1;
      TRef.current = Math.round(TRef.current) + delta;
    }
  }, [activeIndex, externalJumpNonce]);

  const applyMetricsToDOM = useCallback(() => {
    const probe = probeRef.current;
    const section = sectionRef.current;
    if (!probe || !section) return;

    const H = probe.getBoundingClientRect().height || 340;
    const isMobile = window.innerWidth <= 767;
    const m = buildArcMetrics(H, isMobile);
    metricsRef.current = m;

    const halfW = m.dFull * 0.5;
    const halfH = m.H * 0.5;
    const halfWs = m.ws * 0.5;

    for (let v = 0; v < TOTAL_SLOTS; v++) {
      const front = frontRefs.current[v];
      const back = backRefs.current[v];
      const edge = edgeRefs.current[v];

      if (front) {
        front.style.width = `${m.dFull}px`;
        front.style.height = `${m.H}px`;
        front.style.left = `${-halfW}px`;
        front.style.top = `${-halfH}px`;
        front.style.transform = `translateZ(${halfWs}px)`;
      }
      if (back) {
        back.style.width = `${m.dFull}px`;
        back.style.height = `${m.H}px`;
        back.style.left = `${-halfW}px`;
        back.style.top = `${-halfH}px`;
        back.style.transform = `rotateY(180deg) translateZ(${halfWs}px)`;
      }
      if (edge) {
        edge.style.width = `${m.ws}px`;
        edge.style.height = `${m.H}px`;
        edge.style.left = `${-halfW - halfWs}px`;
        edge.style.top = `${-halfH}px`;
        edge.style.transform = `rotateY(-90deg)`;
      }
    }

    // Position play ring on lower-left corner of the active center jacket
    const playRing = playRingRef.current;
    if (playRing) {
      const rect = section.getBoundingClientRect();
      const cyPx = rect.height * 0.43;
      const jacketLeftOffset = halfW;
      playRing.style.left = `${rect.width * 0.5 - jacketLeftOffset + 6}px`;
      playRing.style.top = `${cyPx + m.H * 0.36}px`;
    }
  }, []);

  useEffect(() => {
    applyMetricsToDOM();
    window.addEventListener('resize', applyMetricsToDOM);
    return () => window.removeEventListener('resize', applyMetricsToDOM);
  }, [applyMetricsToDOM]);

  const stepBy = useCallback((delta: number) => {
    if (delta === 0) return;
    navDirRef.current = delta > 0 ? 1 : -1;
    TRef.current = Math.round(TRef.current) + delta;
  }, []);

  // Keyboard navigation when Vinyl Showcase is in viewport
  useEffect(() => {
    if (!inView) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepBy(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepBy(-1);
      } else if (e.key === 'Enter' && document.activeElement === document.body) {
        onOpenProjectRef.current(activeIdxRef.current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inView, stepBy]);

  // Horizontal-only wheel handler: vertical wheel (deltaY) passes through cleanly to Section 03!
  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;

    const onWheel = (e: WheelEvent) => {
      // Strictly preserve vertical scroll pass-through into Section 03 / Hero
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 2) {
        return;
      }
      e.preventDefault();
      const m = metricsRef.current;
      if (!m) return;
      const stepDelta = (e.deltaX / (m.slot + m.gap)) * 0.45;
      navDirRef.current = stepDelta >= 0 ? 1 : -1;
      TRef.current += stepDelta;

      if (wheelSnapTimerRef.current) {
        window.clearTimeout(wheelSnapTimerRef.current);
      }
      wheelSnapTimerRef.current = window.setTimeout(() => {
        TRef.current = Math.round(TRef.current);
      }, 160);
    };

    shelf.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      shelf.removeEventListener('wheel', onWheel);
      if (wheelSnapTimerRef.current) window.clearTimeout(wheelSnapTimerRef.current);
    };
  }, []);

  // Main Viewport-Gated requestAnimationFrame Loop (0% idle CPU when scrolled away!)
  useEffect(() => {
    if (!inView) {
      if (cursorRef.current) {
        cursorRef.current.setAttribute('data-mode', 'hidden');
      }
      return;
    }

    if (!metricsRef.current) {
      applyMetricsToDOM();
    }

    let rafId = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const m = metricsRef.current;
      const section = sectionRef.current;
      if (!m || !section) {
        rafId = window.requestAnimationFrame(loop);
        return;
      }

      // 1. Update travel direction before spring update
      const diff = TRef.current - sRef.current;
      if (Math.abs(diff) > 0.02) {
        navDirRef.current = diff > 0 ? 1 : -1;
      }

      // 2. Spring motion
      if (reducedMotion) {
        sRef.current = TRef.current;
      } else {
        const k = dragRef.current.active ? 18 : 5.2;
        sRef.current += diff * (1 - Math.exp(-k * dt));
      }

      // Keep s & T near middle loop (COPIES=5 -> center copy is index 2, slot 14..20)
      const centerBase = PROJECT_COUNT * 2;
      if (sRef.current > centerBase + PROJECT_COUNT * 2) {
        sRef.current -= PROJECT_COUNT * 2;
        TRef.current -= PROJECT_COUNT * 2;
      } else if (sRef.current < centerBase - PROJECT_COUNT * 2) {
        sRef.current += PROJECT_COUNT * 2;
        TRef.current += PROJECT_COUNT * 2;
      }

      const s = sRef.current;
      const T = TRef.current;
      const navDir = navDirRef.current;

      // 3. Detect active project index change -> mask-slide caption swap & notify parent
      const newActive =
        ((Math.round(s) % PROJECT_COUNT) + PROJECT_COUNT) % PROJECT_COUNT;
      if (newActive !== activeIdxRef.current) {
        const swapDir = diff >= 0 ? 1 : -1;
        activeIdxRef.current = newActive;
        const proj = PROJECTS[newActive];
        swapMaskText(titleMaskRef.current, proj.title, styles.titleText, swapDir, reducedMotion);
        swapMaskText(
          subMaskRef.current,
          `${proj.subtitle} / ${proj.code}`,
          styles.subText,
          swapDir,
          reducedMotion,
        );
        swapMaskText(
          metaMaskRef.current,
          `${proj.year} / ${proj.theme.toUpperCase()}`,
          styles.yearText,
          swapDir,
          reducedMotion,
        );
        onActiveChangeRef.current(newActive);
      }

      // 4. Cover 3D tilt & cursor mode evaluation
      const rect = section.getBoundingClientRect();
      const W = rect.width;
      const cyScreen = rect.top + rect.height * 0.43;
      const cxScreen = rect.left + W * 0.5;
      const ptr = pointerRef.current;
      const settled = Math.abs(T - s) < 0.3;

      const onCover =
        ptr.inside &&
        settled &&
        !dragRef.current.active &&
        Math.abs(ptr.x - cxScreen) < m.dFull * 0.52 &&
        Math.abs(ptr.y - cyScreen) < m.H * 0.54;

      let targetTiltY = 0;
      let targetTiltX = 0;
      if (ptr.inside && !reducedMotion) {
        if (onCover) {
          targetTiltY = ((ptr.x - cxScreen) / (m.dFull * 0.55)) * 8;
          targetTiltX = -((ptr.y - cyScreen) / (m.H * 0.5)) * 5;
        } else {
          targetTiltY = ((ptr.x - cxScreen) / Math.max(1, W)) * 4;
          targetTiltX = 0;
        }
      }
      const tiltEase = reducedMotion ? 1 : 1 - Math.exp(-7 * dt);
      tiltRef.current.y += (targetTiltY - tiltRef.current.y) * tiltEase;
      tiltRef.current.x += (targetTiltX - tiltRef.current.x) * tiltEase;

      // 5. Update every virtual slim 3D vinyl record
      const lifts = liftsRef.current;
      const liftEase = reducedMotion ? 1 : 1 - Math.exp(-12 * dt);

      for (let v = 0; v < TOTAL_SLOTS; v++) {
        const el = itemRefs.current[v];
        if (!el) continue;

        const r = relIndex(v, s);
        const wantLift = hoveredVirtualRef.current === v && Math.abs(r) > 0.5 ? 1 : 0;
        lifts[v] += (wantLift - lifts[v]) * liftEase;

        const frame = computeVinylFrame(
          r,
          m,
          navDir,
          lifts[v],
          tiltRef.current.x,
          tiltRef.current.y,
          reducedMotion,
        );

        if (!frame.visible) {
          if (el.style.visibility !== 'hidden') {
            el.style.visibility = 'hidden';
          }
          continue;
        }

        if (el.style.visibility !== 'visible') {
          el.style.visibility = 'visible';
        }

        el.style.transform = `translate3d(${frame.x.toFixed(2)}px, ${frame.y.toFixed(2)}px, ${frame.z.toFixed(2)}px) rotateX(${frame.rotX.toFixed(2)}deg) rotateY(${frame.rotY.toFixed(2)}deg)`;
        el.style.zIndex = String(frame.zIndex);
        el.style.setProperty('--shade', frame.shade.toFixed(3));
        el.dataset.near = frame.nearCenter ? '1' : '0';
      }

      // 6. Play ring smoothstep scale
      const playRing = playRingRef.current;
      if (playRing) {
        const pScale = smoothstep(Math.max(0, 1 - Math.abs(T - s) * 3));
        playRing.style.transform = `scale(${pScale.toFixed(3)})`;
        playRing.style.pointerEvents = pScale > 0.5 ? 'auto' : 'none';
      }

      // 7. Timeline cobalt dot interpolation (2023.0 .. 2026.0)
      const dot = timelineDotRef.current;
      if (dot) {
        const f0 = Math.floor(s);
        const frac = s - f0;
        const i0 = ((f0 % PROJECT_COUNT) + PROJECT_COUNT) % PROJECT_COUNT;
        const i1 = (i0 + 1) % PROJECT_COUNT;
        const y0 = PROJECTS[i0].timelineYear;
        const y1 = PROJECTS[i1].timelineYear;
        let targetYear: number;
        if (i0 === PROJECT_COUNT - 1 && i1 === 0) {
          // 2026.0 -> 2023.0 wrap jumps cleanly at halfway point
          targetYear = frac < 0.5 ? y0 : y1;
        } else {
          targetYear = y0 + (y1 - y0) * frac;
        }

        if (reducedMotion || Math.abs(targetYear - timelineYearRef.current) > 1.8) {
          timelineYearRef.current = targetYear;
        } else {
          timelineYearRef.current +=
            (targetYear - timelineYearRef.current) * (1 - Math.exp(-14 * dt));
        }

        const pct = ((timelineYearRef.current - 2023) / 3) * 100;
        dot.style.left = `${Math.max(0, Math.min(100, pct)).toFixed(3)}%`;
      }

      // 8. Custom cursor smooth follow (1 - e^(-16dt))
      const cursorEl = cursorRef.current;
      if (cursorEl) {
        if (!ptr.inside) {
          cursorEl.setAttribute('data-mode', 'hidden');
        } else {
          const cEase = reducedMotion ? 1 : 1 - Math.exp(-16 * dt);
          cursorPosRef.current.x += (ptr.x - cursorPosRef.current.x) * cEase;
          cursorPosRef.current.y += (ptr.y - cursorPosRef.current.y) * cEase;
          cursorEl.style.transform = `translate3d(${cursorPosRef.current.x.toFixed(1)}px, ${cursorPosRef.current.y.toFixed(1)}px, 0)`;

          const resolvedMode =
            ptr.mode === 'btn'
              ? 'btn'
              : onCover
                ? 'open'
                : hoveredVirtualRef.current !== -1
                  ? 'spine'
                  : 'default';
          cursorEl.setAttribute('data-mode', resolvedMode);
        }
      }

      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(rafId);
  }, [applyMetricsToDOM, inView, reducedMotion]);

  // Pointer Drag Handlers on the Shelf
  const handleShelfPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startT: TRef.current,
      pointerId: e.pointerId,
      suppressClickUntil: dragRef.current.suppressClickUntil,
    };
  };

  const handleShelfPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerRef.current.x = e.clientX;
    pointerRef.current.y = e.clientY;
    pointerRef.current.inside = true;

    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > 5) {
      drag.moved = true;
      shelfRef.current?.setPointerCapture(e.pointerId);
    }
    if (drag.moved && metricsRef.current) {
      const m = metricsRef.current;
      const nextT = drag.startT - dx / (m.slot + m.gap);
      if (Math.abs(nextT - TRef.current) > 0.002) {
        navDirRef.current = nextT > TRef.current ? 1 : -1;
      }
      TRef.current = nextT;
    }
  };

  const handleShelfPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) return;
    drag.active = false;
    if (drag.moved) {
      TRef.current = Math.round(TRef.current);
      drag.suppressClickUntil = performance.now() + 180;
      try {
        shelfRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture wasn't acquired
      }
    }
  };

  const handleItemClick = (v: number, projectIndex: number) => {
    if (performance.now() < dragRef.current.suppressClickUntil) return;
    const r = relIndex(v, sRef.current);
    if (Math.abs(r) < 0.45) {
      // Active center vinyl clicked -> open Project Detail directly in Section 03!
      TRef.current = Math.round(TRef.current);
      onOpenProject(projectIndex);
    } else {
      // Side vinyl clicked -> glide smoothly to center (triggering 1-step directional back spin!)
      navDirRef.current = r > 0 ? 1 : -1;
      TRef.current = Math.round(sRef.current + r);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const track = timelineTrackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetYear = 2023 + ratio * 3;

    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < PROJECT_COUNT; i++) {
      const dist = Math.abs(PROJECTS[i].timelineYear - targetYear);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    const currentMod =
      ((Math.round(TRef.current) % PROJECT_COUNT) + PROJECT_COUNT) % PROJECT_COUNT;
    let delta = bestIdx - currentMod;
    if (delta > PROJECT_COUNT / 2) delta -= PROJECT_COUNT;
    if (delta < -PROJECT_COUNT / 2) delta += PROJECT_COUNT;
    if (delta !== 0) {
      stepBy(delta);
    }
  };

  const activeProject = useMemo(
    () => PROJECTS[activeIndex] ?? PROJECTS[INITIAL_PROJECT_INDEX],
    [activeIndex],
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-label="Curved 3D Vinyl LP Project Showcase"
      className={`${styles.section} vinyl-cursor-zone`}
      onPointerMove={(e) => {
        pointerRef.current.x = e.clientX;
        pointerRef.current.y = e.clientY;
        pointerRef.current.inside = true;
      }}
      onPointerEnter={(e) => {
        pointerRef.current.x = e.clientX;
        pointerRef.current.y = e.clientY;
        cursorPosRef.current.x = e.clientX;
        cursorPosRef.current.y = e.clientY;
        pointerRef.current.inside = true;
      }}
      onPointerLeave={() => {
        pointerRef.current.inside = false;
        pointerRef.current.mode = 'hidden';
        hoveredVirtualRef.current = -1;
      }}
    >
      {/* Hidden Height Probe */}
      <div ref={probeRef} className={styles.probe} aria-hidden="true" />

      {/* Section Top Metadata */}
      <div className={styles.sectionMeta}>
        <span className="lbl text-[var(--ink)]">02 / SELECTED VINYL PROJECTS</span>
        <span className={`lbl ${styles.sectionMetaHint}`}>
          DRAG OR USE ← / → TO SPIN · CLICK CENTER VINYL TO OPEN DETAILS
        </span>
      </div>

      {/* Giant Halftone Vertical Background Typography */}
      <div aria-hidden="true" className={`${styles.halftone} ${styles.halftoneLeft}`}>
        PORT
      </div>
      <div aria-hidden="true" className={`${styles.halftone} ${styles.halftoneRight}`}>
        FOLIO
      </div>

      {/* Soft Curved Shelf Floor Shadow */}
      <div aria-hidden="true" className={styles.floorShadow} />

      {/* 3D Perspective Curved Vinyl LP Shelf */}
      <div
        ref={shelfRef}
        className={styles.shelf}
        onPointerDown={handleShelfPointerDown}
        onPointerMove={handleShelfPointerMove}
        onPointerUp={handleShelfPointerUp}
        onPointerCancel={handleShelfPointerUp}
      >
        <div className={styles.stage}>
          {VIRTUAL_ITEMS.map(({ v, projectIndex, project }) => {
            const [col, row] = project.backCell;
            const bgPosX = `${(col / 3) * 100}%`;
            const bgPosY = `${row * 100}%`;

            return (
              <div
                key={v}
                ref={(el) => {
                  itemRefs.current[v] = el;
                }}
                className={styles.item}
                onPointerEnter={() => {
                  hoveredVirtualRef.current = v;
                }}
                onPointerLeave={() => {
                  if (hoveredVirtualRef.current === v) {
                    hoveredVirtualRef.current = -1;
                  }
                }}
                onClick={() => handleItemClick(v, projectIndex)}
              >
                {/* Front Face (Transparent WebP Cutout) */}
                <div
                  ref={(el) => {
                    frontRefs.current[v] = el;
                  }}
                  className={`${styles.face} ${styles.front}`}
                  style={{
                    backgroundImage: `url("${project.frontImage}")`,
                  }}
                  role="button"
                  tabIndex={v === startSlot ? 0 : -1}
                  aria-label={`Select or open ${project.title}`}
                />

                {/* Back Face (Cropped from single 7-in-1 vinyl-backs-sheet.webp 4x2 grid) */}
                <div
                  ref={(el) => {
                    backRefs.current[v] = el;
                  }}
                  className={`${styles.face} ${styles.back}`}
                  style={{
                    backgroundImage: `url("${VINYL_BACKS_SHEET}")`,
                    backgroundPosition: `${bgPosX} ${bgPosY}`,
                  }}
                  aria-hidden="true"
                />

                {/* Ultra-Slim 5-8px Real LP Spine Edge */}
                <div
                  ref={(el) => {
                    edgeRefs.current[v] = el;
                  }}
                  className={styles.edge}
                  style={{ backgroundColor: project.edgeColor }}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Cobalt Play / Open Ring on lower-left corner of center vinyl */}
      <button
        ref={playRingRef}
        type="button"
        aria-label={`Open ${activeProject.title} project details`}
        className={styles.playRing}
        onClick={() => onOpenProject(activeIdxRef.current)}
        onPointerEnter={() => {
          pointerRef.current.mode = 'btn';
        }}
        onPointerLeave={() => {
          pointerRef.current.mode = 'default';
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          <path d="M3 1.8L10.5 6L3 10.2V1.8Z" />
        </svg>
      </button>

      {/* Previous / Next Cobalt Arrows */}
      <button
        type="button"
        aria-label="Previous project"
        className={`${styles.arrowBtn} ${styles.arrowPrev}`}
        onClick={() => stepBy(-1)}
        onPointerEnter={() => {
          pointerRef.current.mode = 'btn';
        }}
        onPointerLeave={() => {
          pointerRef.current.mode = 'default';
        }}
      >
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M6 1L1 6l5 5M1 6h23" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next project"
        className={`${styles.arrowBtn} ${styles.arrowNext}`}
        onClick={() => stepBy(1)}
        onPointerEnter={() => {
          pointerRef.current.mode = 'btn';
        }}
        onPointerLeave={() => {
          pointerRef.current.mode = 'default';
        }}
      >
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M18 1l5 5-5 5M23 6H0" />
        </svg>
      </button>

      {/* Active Project Mask-Slide Caption */}
      <div className={styles.caption}>
        <div ref={titleMaskRef} className={`${styles.maskBox} ${styles.titleMask}`} />
        <div ref={subMaskRef} className={`${styles.maskBox} ${styles.subMask}`} />
        <div className={styles.rule} aria-hidden="true" />
        <div ref={metaMaskRef} className={`${styles.maskBox} ${styles.metaMask}`} />
      </div>

      {/* Bottom Interactive Timeline Ruler (2023 - 2026) */}
      <div ref={timelineTrackRef} className={styles.timeline}>
        <div className={styles.timelineLine} />

        {TIMELINE_TICKS.map((t) => {
          const isMajor = t % 12 === 0;
          const pct = (t / 36) * 100;
          return (
            <span
              key={t}
              aria-hidden="true"
              className={`${styles.tick} ${isMajor ? styles.tickMajor : styles.tickMinor}`}
              style={{ left: `${pct}%` }}
            />
          );
        })}

        {MAJOR_YEARS.map((item, idx) => (
          <span
            key={item.year}
            className={`${styles.yearLabel} ${
              idx === 0
                ? styles.yearLabelFirst
                : idx === MAJOR_YEARS.length - 1
                  ? styles.yearLabelLast
                  : ''
            }`}
            style={{ left: `${item.pct}%` }}
          >
            {item.year}
          </span>
        ))}

        <div ref={timelineDotRef} className={styles.timelineDot} />

        <button
          type="button"
          aria-label="Jump along 2023 to 2026 project timeline"
          className={styles.timelineHit}
          onClick={handleTimelineClick}
          onPointerEnter={() => {
            pointerRef.current.mode = 'btn';
          }}
          onPointerLeave={() => {
            pointerRef.current.mode = 'default';
          }}
        />
      </div>

      {/* Subtle Scroll Continuation Cue to Section 03 */}
      <div className={styles.shelfFooterBar}>
        <span className="lbl text-[var(--muted)]">
          {activeProject.code} / 0{PROJECT_COUNT}
        </span>
        <button
          type="button"
          onClick={() => onOpenProject(activeIdxRef.current)}
          onPointerEnter={() => {
            pointerRef.current.mode = 'btn';
          }}
          onPointerLeave={() => {
            pointerRef.current.mode = 'default';
          }}
          className="lbl text-[var(--ink)] bg-transparent border-0 p-0 hover:text-[var(--cobalt)] transition-colors"
        >
          OPEN CASE STUDY IN SECTION 03 ↓
        </button>
      </div>

      {/* Custom Interactive Cursor (desktop pointer:fine only) */}
      <div ref={cursorRef} className="custom-cursor" data-mode="hidden" aria-hidden="true">
        <div className="custom-cursor-ring" />
        <div className="custom-cursor-dot" />
        <span className="custom-cursor-label">OPEN</span>
      </div>
    </section>
  );
}
