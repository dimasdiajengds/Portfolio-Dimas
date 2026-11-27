import { PROFILE } from '@/data/profile';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderHighlightedStatement(text: string, boldWords: readonly string[]) {
  if (boldWords.length === 0) return text;
  const pattern = new RegExp(`\\b(${boldWords.map(escapeRegExp).join('|')})\\b`, 'gi');
  const boldSet = new Set(boldWords.map((w) => w.toLowerCase()));

  return text.split(pattern).map((part, idx) =>
    boldSet.has(part.toLowerCase()) ? (
      <strong key={idx} className="font-extrabold text-[var(--ink)]">
        {part}
      </strong>
    ) : (
      <span key={idx}>{part}</span>
    ),
  );
}

export function AboutSection() {
  const { about } = PROFILE;

  return (
    <section
      id="about"
      aria-label="About and Experience"
      className="relative w-full bg-[var(--paper)]"
    >
      {/* Upper White About Statement & Portrait Row */}
      <div className="px-4 md:px-9 pt-12 md:pt-16 pb-6 md:pb-10">
        <div className="max-w-[1520px] mx-auto">
          {/* Balanced 3-Column Statement & Rounded 3:4 Portrait Row */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-start">
            <div className="flex flex-col items-start gap-12 md:gap-16 lg:gap-20">
              <h2 className="text-[clamp(42px,4.5vw,70px)] font-extrabold leading-[0.98] tracking-[-0.035em] text-[var(--ink)] whitespace-pre-line">
                {about.headline}
              </h2>
              <p className="text-[clamp(22px,2.25vw,32px)] font-medium leading-[1.18] tracking-[-0.02em] text-[var(--ink)]/90">
                {about.subheadline}
              </p>
            </div>

            {/* Center Rounded 3:4 Portrait Photo Placeholder (3 width : 4 height) */}
            <div className="mx-auto w-[230px] sm:w-[260px] lg:w-[270px] xl:w-[300px] aspect-[3/4] rounded-[28px] overflow-hidden bg-[var(--sheet)] shrink-0">
              {about.portraitSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={about.portraitSrc}
                  alt={PROFILE.fullName}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top select-none"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-2 px-4 text-center select-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(rgba(10, 10, 10, 0.07) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[var(--muted)]/75"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8.5" r="3.5" />
                    <path d="M5.5 19.5c1.6-3.1 4-4.5 6.5-4.5s4.9 1.4 6.5 4.5" />
                  </svg>
                  <span className="lbl text-[var(--muted)]">PHOTO PLACEHOLDER · 3:4</span>
                </div>
              )}
            </div>

            <div className="lg:self-center">
              <p className="text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.12] tracking-[-0.025em] text-[var(--ink)]/78">
                {renderHighlightedStatement(about.rightHeadline, about.rightHeadlineBold)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seamless Single-Surface White -> Black Transition into Experience Timeline + Capabilities */}
      <div
        className="relative w-full text-white px-4 md:px-9 pt-[190px] md:pt-[236px] pb-20 md:pb-28"
        style={{
          backgroundColor: '#0A0A0A',
          backgroundImage:
            'linear-gradient(to bottom, #FFFFFF 0px, #FAFAFA 24px, #F0F0F0 48px, #DEDEDE 72px, #C2C2C2 96px, #9D9D9D 120px, #767676 144px, #505050 168px, #313131 190px, #1C1C1C 208px, #101010 222px, #0A0A0A 236px, #0A0A0A 100%)',
        }}
      >
        <div id="experience-timeline" className="max-w-[1520px] mx-auto">
          <ExperienceTimeline experiences={about.experiences} />

          {/* Capabilities & Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-16 md:pt-20">
            <div className="lg:col-span-4">
              <span className="lbl text-white">CAPABILITIES &amp; STACK</span>
              <p className="text-[15.5px] font-medium leading-[1.52] tracking-[-0.01em] text-white/58 mt-3 max-w-[30ch]">
                Focused tooling chosen for clarity, speed, and maintainability.
              </p>
            </div>

            <div className="lg:col-span-8 lg:pl-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
              {about.capabilities.map((group) => (
                <div key={group.category} className="border-t border-white/25 pt-5">
                  <h3 className="lbl text-white mb-4">{group.category}</h3>
                  <ul className="space-y-2.5 m-0 p-0 list-none">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-[15.5px] font-semibold tracking-[-0.01em] text-white/82 leading-[1.45]"
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
      </div>
    </section>
  );
}
