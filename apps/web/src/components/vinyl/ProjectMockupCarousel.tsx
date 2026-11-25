'use client';

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ProjectItem } from '@/data/projects';
import { useInViewport } from '@/hooks/useInViewport';

interface ProjectMockupCarouselProps {
  project: ProjectItem;
}

const MAX_SLIDES = 3;
const AUTO_SLIDE_MS = 3000;
const MANUAL_SLIDE_TRANSITION = 'transform 620ms cubic-bezier(0.22, 1, 0.36, 1)';
const AUTO_SLIDE_TRANSITION = 'transform 1050ms cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Centered compact panoramic borderless mockup showcase carousel (max 3 slides per project).
 * - Automatically advances right-to-left every 3 seconds with a gentler glide & seamless cloned-tail wrap
 * - Smooth GPU translate3d transitions + 1:1 hold & drag left/right with rubberband edge resistance
 * - Centered small dot -> cute horizontal cobalt oval slide indicators
 */
export function ProjectMockupCarousel({ project }: ProjectMockupCarouselProps) {
  const slides = project.mockups.slice(0, MAX_SLIDES);
  const slideCount = slides.length;
  // Append a clone of slide 0 so looping from the last slide back to 0 glides seamlessly right-to-left
  const renderSlides = slideCount > 1 ? [...slides, slides[0]] : slides;

  const [activeSlide, setActiveSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [interactNonce, setInteractNonce] = useState(0);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const inView = useInViewport(viewportRef, '100px 0px');

  const activeSlideRef = useRef(0);
  activeSlideRef.current = activeSlide;
  const pendingWrapTimerRef = useRef<number | null>(null);

  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    velocityX: 0,
    viewportWidth: 1,
    currentDx: 0,
  });

  const clearPendingWrap = useCallback(() => {
    if (pendingWrapTimerRef.current !== null) {
      window.clearTimeout(pendingWrapTimerRef.current);
      pendingWrapTimerRef.current = null;
    }
  }, []);

  // Reset cleanly to slide 0 whenever the active project switches
  useEffect(() => {
    clearPendingWrap();
    setActiveSlide(0);
    activeSlideRef.current = 0;
    setIsDragging(false);
    dragRef.current.active = false;
    const track = trackRef.current;
    if (track) {
      track.style.transition = 'none';
      track.style.transform = 'translate3d(0%, 0, 0)';
    }
  }, [clearPendingWrap, project.id]);

  useEffect(() => clearPendingWrap, [clearPendingWrap]);

  const snapToSlide = useCallback(
    (nextIndex: number, isAutoStep = false) => {
      clearPendingWrap();
      const track = trackRef.current;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const transitionCss = isAutoStep ? AUTO_SLIDE_TRANSITION : MANUAL_SLIDE_TRANSITION;

      // Seamless right-to-left wrap when advancing past the last slide
      if (isAutoStep && slideCount > 1 && nextIndex >= slideCount) {
        setActiveSlide(0);
        activeSlideRef.current = 0;

        if (track) {
          if (reduced) {
            track.style.transition = 'none';
            track.style.transform = 'translate3d(0%, 0, 0)';
          } else {
            track.style.transition = transitionCss;
            track.style.transform = `translate3d(${-slideCount * 100}%, 0, 0)`;
            pendingWrapTimerRef.current = window.setTimeout(() => {
              pendingWrapTimerRef.current = null;
              if (trackRef.current && !dragRef.current.active) {
                trackRef.current.style.transition = 'none';
                trackRef.current.style.transform = 'translate3d(0%, 0, 0)';
              }
            }, 1080);
          }
        }
        return;
      }

      const clamped = Math.max(0, Math.min(slideCount - 1, nextIndex));
      setActiveSlide(clamped);
      activeSlideRef.current = clamped;

      if (!isAutoStep) {
        setInteractNonce((n) => n + 1);
      }

      if (track) {
        track.style.transition = reduced ? 'none' : transitionCss;
        track.style.transform = `translate3d(${-clamped * 100}%, 0, 0)`;
      }
    },
    [clearPendingWrap, slideCount],
  );

  // Auto-slide every 5 seconds right-to-left (pauses when off-screen, hovered, or dragging)
  useEffect(() => {
    if (slideCount <= 1 || !inView || isDragging || isHovered) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const intervalId = window.setInterval(() => {
      snapToSlide(activeSlideRef.current + 1, true);
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(intervalId);
  }, [slideCount, inView, isDragging, isHovered, interactNonce, snapToSlide]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || slideCount <= 1) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    clearPendingWrap();
    const width = viewport.getBoundingClientRect().width || 1;
    const idx = activeSlideRef.current;

    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocityX: 0,
      viewportWidth: width,
      currentDx: 0,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is unavailable
    }

    // Ensure visual track matches current logical index immediately if grabbed mid-wrap
    track.style.transition = 'none';
    track.style.transform = `translate3d(${-idx * width}px, 0, 0)`;
    setIsDragging(true);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    const track = trackRef.current;
    if (!d.active || d.pointerId !== e.pointerId || !track) return;

    const now = performance.now();
    const dtMs = Math.max(4, now - d.lastTime);
    const stepX = e.clientX - d.lastX;
    d.velocityX = d.velocityX * 0.4 + (stepX / dtMs) * 0.6;
    d.lastX = e.clientX;
    d.lastTime = now;

    const rawDx = e.clientX - d.startX;
    const idx = activeSlideRef.current;

    let dampedDx = rawDx;
    if ((idx === 0 && rawDx > 0) || (idx === slideCount - 1 && rawDx < 0)) {
      dampedDx = rawDx * 0.26;
    }

    d.currentDx = dampedDx;
    const basePx = -idx * d.viewportWidth;
    track.style.transform = `translate3d(${(basePx + dampedDx).toFixed(2)}px, 0, 0)`;
  };

  const finishDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active || d.pointerId !== e.pointerId) return;

    d.active = false;
    d.pointerId = -1;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture was already released
    }

    const idx = activeSlideRef.current;
    const thresholdPx = d.viewportWidth * 0.14;
    const flickVelocity = 0.32;

    let target = idx;
    if (d.currentDx < -thresholdPx || d.velocityX < -flickVelocity) {
      target = Math.min(slideCount - 1, idx + 1);
    } else if (d.currentDx > thresholdPx || d.velocityX > flickVelocity) {
      target = Math.max(0, idx - 1);
    }

    snapToSlide(target);
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      snapToSlide(activeSlideRef.current + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      snapToSlide(activeSlideRef.current - 1);
    }
  };

  if (slideCount === 0) return null;

  return (
    <div
      className="mt-10 md:mt-12 mx-auto w-full max-w-[1380px]"
      aria-label={`${project.title} mockup showcase`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Centered Widescreen Rounded Draggable Mockup Frame */}
      <div
        ref={viewportRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${project.title} visual mockups`}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        className={`relative w-full aspect-[16/9] sm:aspect-[22/8.4] lg:aspect-[25/8.6] rounded-[14px] overflow-hidden bg-[var(--paper)] select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)]/45 ${
          slideCount > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          ref={trackRef}
          className="flex w-full h-full will-change-transform"
        >
          {renderSlides.map((slide, renderIdx) => {
            const logicalIdx = renderIdx % slideCount;
            const isClone = renderIdx >= slideCount;
            return (
              <div
                key={isClone ? `${slide.id}-clone` : slide.id}
                aria-hidden={isClone}
                className="relative w-full h-full shrink-0 overflow-hidden bg-[var(--paper)]"
              >
                {slide.imageSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={slide.imageSrc}
                    alt={`${project.title} — ${slide.label}`}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover pointer-events-none select-none"
                  />
                ) : (
                  /* Clean Borderless Panoramic Mockup Placeholder Slot */
                  <div
                    className="relative w-full h-full flex flex-col justify-between px-6 py-4 sm:px-9 sm:py-6 md:px-11 md:py-7"
                    style={{
                      backgroundImage:
                        'radial-gradient(rgba(10, 10, 10, 0.075) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ backgroundColor: project.edgeColor }}
                          aria-hidden="true"
                        />
                        <span className="lbl text-[var(--ink)]">
                          {project.code} / {project.title.toUpperCase()}
                        </span>
                      </div>
                      <span className="lbl text-[var(--muted)]">
                        0{logicalIdx + 1} / 0{slideCount}
                      </span>
                    </div>

                    <div className="mx-auto max-w-[680px] text-center flex flex-col items-center gap-1.5">
                      <span className="lbl text-[var(--cobalt)]">
                        MOCKUP PLACEHOLDER · SLIDE 0{logicalIdx + 1}
                      </span>
                      <h3 className="text-[clamp(18px,2.2vw,28px)] font-extrabold tracking-[-0.03em] leading-[1.08] text-[var(--ink)]">
                        {slide.label}
                      </h3>
                      <p className="text-[13.5px] md:text-[14.5px] font-medium leading-[1.45] tracking-[-0.01em] text-[var(--muted)] max-w-[50ch]">
                        {slide.caption}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-[var(--muted)]">
                      <span className="lbl">PANORAMIC MOCKUP CANVAS</span>
                      <span className="lbl hidden sm:inline">HOLD &amp; DRAG ↔</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Centered Small Dot -> Cute Horizontal Cobalt Oval Slide Indicators */}
      {slideCount > 1 && (
        <div
          className="mt-4 flex items-center justify-center gap-1"
          role="tablist"
          aria-label="Mockup slide navigation"
        >
          {slides.map((slide, idx) => {
            const isActive = idx === activeSlide;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`View slide ${idx + 1} of ${slideCount}: ${slide.label}`}
                onClick={() => snapToSlide(idx)}
                className="group p-1.5 cursor-pointer bg-transparent border-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--cobalt)]/45 rounded-full"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all duration-[420ms] ${
                    isActive
                      ? 'w-7 bg-[var(--cobalt)]'
                      : 'w-2.5 bg-[var(--ink)]/25 group-hover:bg-[var(--ink)]/50'
                  }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
