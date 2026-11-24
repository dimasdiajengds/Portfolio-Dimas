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
      className="relative w-full bg-[var(--sheet)] border-t border-[var(--hairline)] px-4 md:px-9 pt-24 md:pt-32 pb-10"
    >
      <div className="max-w-[1520px] mx-auto">
        <div className="pb-6 border-b border-[var(--hairline)] flex items-center justify-between">
          <span className="lbl text-[var(--cobalt)]">{contact.sectionLabel}</span>
          <span className="lbl text-[var(--muted)]">{PROFILE.availability.toUpperCase()}</span>
        </div>

        {/* High-Whitespace Contact Stage */}
        <div className="py-16 md:py-24 max-w-[980px]">
          <h2 className="text-[clamp(36px,5.6vw,76px)] font-semibold leading-[1.03] tracking-[-0.03em] text-[var(--ink)]">
            {contact.headline}
          </h2>

          <p className="font-serif-editorial text-[19px] leading-[1.6] text-[var(--ink)]/80 mt-6 max-w-[52ch]">
            {contact.subtext}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group relative overflow-hidden inline-flex items-center gap-4 h-12 px-7 border border-[var(--cobalt)] bg-[var(--cobalt)] text-[var(--paper)] hover:bg-[var(--ink)] hover:border-[var(--ink)] transition-colors duration-300 cursor-pointer"
            >
              <span className="text-[15px] font-medium tracking-[-0.01em]">
                {copied ? 'COPIED TO CLIPBOARD' : contact.email}
              </span>
              <span className="lbl opacity-80">{copied ? '✓' : 'COPY'}</span>
            </button>

            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 h-12 px-6 border border-[var(--rule)] text-[var(--ink)] lbl hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors duration-300"
            >
              <span>OPEN MAIL APP</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* Bottom Cobalt Editorial Footer Bar */}
        <div className="pt-6 border-t border-[var(--hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="lbl text-[var(--cobalt)]">
            © 2026 {PROFILE.fullName.toUpperCase()}. ALL RIGHTS RESERVED.
          </span>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 lbl text-[var(--cobalt)]">
              {contact.socials.map((soc, idx) => (
                <span key={soc.label} className="inline-flex items-center gap-2">
                  <a
                    href={soc.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={soc.name}
                    className="hover:opacity-65 transition-opacity"
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
              className="lbl text-[var(--ink)]/70 hover:text-[var(--cobalt)] transition-colors"
            >
              BACK TO TOP ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
