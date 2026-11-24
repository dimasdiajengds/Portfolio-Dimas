'use client';

import { useState } from 'react';
import { PROJECTS, VINYL_BACKS_SHEET } from '@/data/projects';
import { InkRevealPoster } from '@/components/vinyl/InkRevealPoster';

interface ProjectDetailSectionProps {
  activeIndex: number;
  revealNonce: number;
  onSelectIndex: (index: number) => void;
}

export function ProjectDetailSection({
  activeIndex,
  revealNonce,
  onSelectIndex,
}: ProjectDetailSectionProps) {
  const [showBackPreview, setShowBackPreview] = useState(false);

  const project = PROJECTS[activeIndex] ?? PROJECTS[0];
  const prevIdx = (activeIndex + PROJECTS.length - 1) % PROJECTS.length;
  const nextIdx = (activeIndex + 1) % PROJECTS.length;
  const [col, row] = project.backCell;

  const revealKey = `${project.id}-${revealNonce}`;

  return (
    <section
      id="project-detail"
      aria-label={`Project Details: ${project.title}`}
      className="relative w-full min-h-[100svh] bg-[var(--sheet)] border-t border-[var(--hairline)] px-4 md:px-9 py-20 md:py-28"
    >
      <div className="max-w-[1520px] mx-auto">
        {/* Top Utility & Project Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--hairline)]">
          <div className="flex items-center gap-4">
            <span className="lbl text-[var(--cobalt)]">03 — PROJECT DETAIL</span>
            <span className="w-6 h-px bg-[var(--cobalt)]/45" />
            <span className="lbl text-[var(--muted)]">
              {project.code} / 0{PROJECTS.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setShowBackPreview(false);
                onSelectIndex(prevIdx);
              }}
              className="box-btn lbl text-[var(--ink)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors h-8 px-3 bg-transparent cursor-pointer"
            >
              ← {PROJECTS[prevIdx].title.split(' ')[0]}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowBackPreview(false);
                onSelectIndex(nextIdx);
              }}
              className="box-btn lbl text-[var(--ink)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors h-8 px-3 bg-transparent cursor-pointer"
            >
              {PROJECTS[nextIdx].title.split(' ')[0]} →
            </button>
            <a
              href="#projects"
              className="inline-flex items-center h-8 px-3 border border-[var(--cobalt)] text-[var(--cobalt)] lbl hover:bg-[var(--cobalt)] hover:text-[var(--paper)] transition-colors"
            >
              ↑ BACK TO SHELF
            </a>
          </div>
        </div>

        {/* Two-Column Editorial Case Study Grid (matches Detail Sheet spec) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-12 md:pt-16 items-start">
          {/* Right Column comes FIRST on phones (order-1 lg:order-2) */}
          <div className="order-1 lg:order-2 lg:col-span-6 lg:sticky lg:top-28">
            <div className="relative flex flex-col items-center justify-center py-6 md:py-10 border border-[var(--hairline)] bg-[var(--paper)]/55 px-4 sm:px-8">
              <div className="w-full flex items-center justify-between mb-6">
                <span className="lbl text-[var(--muted)]">
                  {showBackPreview ? 'VINYL BACK EDITION (B-SIDE)' : 'VINYL EDITION (A-SIDE)'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowBackPreview((v) => !v)}
                  className="lbl text-[var(--cobalt)] border border-[var(--cobalt)]/50 px-3 py-1.5 hover:bg-[var(--cobalt)] hover:text-[var(--paper)] transition-colors cursor-pointer bg-transparent"
                >
                  {showBackPreview ? 'SHOW FRONT ↺' : 'FLIP BACK ↻'}
                </button>
              </div>

              {showBackPreview ? (
                <div
                  className="w-full max-w-[640px] aspect-[17/10] bg-no-repeat"
                  role="img"
                  aria-label={`${project.title} back vinyl sleeve`}
                  style={{
                    backgroundImage: `url("${VINYL_BACKS_SHEET}")`,
                    backgroundSize: '400% 200%',
                    backgroundPosition: `${(col / 3) * 100}% ${row * 100}%`,
                    filter: 'drop-shadow(0 24px 30px rgba(20, 16, 10, 0.22))',
                  }}
                />
              ) : (
                <div className="w-full max-w-[680px]">
                  <InkRevealPoster
                    imageSrc={project.frontImage}
                    alt={`${project.title} vinyl LP artwork`}
                    revealKey={revealKey}
                  />
                </div>
              )}

              {/* Subtle Palette Swatch & Placeholder Screenshot Slot Notice */}
              <div className="w-full mt-8 pt-4 border-t border-[var(--hairline)] flex flex-wrap items-center justify-between gap-3">
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
                  [PLACEHOLDER: UI SCREENSHOT GALLERY SLOT]
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
              <span
                className="animate-mask-up lbl text-[var(--cobalt)]"
                style={{ animationDelay: '60ms' }}
              >
                {project.subtitle} · {project.code}
              </span>
            </span>

            <span className="mask-line">
              <h2
                className="animate-mask-up font-semibold tracking-[-0.03em] leading-[1.02] text-[var(--cobalt)] text-[clamp(40px,5.2vw,76px)]"
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
                <h3 className="lbl text-[var(--cobalt)] mb-2">CHALLENGE</h3>
                <p className="text-[15px] font-normal leading-[1.55] tracking-[-0.005em] text-[var(--ink)]/85">
                  {project.challenge}
                </p>
              </div>
              <div>
                <h3 className="lbl text-[var(--cobalt)] mb-2">SOLUTION</h3>
                <p className="text-[15px] font-normal leading-[1.55] tracking-[-0.005em] text-[var(--ink)]/85">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="pt-4 border-t border-[var(--hairline)]">
              <h3 className="lbl text-[var(--cobalt)] mb-3">KEY HIGHLIGHTS</h3>
              <ul className="space-y-2.5 m-0 p-0 list-none">
                {project.highlights.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-[15.5px] font-normal leading-[1.5] tracking-[-0.005em] text-[var(--ink)]/90"
                  >
                    <span className="lbl text-[var(--cobalt)] pt-[6px]">0{idx + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Curated Tech Stack (Editorial Hairline List — Anti-AI-Slop) */}
            <div className="pt-4 border-t border-[var(--hairline)]">
              <h3 className="lbl text-[var(--cobalt)] mb-3">TECH STACK</h3>
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

            {/* Author Credit */}
            <p className="text-[14px] font-normal tracking-[-0.005em] text-[var(--muted)] pt-2">
              Designed &amp; developed by Dimas Di Ajeng Duwi Saputra.
            </p>

            {/* Primary Cobalt-Bordered Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={project.demoUrl}
                className="inline-flex items-center justify-center gap-2.5 h-[44px] px-6 border border-[var(--cobalt)] bg-[var(--cobalt)] text-[var(--paper)] lbl hover:bg-[var(--ink)] hover:border-[var(--ink)] transition-colors duration-300"
              >
                <span>VIEW PROJECT</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={project.repoUrl}
                className="inline-flex items-center justify-center gap-2.5 h-[44px] px-6 border border-[var(--cobalt)] text-[var(--cobalt)] lbl hover:bg-[var(--cobalt)] hover:text-[var(--paper)] transition-colors duration-300"
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
