'use client';

import { type CSSProperties, useEffect, useId, useRef, useState } from 'react';
import type { ProjectItem } from '@/data/projects';
import { useInViewport } from '@/hooks/useInViewport';
import { VinylDisc } from '@/components/vinyl/VinylDisc';
import styles from '@/components/vinyl/VinylTurntable.module.css';

interface VinylTurntableProps {
  project: ProjectItem;
  /** True while the flying vinyl disc is in mid-air en route to this platter */
  incomingFlight: boolean;
  /** Increments right when a flying disc lands on the platter to trigger subtle settle & tonearm drop */
  landNonce: number;
  /** Starting angle in degrees passed from the flying disc for a seamless 0-jump handoff */
  startAngleDeg: number;
}

export function VinylTurntable({
  project,
  incomingFlight,
  landNonce,
  startAngleDeg,
}: VinylTurntableProps) {
  const deckRef = useRef<HTMLDivElement | null>(null);
  const inView = useInViewport(deckRef, '120px 0px');
  const armUid = useId().replace(/:/g, '');

  const [isPlaying, setIsPlaying] = useState(true);
  const [tonearmEngaged, setTonearmEngaged] = useState(true);
  const [justLanded, setJustLanded] = useState(false);

  // Sync tonearm & landing settle whenever a disc ejects from Section 2 and drops onto the platter
  useEffect(() => {
    if (incomingFlight) {
      setTonearmEngaged(false);
      setJustLanded(false);
      return;
    }

    setIsPlaying(true);
    if (landNonce > 0) {
      setJustLanded(true);
      const dropArmTimer = window.setTimeout(() => {
        setTonearmEngaged(true);
      }, 90);
      const clearSettleTimer = window.setTimeout(() => {
        setJustLanded(false);
      }, 340);
      return () => {
        window.clearTimeout(dropArmTimer);
        window.clearTimeout(clearSettleTimer);
      };
    }

    setTonearmEngaged(true);
  }, [incomingFlight, landNonce, project.id]);

  const handleTogglePlay = () => {
    if (incomingFlight) return;
    setIsPlaying((prev) => {
      const next = !prev;
      setTonearmEngaged(next);
      return next;
    });
  };

  // GPU spin runs ONLY when visible in viewport, playing, and disc is seated on platter
  const shouldSpin = isPlaying && inView && !incomingFlight;

  const spinnerStyle = {
    '--vinyl-start-angle': `${startAngleDeg.toFixed(1)}deg`,
  } as CSSProperties;

  return (
    <div
      ref={deckRef}
      className={styles.deck}
      role="region"
      aria-label={`Classic Turntable playing ${project.title}`}
    >
      {/* Brushed Champagne-Aluminum Inner Deck Plate */}
      <div className={styles.topPlate}>
        {/* Brass/Steel Plate Corner Screws */}
        <span className={styles.cornerDot} style={{ left: 9, top: 9 }} aria-hidden="true" />
        <span className={styles.cornerDot} style={{ right: 9, top: 9 }} aria-hidden="true" />
        <span className={styles.cornerDot} style={{ left: 9, bottom: 9 }} aria-hidden="true" />
        <span className={styles.cornerDot} style={{ right: 9, bottom: 9 }} aria-hidden="true" />

        {/* Classic Brass-Bordered Hi-Fi Nameplate */}
        <span className={styles.modelTag}>D! HI-FI · MK-76</span>

        {/* Warm Amber Vintage Strobe Lamp */}
        <span
          className={`${styles.strobeLamp} ${shouldSpin ? styles.strobeLampOn : ''}`}
          aria-hidden="true"
        />

        {/* Stepped Machined Aluminum Platter & Spinning Vinyl LP */}
        <div className={styles.platterWell}>
          <div className={styles.strobeRing} aria-hidden="true" />

          <div
            id="turntable-platter"
            onClick={handleTogglePlay}
            title={isPlaying ? 'Click to pause vinyl' : 'Click to spin vinyl'}
            className={`${styles.platterTarget} ${justLanded ? styles.platterLanded : ''}`}
          >
            {/* Keyed by project.id + landNonce so CSS --vinyl-start-angle latches seamlessly on landing */}
            <div
              key={`${project.id}-${landNonce}`}
              style={spinnerStyle}
              className={`${styles.discSpinner} ${shouldSpin ? styles.discSpinning : ''} ${
                incomingFlight ? styles.discHidden : ''
              }`}
            >
              <VinylDisc project={project} />
            </div>

            {/* Static warm room light sheen over the spinning black vinyl */}
            {!incomingFlight && <div className={styles.specularSheen} aria-hidden="true" />}

            {/* Center turned brass/silver spindle pin */}
            <div className={styles.spindlePin} aria-hidden="true" />
          </div>
        </div>

        {/* Classic Arm Rest Cradle */}
        <div className={styles.armRest} aria-hidden="true" />

        {/* Classic Gimbal & S-Shaped Chrome Tonearm */}
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Lift tonearm and pause vinyl' : 'Drop tonearm and spin vinyl'}
          className={styles.tonearmMount}
        >
          <span className={styles.tonearmBaseRing} aria-hidden="true" />
          <span
            className={`${styles.tonearmPivot} ${
              tonearmEngaged && !incomingFlight ? styles.tonearmEngaged : ''
            }`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 80 260" className={styles.armSvg}>
              <defs>
                <linearGradient id={`chrome-${armUid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7C756A" />
                  <stop offset="35%" stopColor="#F5F1E7" />
                  <stop offset="68%" stopColor="#B8AFA0" />
                  <stop offset="100%" stopColor="#5D554B" />
                </linearGradient>
                <linearGradient id={`brass-${armUid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7A5B2E" />
                  <stop offset="45%" stopColor="#E6CB94" />
                  <stop offset="100%" stopColor="#654922" />
                </linearGradient>
              </defs>

              {/* Rear Counterweight Cylinder & Brass Dial Ring */}
              <rect x="30" y="6" width="20" height="26" rx="2.5" fill={`url(#chrome-${armUid})`} stroke="#453E35" strokeWidth="1" />
              <rect x="31" y="25" width="18" height="4" fill={`url(#brass-${armUid})`} />
              <line x1="33" y1="12" x2="47" y2="12" stroke="#453E35" strokeOpacity="0.45" strokeWidth="1" />
              <line x1="33" y1="17" x2="47" y2="17" stroke="#453E35" strokeOpacity="0.45" strokeWidth="1" />

              {/* Classic S-Shaped Chrome Arm Wand (pivot center sits at x=40, y=45) */}
              <path
                d="M 40 32 L 40 120 C 40 156, 51 174, 46 202 C 43 216, 35 224, 29 233"
                fill="none"
                stroke={`url(#chrome-${armUid})`}
                strokeWidth="5.4"
                strokeLinecap="round"
              />
              {/* Crisp highlight filament along S-curve */}
              <path
                d="M 39.2 46 L 39.2 120 C 39.2 155, 50 174, 45.2 201 C 42.3 215, 34.4 223, 28.4 232"
                fill="none"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Gimbal Center Cap */}
              <circle cx="40" cy="45" r="7.5" fill={`url(#chrome-${armUid})`} stroke="#3B342C" strokeWidth="1.2" />
              <circle cx="40" cy="45" r="3" fill={`url(#brass-${armUid})`} />

              {/* Vintage Slotted Black & Brass Headshell + Finger Lift */}
              <g transform="translate(27, 234) rotate(26)">
                <rect x="-7.5" y="-2" width="15" height="24" rx="2" fill="#1C1917" stroke="#5C5246" strokeWidth="1" />
                <line x1="-3" y1="4" x2="-3" y2="15" stroke="#D6C5A3" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="3" y1="4" x2="3" y2="15" stroke="#D6C5A3" strokeWidth="1.2" strokeLinecap="round" />
                {/* Cartridge Brass Collar */}
                <rect x="-4.5" y="-5" width="9" height="4" rx="1" fill={`url(#brass-${armUid})`} />
                {/* Curved Finger Lift Lever */}
                <path
                  d="M 7.5 6 C 14 6, 17 3, 18 -1"
                  fill="none"
                  stroke={`url(#chrome-${armUid})`}
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </span>
        </button>

        {/* Classic Rotary Pitch / Speed Dial */}
        <div className={styles.rotaryDial} aria-hidden="true" />
        <span className={styles.dialLabel} aria-hidden="true">
          PITCH · 33/45
        </span>

        {/* Tactile Aluminum Start / Stop Switch */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className={styles.powerBtn}
          aria-pressed={isPlaying}
        >
          <span
            className={`${styles.statusDot} ${shouldSpin ? styles.statusDotActive : ''}`}
            aria-hidden="true"
          />
          <span>{incomingFlight ? 'LOADING' : isPlaying ? '33 RPM · ON' : 'STOPPED'}</span>
        </button>
      </div>
    </div>
  );
}
