'use client';

import { useEffect, useState } from 'react';

interface UseTypewriterOptions {
  phrases: readonly string[];
  active: boolean;
  typeSpeedMs?: number;
  deleteSpeedMs?: number;
  pauseAfterTypeMs?: number;
  pauseAfterDeleteMs?: number;
}

export function useTypewriter({
  phrases,
  active,
  typeSpeedMs = 48,
  deleteSpeedMs = 26,
  pauseAfterTypeMs = 2100,
  pauseAfterDeleteMs = 360,
}: UseTypewriterOptions) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasCompletedFirst, setHasCompletedFirst] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || !active || phrases.length === 0) return;

    const current = phrases[phraseIndex % phrases.length];
    let delay = isDeleting ? deleteSpeedMs : typeSpeedMs;

    if (!isDeleting && charCount === current.length) {
      if (!hasCompletedFirst) {
        setHasCompletedFirst(true);
      }
      delay = pauseAfterTypeMs;
    } else if (isDeleting && charCount === 0) {
      delay = pauseAfterDeleteMs;
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        if (charCount < current.length) {
          setCharCount((c) => c + 1);
        } else {
          setIsDeleting(true);
        }
      } else {
        if (charCount > 0) {
          setCharCount((c) => c - 1);
        } else {
          setIsDeleting(false);
          setPhraseIndex((idx) => (idx + 1) % phrases.length);
        }
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    active,
    charCount,
    deleteSpeedMs,
    hasCompletedFirst,
    isDeleting,
    pauseAfterDeleteMs,
    pauseAfterTypeMs,
    phraseIndex,
    phrases,
    reducedMotion,
    typeSpeedMs,
  ]);

  const currentPhrase = phrases[phraseIndex % phrases.length] ?? '';
  const displayedText = reducedMotion ? phrases[0] ?? '' : currentPhrase.slice(0, charCount);
  const hasTypedOnce = reducedMotion || charCount > 6 || phraseIndex > 0;
  const revealed = reducedMotion || hasCompletedFirst;

  return { displayedText, hasTypedOnce, hasCompletedFirst: revealed, reducedMotion };
}
