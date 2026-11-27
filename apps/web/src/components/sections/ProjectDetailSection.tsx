'use client';

import { PROJECTS } from '@/data/projects';
import { VinylTurntable } from '@/components/vinyl/VinylTurntable';
import { ProjectMockupCarousel } from '@/components/vinyl/ProjectMockupCarousel';

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
  onSelectIndex,
}: ProjectDetailSectionProps) {
  const project = PROJECTS[activeIndex] ?? PROJECTS[0];
  const revealKey = `${project.id}-${revealNonce}`;
  const totalProjects = PROJECTS.length;

  const handleStepProject = (delta: number) => {
    if (!onSelectIndex || totalProjects <= 1) return;
    const nextIdx = (activeIndex + delta + totalProjects) % totalProjects;
    onSelectIndex(nextIdx);
  };

  // Group tech stack into rows of max 5 items (items 6+ flow neatly onto the row below)
  const techRows: string[][] = [];
  for (let i = 0; i < project.techStack.length; i += 5) {
    techRows.push(project.techStack.slice(i, i + 5));
  }

  return (
    <section
      id="project-detail"
      aria-label={`Project Details: ${project.title}`}
      className="relative w-full min-h-[100svh] scroll-mt-[52px] bg-[var(--paper)] px-4 md:px-9 pt-10 md:pt-12 pb-16 md:pb-20"
    >
      <div className="relative max-w-[1520px] mx-auto">
        {/* Top Row: Project Narrative (Left) & Fixed Turntable (Right) — locked height keeps button & slide 100% static */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:min-h-[548px]">
          {/* Right Column comes FIRST on phones (order-1 lg:order-2) */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex items-start justify-center lg:justify-end">
            <div className="w-full max-w-[580px]">
              <VinylTurntable
                project={project}
                incomingFlight={incomingFlight}
                landNonce={landNonce}
                startAngleDeg={landAngleDeg}
              />
            </div>
          </div>

          {/* Left Column: Masked Editorial Narrative, Challenge/Solution, Tech Stack | Direct Links */}
          <div
            key={revealKey}
            className="order-2 lg:order-1 lg:col-span-6 flex flex-col gap-5 max-w-[650px]"
          >
            <div className="flex flex-col gap-4">
              <span className="mask-line">
                <h2
                  className="animate-mask-up font-extrabold tracking-[-0.035em] leading-[0.94] text-[var(--ink)] text-[clamp(40px,5vw,72px)]"
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
                  className="animate-mask-up text-[17.5px] md:text-[18.5px] font-medium leading-[1.56] tracking-[-0.015em] text-[var(--ink)] max-w-[48ch]"
                  style={{ animationDelay: '270ms' }}
                >
                  {project.synopsis}
                </p>
              </span>
            </div>

            {/* What I Do */}
            <div className="pt-2">
              <h3 className="lbl text-[var(--ink)] mb-2">WHAT I DO</h3>
              <p className="text-[15.5px] font-medium leading-[1.52] tracking-[-0.01em] text-[var(--ink)]/82 max-w-[54ch]">
                {project.whatIDo}
              </p>
            </div>

            {/* Tech Stack (max 5 per row) + Thick Vertical "|" Divider + Bare Direct Links */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-stretch gap-4 sm:gap-5">
              <div className="min-w-0">
                <h3 className="lbl text-[var(--ink)] mb-2">TECH STACK</h3>
                <div className="flex flex-col gap-1.5">
                  {techRows.map((row, rowIdx) => (
                    <div
                      key={rowIdx}
                      className="flex flex-wrap items-center gap-x-2.5 gap-y-1"
                    >
                      {row.map((tech, idx) => (
                        <span key={tech} className="inline-flex items-center gap-2.5">
                          <span className="text-[13.5px] font-semibold tracking-[-0.01em] text-[var(--ink)]/90">
                            {tech}
                          </span>
                          {idx < row.length - 1 && (
                            <span className="text-[var(--muted)]/50 font-semibold" aria-hidden="true">
                              /
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sturdy Vertical "|" Separator */}
              <div
                aria-hidden="true"
                className="hidden sm:block w-[2.5px] shrink-0 self-stretch bg-[var(--ink)]/80 rounded-full my-0.5"
              />

              {/* Bare Direct Links beside Tech Stack */}
              <div className="flex flex-row sm:flex-col justify-center gap-x-6 gap-y-2 shrink-0">
                <a
                  href={project.demoUrl}
                  className="group inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.06em] uppercase text-[var(--ink)] hover:text-[var(--cobalt)] transition-colors duration-200 whitespace-nowrap"
                >
                  <span>VIEW PROJECT</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                </a>
                <a
                  href={project.repoUrl}
                  className="group inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.06em] uppercase text-[var(--muted)] hover:text-[var(--cobalt)] transition-colors duration-200 whitespace-nowrap"
                >
                  <span>SOURCE / CASE NOTES</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Centered Circular Project Switcher (pinned at fixed Y coordinate so text length never shifts it) */}
        <div
          className="relative z-20 mt-6 mb-4 lg:mt-0 lg:mb-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-[496px] flex items-center justify-center gap-2"
          aria-label="Switch vinyl project"
        >
          <button
            type="button"
            onClick={() => handleStepProject(-1)}
            aria-label="Previous vinyl project"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--ink)]/25 bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--cobalt)] hover:border-[var(--cobalt)] hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 3.5L5.5 8L10 12.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleStepProject(1)}
            aria-label="Next vinyl project"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--ink)]/25 bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--cobalt)] hover:border-[var(--cobalt)] hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 3.5L10.5 8L6 12.5" />
            </svg>
          </button>
        </div>

        {/* Centered Compact Panoramic Rounded Mockup Slide directly beneath Details & Turntable */}
        <ProjectMockupCarousel project={project} />
      </div>
    </section>
  );
}
