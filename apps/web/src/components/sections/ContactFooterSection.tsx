'use client';

import { useState } from 'react';
import { PROFILE } from '@/data/profile';

export function ContactFooterSection() {
  const [copied, setCopied] = useState(false);
  const { contact } = PROFILE;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <footer
      id="contact"
      aria-label="Contact and Footer"
      className="relative w-full bg-[#0A0A0A] text-white px-4 md:px-9 pt-20 md:pt-28 pb-10"
    >
      <div className="max-w-[1520px] mx-auto">
        <div className="pb-6 flex items-center justify-between">
          <span className="lbl text-white/90">{contact.sectionLabel}</span>
          <span className="lbl text-white/50">{PROFILE.availability.toUpperCase()}</span>
        </div>

        {/* High-Whitespace Contact Stage */}
        <div className="py-16 md:py-24 max-w-[980px]">
          <h2 className="text-[clamp(36px,5.6vw,76px)] font-extrabold leading-[1.03] tracking-[-0.035em] text-white">
            {contact.headline}
          </h2>

          <p className="text-[17.5px] md:text-[18.5px] font-medium leading-[1.56] tracking-[-0.015em] text-white/75 mt-6 max-w-[52ch]">
            {contact.subtext}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group relative overflow-hidden inline-flex items-center gap-4 h-12 px-7 border border-white bg-white text-[#0A0A0A] hover:bg-[var(--cobalt)] hover:border-[var(--cobalt)] hover:text-white transition-colors duration-300 cursor-pointer"
            >
              <span className="text-[15.5px] font-semibold tracking-[-0.015em]">
                {copied ? 'COPIED TO CLIPBOARD' : contact.email}
              </span>
              <span className="lbl opacity-85">{copied ? '✓' : 'COPY'}</span>
            </button>

            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 h-12 px-6 border border-white/28 text-white lbl hover:border-white hover:bg-white/10 transition-colors duration-300"
            >
              <span>OPEN MAIL APP</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Bottom Minimalist Footer Bar */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="lbl text-white/80">
            © 2026 {PROFILE.fullName.toUpperCase()}. ALL RIGHTS RESERVED.
          </span>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 lbl text-white/80">
              {contact.socials.map((soc, idx) => (
                <span key={soc.label} className="inline-flex items-center gap-2">
                  <a
                    href={soc.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={soc.name}
                    className="hover:text-white transition-colors"
                  >
                    {soc.label}
                  </a>
                  {idx < contact.socials.length - 1 && (
                    <span className="opacity-45" aria-hidden="true">
                      /
                    </span>
                  )}
                </span>
              ))}
            </div>

            <a
              href="#hero"
              className="lbl text-white/55 hover:text-white transition-colors"
            >
              BACK TO TOP ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
