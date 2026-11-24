'use client';

import { useEffect, useState } from 'react';
import { PROJECTS, VINYL_BACKS_SHEET } from '@/data/projects';
import { VinylTurntable } from '@/components/vinyl/VinylTurntable';

type DetailVisualMode = 'turntable' | 'front' | 'back';

interface ProjectDetailSectionProps {
  activeIndex: number;
  revealNonce: number;
  incomingFlight?: boolean;
  landNonce?: number;
  landAngleDeg?: number;
  onSelectIndex?: (index: number) => void;
}

export function ProjectDetailSection({
  activeIndex,
  revealNonce,
  incomingFlight = false,
  landNonce = 0,
  landAngleDeg = 0,
}: ProjectDetailSectionProps) {
  const [viewMode, setViewMode] = useState<DetailVisualMode>('turntable');

  // Whenever a vinyl is clicked/ejected from Section 02, always ensure Turntable view is active to receive it
  useEffect(() => {
    if (incomingFlight || revealNonce > 0) {
      setViewMode('turntable');
    }
  }, [incomingFlight, revealNonce]);

  const project = PROJECTS[activeIndex] ?? PROJECTS[0];
  const [col, row] = project.backCell;

  const revealKey = `${project.id}-${revealNonce}`;

  const modeLabel =
    viewMode === 'turntable'
      ? 'NOW SPINNING · TURNTABLE'
      : viewMode === 'front'
        ? 'VINYL EDITION (A-SIDE)'
        : 'VINYL BACK EDITION (B-SIDE)';

  return (
    <section
      id="project-detail"
      aria-label={`Project Details: ${project.title}`}
      className="relative w-full min-h-[100svh] bg-[var(--sheet)] border-t border-[var(--hairline)] px-4 md:px-9 py-20 md:py-28"
    >
      <div className="max-w-[1520px] mx-auto">
        {/* Two-Column Editorial Case Study Grid (matches Detail Sheet spec) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Right Column comes FIRST on phones (order-1 lg:order-2) */}
          <div className="order-1 lg:order-2 lg:col-span-6 lg:sticky lg:top-28">
            <div className="relative flex flex-col items-center justify-center py-6 md:py-9 border border-[var(--hairline)] bg-[var(--paper)] px-4 sm:px-8">
              <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="lbl text-[var(--muted)]">{modeLabel}</span>
                <div className="inline-flex items-center border border-[var(--ink)]/25">
                  {(
                    [
                      ['turntable', 'TURNTABLE'],
                      ['front', 'FRONT'],
                      ['back', 'BACK'],
                    ] as const
                  ).map(([mode, label]) => {
                    const active = viewMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setViewMode(mode)}
                        className={`lbl px-2.5 py-1.5 transition-colors cursor-pointer ${
                          active
                            ? 'bg-[var(--ink)] text-[var(--paper)]'
                            : 'bg-transparent text-[var(--ink)] hover:bg-[var(--ink)]/8'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {viewMode === 'turntable' ? (
                <div className="w-full flex justify-center py-1">
                  <VinylTurntable
                    project={project}
                    incomingFlight={incomingFlight}
                    landNonce={landNonce}
                    startAngleDeg={landAngleDeg}
                  />
                </div>
              ) : viewMode === 'front' ? (
                <div className="w-full max-w-[640px] flex items-center justify-center py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.frontImage}
                    alt={`${project.title} front vinyl sleeve`}
                    className="w-full h-auto max-h-[52vh] object-contain select-none"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div
                  className="w-full max-w-[640px] aspect-[17/10] bg-no-repeat my-3"
                  role="img"
                  aria-label={`${project.title} back vinyl sleeve`}
                  style={{
                    backgroundImage: `url("${VINYL_BACKS_SHEET}")`,
                    backgroundSize: '400% 200%',
                    backgroundPosition: `${(col / 3) * 100}% ${row * 100}%`,
                  }}
                />
              )}

              {/* Subtle Palette Swatch & Placeholder Screenshot Slot Notice */}
              <div className="w-full mt-7 pt-4 border-t border-[var(--hairline)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-block w-3.5 h-3.5 border border-[var(--rule)]/30"
                    style={{ backgroundColor: project.edgeColor }}
                    aria-hidden="true"
                  />
                  <span className="lbl text-[var(--muted)]">
                    SLEEVE BASE: {project.edgeColor}
                  </span>
                </div>
                <span className="lbl text-[var(--muted)]">
                  {viewMode === 'turntable'
                    ? 'CLICK DISC OR ARM TO PLAY / PAUSE'
                    : '[PLACEHOLDER: UI SCREENSHOT GALLERY SLOT]'}
                </span>
              </div>
            </div>
          </div>

          {/* Left Column: Masked Editorial Narrative & Technical Breakdown */}
          <div
            key={revealKey}
            className="order-2 lg:order-1 lg:col-span-6 flex flex-col gap-6 max-w-[580px]"
          >
            <span className="mask-line">
              <h2
                className="animate-mask-up font-bold tracking-[-0.03em] leading-[1.02] text-[var(--ink)] text-[clamp(40px,5.2vw,76px)]"
                style={{ animationDelay: '130ms' }}
              >
                {project.title}
              </h2>
            </span>

            <span className="mask-line">
              <p
                className="animate-mask-up lbl text-[var(--muted)]"
                style={{ animationDelay: '200ms' }}
              >
                {project.year} / {project.theme.toUpperCase()} / {project.role.toUpperCase()}
              </p>
            </span>

            <span className="mask-line">
              <p
                className="animate-mask-up text-[17px] md:text-[18px] font-normal leading-[1.6] tracking-[-0.01em] text-[var(--ink)] max-w-[48ch]"
                style={{ animationDelay: '270ms' }}
              >
                {project.synopsis}
              </p>
            </span>

            {/* Challenge & Solution Hairline Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[var(--hairline)]">
              <div>
                <h3 className="lbl text-[var(--ink)] mb-2">CHALLENGE</h3>
                <p className="text-[15px] font-normal leading-[1.55] tracking-[-0.005em] text-[var(--ink)]/80">
                  {project.challenge}
                </p>
              </div>
              <div>
                <h3 className="lbl text-[var(--ink)] mb-2">SOLUTION</h3>
                <p className="text-[15px] font-normal leading-[1.55] tracking-[-0.005em] text-[var(--ink)]/80">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="pt-4 border-t border-[var(--hairline)]">
              <h3 className="lbl text-[var(--ink)] mb-3">KEY HIGHLIGHTS</h3>
              <ul className="space-y-2.5 m-0 p-0 list-none">
                {project.highlights.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-[15.5px] font-normal leading-[1.5] tracking-[-0.005em] text-[var(--ink)]/88"
                  >
                    <span className="lbl text-[var(--cobalt)] pt-[6px]">0{idx + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Curated Tech Stack */}
            <div className="pt-4 border-t border-[var(--hairline)]">
              <h3 className="lbl text-[var(--ink)] mb-3">TECH STACK</h3>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {project.techStack.map((tech, idx) => (
                  <span key={tech} className="inline-flex items-center gap-5">
                    <span className="text-[13px] font-medium tracking-[0.02em] text-[var(--ink)]">
                      {tech}
                    </span>
                    {idx < project.techStack.length - 1 && (
                      <span className="text-[var(--muted)]/50" aria-hidden="true">
                        /
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Black-White Action Buttons (Cobalt on hover) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={project.demoUrl}
                className="inline-flex items-center justify-center gap-2.5 h-[44px] px-6 border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] lbl hover:bg-[var(--cobalt)] hover:border-[var(--cobalt)] transition-colors duration-300"
              >
                <span>VIEW PROJECT</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={project.repoUrl}
                className="inline-flex items-center justify-center gap-2.5 h-[44px] px-6 border border-[var(--ink)] text-[var(--ink)] lbl hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors duration-300"
              >
                <span>SOURCE / CASE NOTES</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
