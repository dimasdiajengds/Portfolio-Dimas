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
}: ProjectDetailSectionProps) {
  const project = PROJECTS[activeIndex] ?? PROJECTS[0];
  const revealKey = `${project.id}-${revealNonce}`;

  // Group tech stack into rows of max 5 items (items 6+ flow neatly onto the row below)
  const techRows: string[][] = [];
  for (let i = 0; i < project.techStack.length; i += 5) {
    techRows.push(project.techStack.slice(i, i + 5));
  }

  return (
    <section
      id="project-detail"
      aria-label={`Project Details: ${project.title}`}
      className="relative w-full min-h-[100svh] scroll-mt-[52px] bg-[var(--sheet)] px-4 md:px-9 pt-10 md:pt-12 pb-16 md:pb-24"
    >
      <div className="max-w-[1520px] mx-auto">
        {/* Top Row: Project Narrative (Left) & Fixed Turntable (Right) — top-aligned flush */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
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

            {/* Challenge & Solution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <h3 className="lbl text-[var(--ink)] mb-2">CHALLENGE</h3>
                <p className="text-[15.5px] font-medium leading-[1.52] tracking-[-0.01em] text-[var(--ink)]/82">
                  {project.challenge}
                </p>
              </div>
              <div>
                <h3 className="lbl text-[var(--ink)] mb-2">SOLUTION</h3>
                <p className="text-[15.5px] font-medium leading-[1.52] tracking-[-0.01em] text-[var(--ink)]/82">
                  {project.solution}
                </p>
              </div>
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

        {/* Centered Compact Panoramic Rounded Mockup Slide directly beneath Details & Turntable */}
        <ProjectMockupCarousel project={project} />
      </div>
    </section>
  );
}
