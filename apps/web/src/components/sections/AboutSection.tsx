import { PROFILE } from '@/data/profile';

export function AboutSection() {
  const { about } = PROFILE;

  return (
    <section
      id="about"
      aria-label="About and Experience"
      className="relative w-full bg-[var(--paper)] border-t border-[var(--hairline)] px-4 md:px-9 py-24 md:py-32"
    >
      <div className="max-w-[1520px] mx-auto">
        <div className="pb-6 border-b border-[var(--hairline)] flex items-center justify-between">
          <span className="lbl text-[var(--ink)]">{about.sectionLabel}</span>
          <span className="lbl text-[var(--muted)]">{PROFILE.fullName.toUpperCase()}</span>
        </div>

        {/* Asymmetric 4:8 Bio Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-14 pb-20 border-b border-[var(--hairline)]">
          <div className="lg:col-span-4">
            <h2 className="text-[clamp(28px,3.2vw,44px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--ink)]">
              {about.headline}
            </h2>
          </div>

          <div className="lg:col-span-8 lg:pl-8 space-y-6">
            {about.paragraphs.map((text, idx) => (
              <p
                key={idx}
                className="text-[18px] md:text-[20px] font-medium leading-[1.55] tracking-[-0.015em] text-[var(--ink)]/88 max-w-[58ch]"
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        {/* Experience Timeline (Hairline Rows) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 py-20 border-b border-[var(--hairline)]">
          <div className="lg:col-span-4">
            <span className="lbl text-[var(--ink)]">EXPERIENCE TIMELINE</span>
            <p className="text-[15.5px] font-medium leading-[1.52] tracking-[-0.01em] text-[var(--muted)] mt-3 max-w-[30ch]">
              Key roles, industry programs, and flagship builds from 2023 to 2026.
            </p>
          </div>

          <div className="lg:col-span-8 lg:pl-8 divide-y divide-[var(--hairline)] border-t border-b border-[var(--hairline)]">
            {about.experiences.map((exp) => (
              <div
                key={`${exp.period}-${exp.role}`}
                className="py-7 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-baseline"
              >
                <div className="sm:col-span-3">
                  <span className="lbl text-[var(--cobalt)]">{exp.period}</span>
                </div>
                <div className="sm:col-span-9">
                  <h3 className="text-[20px] font-bold tracking-[-0.02em] text-[var(--ink)]">
                    {exp.role}
                  </h3>
                  <p className="lbl text-[var(--muted)] mt-1.5">{exp.org}</p>
                  <p className="text-[15.5px] font-medium leading-[1.54] tracking-[-0.01em] text-[var(--ink)]/84 mt-3 max-w-[56ch]">
                    {exp.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities & Stack (Clean 3-Column Hairline List) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-20">
          <div className="lg:col-span-4">
            <span className="lbl text-[var(--ink)]">CAPABILITIES &amp; STACK</span>
            <p className="text-[15.5px] font-medium leading-[1.52] tracking-[-0.01em] text-[var(--muted)] mt-3 max-w-[30ch]">
              Focused tooling chosen for clarity, speed, and maintainability.
            </p>
          </div>

          <div className="lg:col-span-8 lg:pl-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
            {about.capabilities.map((group) => (
              <div key={group.category} className="border-t border-[var(--rule)] pt-5">
                <h3 className="lbl text-[var(--ink)] mb-4">{group.category}</h3>
                <ul className="space-y-2.5 m-0 p-0 list-none">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-[15.5px] font-semibold tracking-[-0.01em] text-[var(--ink)]/86 leading-[1.45]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
