'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  INITIAL_PROJECT_INDEX,
  PROJECTS,
  VINYL_BACKS_SHEET,
} from '@/data/projects';
import { useInViewport } from '@/hooks/useInViewport';
import {
  type ArcMetrics,
  PROJECT_COUNT,
  TOTAL_SLOTS,
  buildArcMetrics,
  computeVinylFrame,
  relIndex,
} from '@/components/vinyl/arcMath';
import type { VinylSourceRect } from '@/components/vinyl/VinylFlightOverlay';
import styles from '@/components/vinyl/VinylShelf.module.css';

interface VinylShowcaseSectionProps {
  activeIndex: number;
  externalJumpNonce: number;
  onActiveIndexChange: (index: number) => void;
  onOpenProject: (index: number, sourceRect?: VinylSourceRect) => void;
}

const VIRTUAL_ITEMS = Array.from({ length: TOTAL_SLOTS }, (_, v) => ({
  v,
  projectIndex: v % PROJECT_COUNT,
  project: PROJECTS[v % PROJECT_COUNT],
}));

const TIMELINE_START_YEAR = 2024;
const TIMELINE_END_YEAR = 2027;
const TIMELINE_SPAN = TIMELINE_END_YEAR - TIMELINE_START_YEAR;

const TIMELINE_TICKS = Array.from({ length: 37 }, (_, i) => i);
const MAJOR_YEARS = [
  { year: 2024, pct: 0 },
  { year: 2025, pct: 33.3333 },
  { year: 2026, pct: 66.6667 },
  { year: 2027, pct: 100 },
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
  const timelineDotRef = useRef<HTMLDivElement | null>(null);
  const timelineTrackRef = useRef<HTMLDivElement | null>(null);

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
  const velRef = useRef<number>(0);
  const TRef = useRef<number>(startSlot);
  const navDirRef = useRef<1 | -1>(1);
  const activeIdxRef = useRef<number>(INITIAL_PROJECT_INDEX);
  const metricsRef = useRef<ArcMetrics | null>(null);
  const layoutCacheRef = useRef({ sectionW: 1280, sectionH: 800, timelineW: 800 });

  const liftsRef = useRef<Float32Array>(new Float32Array(TOTAL_SLOTS));
  const hoveredVirtualRef = useRef<number>(-1);
  const timelineYearRef = useRef<number>(PROJECTS[INITIAL_PROJECT_INDEX].timelineYear);

  // Per-slot DOM write caches (2 = uninitialized, 0 = hidden, 1 = visible)
  const prevVisibleRef = useRef<Uint8Array>(new Uint8Array(TOTAL_SLOTS).fill(2));
  const prevZIndexRef = useRef<Int32Array>(new Int32Array(TOTAL_SLOTS).fill(-1));
  const prevOpacityRef = useRef<Float32Array>(new Float32Array(TOTAL_SLOTS).fill(-1));

  // Pointer (stored in section-local coordinates to avoid layout reads in rAF), tilt, & drag refs
  const pointerRef = useRef({ x: -200, y: -200, inside: false });
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
  const wakeRef = useRef<() => void>(() => { });

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
      wakeRef.current();
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

    const rect = section.getBoundingClientRect();
    const timelineW = timelineTrackRef.current?.getBoundingClientRect().width || rect.width;
    layoutCacheRef.current = {
      sectionW: rect.width || window.innerWidth,
      sectionH: rect.height || window.innerHeight,
      timelineW,
    };

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

    wakeRef.current();
  }, []);

  useEffect(() => {
    applyMetricsToDOM();
    window.addEventListener('resize', applyMetricsToDOM, { passive: true });
    return () => window.removeEventListener('resize', applyMetricsToDOM);
  }, [applyMetricsToDOM]);

  const stepBy = useCallback((delta: number) => {
    if (delta === 0) return;
    navDirRef.current = delta > 0 ? 1 : -1;
    TRef.current = Math.round(TRef.current) + delta;
    wakeRef.current();
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
      wakeRef.current();

      if (wheelSnapTimerRef.current) {
        window.clearTimeout(wheelSnapTimerRef.current);
      }
      wheelSnapTimerRef.current = window.setTimeout(() => {
        TRef.current = Math.round(TRef.current);
        wakeRef.current();
      }, 160);
    };

    shelf.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      shelf.removeEventListener('wheel', onWheel);
      if (wheelSnapTimerRef.current) window.clearTimeout(wheelSnapTimerRef.current);
    };
  }, []);

  // Main On-Demand + Viewport-Gated requestAnimationFrame Loop
  // Zero layout reads inside rAF, GPU-composited transforms/opacity only, auto-sleeps when settled!
  useEffect(() => {
    if (!inView) {
      wakeRef.current = () => { };
      return;
    }

    if (!metricsRef.current) {
      applyMetricsToDOM();
    }

    let rafId = 0;
    let lastTime = performance.now();
    let prevDotPx = -1;

    const render = (now: number) => {
      rafId = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const m = metricsRef.current;
      if (!m) return;

      // 1. Update travel direction before spring update
      const diff = TRef.current - sRef.current;
      if (Math.abs(diff) > 0.02) {
        navDirRef.current = diff > 0 ? 1 : -1;
      }

      // 2. Analytical critically-damped 2nd-order spring (smooth ease-in, velvety landing, zero overshoot)
      if (reducedMotion) {
        sRef.current = TRef.current;
        velRef.current = 0;
      } else {
        const omega = dragRef.current.active ? 22 : 9.2;
        const x0 = sRef.current - TRef.current;
        const v0 = velRef.current;
        const expTerm = Math.exp(-omega * dt);
        const newX = (x0 + (v0 + omega * x0) * dt) * expTerm;
        const newV = (v0 - omega * (v0 + omega * x0) * dt) * expTerm;
        sRef.current = TRef.current + newX;
        velRef.current = newV;
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

      // 4. Cover 3D tilt & cursor evaluation using cached layout (zero DOM reads in rAF!)
      const { sectionW: W, sectionH: Hsec, timelineW } = layoutCacheRef.current;
      const cxLocal = W * 0.5;
      const cyLocal = Hsec * 0.43;
      const ptr = pointerRef.current;
      const settled = Math.abs(T - s) < 0.3;

      const onCover =
        ptr.inside &&
        settled &&
        !dragRef.current.active &&
        Math.abs(ptr.x - cxLocal) < m.dFull * 0.52 &&
        Math.abs(ptr.y - cyLocal) < m.H * 0.54;

      let targetTiltY = 0;
      let targetTiltX = 0;
      if (ptr.inside && !reducedMotion) {
        if (onCover) {
          targetTiltY = ((ptr.x - cxLocal) / (m.dFull * 0.55)) * 8;
          targetTiltX = -((ptr.y - cyLocal) / (m.H * 0.5)) * 5;
        } else {
          targetTiltY = ((ptr.x - cxLocal) / Math.max(1, W)) * 4;
          targetTiltX = 0;
        }
      }
      const tiltEase = reducedMotion ? 1 : 1 - Math.exp(-8 * dt);
      tiltRef.current.y += (targetTiltY - tiltRef.current.y) * tiltEase;
      tiltRef.current.x += (targetTiltX - tiltRef.current.x) * tiltEase;

      // 5. Update every virtual slim 3D vinyl record (GPU transform + cached opacity/zIndex only)
      const lifts = liftsRef.current;
      const prevVisible = prevVisibleRef.current;
      const prevZ = prevZIndexRef.current;
      const prevOp = prevOpacityRef.current;
      const liftEase = reducedMotion ? 1 : 1 - Math.exp(-12 * dt);
      let anyLiftMoving = false;

      for (let v = 0; v < TOTAL_SLOTS; v++) {
        const el = itemRefs.current[v];
        if (!el) continue;

        const r = relIndex(v, s);
        const wantLift = hoveredVirtualRef.current === v && Math.abs(r) > 0.5 ? 1 : 0;
        const liftDelta = wantLift - lifts[v];
        if (Math.abs(liftDelta) > 0.002) {
          lifts[v] += liftDelta * liftEase;
          anyLiftMoving = true;
        } else {
          lifts[v] = wantLift;
        }

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
          if (prevVisible[v] !== 0) {
            prevVisible[v] = 0;
            el.style.visibility = 'hidden';
            el.style.willChange = 'auto';
          }
          continue;
        }

        if (prevVisible[v] !== 1) {
          prevVisible[v] = 1;
          el.style.visibility = 'visible';
          el.style.willChange = 'transform';
        }

        el.style.transform = `translate3d(${frame.x.toFixed(2)}px, ${frame.y.toFixed(2)}px, ${frame.z.toFixed(2)}px) rotateX(${frame.rotX.toFixed(2)}deg) rotateY(${frame.rotY.toFixed(2)}deg)`;

        if (prevZ[v] !== frame.zIndex) {
          prevZ[v] = frame.zIndex;
          el.style.zIndex = String(frame.zIndex);
        }

        // Compositor-only atmospheric depth shading (zero expensive CSS filter passes)
        const nextOpacity = Math.round((1 - frame.shade * 0.42) * 200) / 200;
        if (prevOp[v] !== nextOpacity) {
          prevOp[v] = nextOpacity;
          el.style.opacity = String(nextOpacity);
        }
      }

      // 6. Timeline cobalt dot interpolation via GPU translate3d (zero layout property writes!)
      const dot = timelineDotRef.current;
      let targetYear = timelineYearRef.current;
      if (dot) {
        const f0 = Math.floor(s);
        const frac = s - f0;
        const i0 = ((f0 % PROJECT_COUNT) + PROJECT_COUNT) % PROJECT_COUNT;
        const i1 = (i0 + 1) % PROJECT_COUNT;
        const y0 = PROJECTS[i0].timelineYear;
        const y1 = PROJECTS[i1].timelineYear;
        if (i0 === PROJECT_COUNT - 1 && i1 === 0) {
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

        const ratio = Math.max(
          0,
          Math.min(1, (timelineYearRef.current - TIMELINE_START_YEAR) / TIMELINE_SPAN),
        );
        const dotPx = Math.round(ratio * timelineW * 10) / 10;
        if (dotPx !== prevDotPx) {
          prevDotPx = dotPx;
          dot.style.transform = `translate3d(${dotPx}px, 0, 0)`;
        }
      }

      // 8. Continue rAF only while motion, tilt, hover lift, or timeline is active; sleep at 0% CPU when settled!
      const isMoving =
        dragRef.current.active ||
        Math.abs(T - s) > 0.0005 ||
        Math.abs(velRef.current) > 0.003 ||
        Math.abs(targetTiltX - tiltRef.current.x) > 0.02 ||
        Math.abs(targetTiltY - tiltRef.current.y) > 0.02 ||
        anyLiftMoving ||
        Math.abs(targetYear - timelineYearRef.current) > 0.001;

      if (isMoving) {
        rafId = window.requestAnimationFrame(render);
      } else {
        sRef.current = T;
        velRef.current = 0;
        tiltRef.current.x = targetTiltX;
        tiltRef.current.y = targetTiltY;
      }
    };

    const wake = () => {
      if (rafId) return;
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(render);
    };

    wakeRef.current = wake;
    wake();

    return () => {
      wakeRef.current = () => { };
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [applyMetricsToDOM, inView, reducedMotion]);

  const syncLocalPointer = useCallback((clientX: number, clientY: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    pointerRef.current.x = clientX - rect.left;
    pointerRef.current.y = clientY - rect.top;
    pointerRef.current.inside = true;
    wakeRef.current();
  }, []);

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
    wakeRef.current();
  };

  const handleShelfPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    syncLocalPointer(e.clientX, e.clientY);

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
      wakeRef.current();
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
    wakeRef.current();
  };

  const handleItemClick = (v: number, projectIndex: number) => {
    if (performance.now() < dragRef.current.suppressClickUntil) return;
    const r = relIndex(v, sRef.current);
    if (Math.abs(r) < 0.45) {
      // Active center vinyl clicked -> eject LP disc & drop into Section 03 turntable!
      TRef.current = Math.round(TRef.current);
      wakeRef.current();
      const rect = frontRefs.current[v]?.getBoundingClientRect();
      const sourceRect: VinylSourceRect | undefined = rect
        ? {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        }
        : undefined;
      onOpenProject(projectIndex, sourceRect);
    } else {
      // Side vinyl clicked -> glide smoothly to center (triggering 1-step directional back spin!)
      navDirRef.current = r > 0 ? 1 : -1;
      TRef.current = Math.round(sRef.current + r);
      wakeRef.current();
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const track = timelineTrackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetYear = TIMELINE_START_YEAR + ratio * TIMELINE_SPAN;

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

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-label="Curved 3D Vinyl LP Project Showcase"
      className={styles.section}
      onPointerMove={(e) => {
        syncLocalPointer(e.clientX, e.clientY);
      }}
      onPointerEnter={(e) => {
        syncLocalPointer(e.clientX, e.clientY);
      }}
      onPointerLeave={() => {
        pointerRef.current.inside = false;
        hoveredVirtualRef.current = -1;
        wakeRef.current();
      }}
    >
      {/* Hidden Height Probe */}
      <div ref={probeRef} className={styles.probe} aria-hidden="true" />

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
                  wakeRef.current();
                }}
                onPointerLeave={() => {
                  if (hoveredVirtualRef.current === v) {
                    hoveredVirtualRef.current = -1;
                    wakeRef.current();
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

      {/* Previous / Next Cobalt Arrows */}
      <button
        type="button"
        aria-label="Previous project"
        className={`${styles.arrowBtn} ${styles.arrowPrev}`}
        onClick={() => stepBy(-1)}
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

      {/* Bottom Interactive Timeline Ruler (2024 - 2027) */}
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
            className={`${styles.yearLabel} ${idx === 0
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
          aria-label="Jump along 2024 to 2027 project timeline"
          className={styles.timelineHit}
          onClick={handleTimelineClick}
        />
      </div>
    </section>
  );
}
