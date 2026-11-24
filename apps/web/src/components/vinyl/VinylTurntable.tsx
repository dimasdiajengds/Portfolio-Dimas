'use client';

import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { ProjectItem } from '@/data/projects';
import { useInViewport } from '@/hooks/useInViewport';
import { VinylDisc } from '@/components/vinyl/VinylDisc';
import { TurntableAudioEngine } from '@/components/vinyl/turntableAudio';
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

const SPIN_DEG_PER_SEC = 360 / 5.4; // Smooth 33 1/3 RPM cadence

export function VinylTurntable({
  project,
  incomingFlight,
  landNonce,
  startAngleDeg,
}: VinylTurntableProps) {
  const deckRef = useRef<HTMLDivElement | null>(null);
  const discSpinnerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInViewport(deckRef, '120px 0px');
  const armUid = useId().replace(/:/g, '');

  // Playback, tonearm, scratch, & horizontal volume state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isScratching, setIsScratching] = useState(false);
  const [tonearmEngaged, setTonearmEngaged] = useState(true);
  const [justLanded, setJustLanded] = useState(false);
  const [volume, setVolume] = useState(72); // 0..100

  // Continuous rotation angle ref (shared seamlessly between auto-spin & manual drag scratching)
  const angleRef = useRef<number>(startAngleDeg);
  const audioRef = useRef<TurntableAudioEngine | null>(null);
  const scratchRef = useRef({
    active: false,
    pointerId: -1,
    cx: 0,
    cy: 0,
    lastAngle: 0,
    lastX: 0,
    lastTime: 0,
    smoothedVel: 0,
  });

  // Lazily create and cleanly dispose the Web Audio scratch + music track engine
  useEffect(() => {
    const engine = new TurntableAudioEngine();
    engine.setVolume(0.72);
    audioRef.current = engine;
    return () => {
      engine.dispose();
      audioRef.current = null;
    };
  }, []);

  // Sync per-project audio track URL whenever the active project changes
  useEffect(() => {
    audioRef.current?.setTrack(project.audioSrc);
  }, [project.audioSrc]);

  // Sync volume slider -> audio engine (controls both music & scratch SFX)
  useEffect(() => {
    audioRef.current?.setVolume(volume / 100);
  }, [volume]);

  // Sync active audio playback with Play/Stop, viewport visibility, and incoming flight
  useEffect(() => {
    const shouldAudioPlay = isPlaying && inView && !incomingFlight && !isScratching;
    audioRef.current?.setPlaying(shouldAudioPlay);
  }, [isPlaying, inView, incomingFlight, isScratching]);

  // Latch exact handoff angle when a flying vinyl lands from Section 2
  useEffect(() => {
    angleRef.current = startAngleDeg;
    if (discSpinnerRef.current) {
      discSpinnerRef.current.style.transform = `rotate(${startAngleDeg.toFixed(2)}deg)`;
    }
  }, [landNonce, startAngleDeg]);

  // Sync tonearm & landing settle whenever a disc ejects from Section 2 and drops onto the platter
  useEffect(() => {
    if (incomingFlight) {
      if (scratchRef.current.active) {
        scratchRef.current.active = false;
        scratchRef.current.pointerId = -1;
        setIsScratching(false);
        audioRef.current?.endScratch();
      }
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

  // Ultra-lightweight native-refresh-rate auto-spin loop (sleeps at 0% CPU when stopped, scratching, or off-screen)
  useEffect(() => {
    const shouldAutoSpin = isPlaying && inView && !incomingFlight && !isScratching;
    if (!shouldAutoSpin) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      angleRef.current = (angleRef.current + SPIN_DEG_PER_SEC * dt) % 360;
      if (discSpinnerRef.current) {
        discSpinnerRef.current.style.transform = `rotate(${angleRef.current.toFixed(2)}deg)`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isPlaying, inView, incomingFlight, isScratching]);

  const handleTogglePlay = () => {
    if (incomingFlight) return;
    setIsPlaying((prev) => {
      const next = !prev;
      setTonearmEngaged(next);
      audioRef.current?.setPlaying(next && inView && !isScratching);
      return next;
    });
  };

  // Interactive Click & Drag Forward/Backward Vinyl Scratching
  const handlePlatterPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (incomingFlight || e.button !== 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    const startPtrAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);

    scratchRef.current = {
      active: true,
      pointerId: e.pointerId,
      cx,
      cy,
      lastAngle: startPtrAngle,
      lastX: e.clientX,
      lastTime: performance.now(),
      smoothedVel: 0,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture is unavailable
    }

    setIsScratching(true);
    audioRef.current?.beginScratch();
  };

  const handlePlatterPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = scratchRef.current;
    if (!s.active || s.pointerId !== e.pointerId) return;

    const now = performance.now();
    const dtSec = Math.max(0.008, (now - s.lastTime) / 1000);
    const dxCenter = e.clientX - s.cx;
    const dyCenter = e.clientY - s.cy;
    const distFromCenter = Math.hypot(dxCenter, dyCenter);
    const nextAngle = Math.atan2(dyCenter, dxCenter) * (180 / Math.PI);

    let deltaDeg: number;
    if (distFromCenter < 22) {
      // Near spindle center: fall back to smooth horizontal drag so rotation never spikes erratically
      deltaDeg = (e.clientX - s.lastX) * 0.9;
    } else {
      deltaDeg = nextAngle - s.lastAngle;
      if (deltaDeg > 180) deltaDeg -= 360;
      if (deltaDeg < -180) deltaDeg += 360;
    }

    s.lastAngle = nextAngle;
    s.lastX = e.clientX;
    s.lastTime = now;

    angleRef.current = (angleRef.current + deltaDeg) % 360;
    if (discSpinnerRef.current) {
      discSpinnerRef.current.style.transform = `rotate(${angleRef.current.toFixed(2)}deg)`;
    }

    const rawVel = deltaDeg / dtSec;
    s.smoothedVel = s.smoothedVel * 0.45 + rawVel * 0.55;
    audioRef.current?.updateScratch(deltaDeg, s.smoothedVel);
  };

  const endScratchInteraction = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = scratchRef.current;
    if (!s.active || s.pointerId !== e.pointerId) return;
    s.active = false;
    s.pointerId = -1;
    s.smoothedVel = 0;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture was already released
    }

    setIsScratching(false);
    audioRef.current?.endScratch();
  };

  const isLampOn = isPlaying && inView && !incomingFlight;
  const buttonLabel = incomingFlight ? 'Loading' : isPlaying ? 'Stop' : 'Play';

  return (
    <div
      ref={deckRef}
      className={styles.deck}
      role="region"
      aria-label={`Classic Turntable for ${project.title}`}
    >
      {/* Brushed Champagne-Aluminum Inner Deck Plate */}
      <div className={styles.topPlate}>
        {/* Brass/Steel Plate Corner Screws */}
        <span className={styles.cornerDot} style={{ left: 9, top: 9 }} aria-hidden="true" />
        <span className={styles.cornerDot} style={{ right: 9, top: 9 }} aria-hidden="true" />
        <span className={styles.cornerDot} style={{ left: 9, bottom: 9 }} aria-hidden="true" />
        <span className={styles.cornerDot} style={{ right: 9, bottom: 9 }} aria-hidden="true" />

        {/* Warm Amber Vintage Strobe Pilot Lamp */}
        <span
          className={`${styles.strobeLamp} ${isLampOn ? styles.strobeLampOn : ''}`}
          aria-hidden="true"
        />

        {/* Stepped Machined Aluminum Platter & Interactive Scratchable Vinyl LP */}
        <div className={styles.platterWell}>
          <div className={styles.strobeRing} aria-hidden="true" />

          <div
            id="turntable-platter"
            onPointerDown={handlePlatterPointerDown}
            onPointerMove={handlePlatterPointerMove}
            onPointerUp={endScratchInteraction}
            onPointerCancel={endScratchInteraction}
            title="Drag vinyl forward or backward to scratch"
            className={`${styles.platterTarget} ${isScratching ? styles.platterScratching : ''} ${
              justLanded ? styles.platterLanded : ''
            }`}
          >
            <div
              ref={discSpinnerRef}
              className={`${styles.discSpinner} ${incomingFlight ? styles.discHidden : ''}`}
              style={{ transform: `rotate(${angleRef.current.toFixed(2)}deg)` }}
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
          aria-label={isPlaying ? 'Stop vinyl playback' : 'Play vinyl playback'}
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
              <rect
                x="30"
                y="6"
                width="20"
                height="26"
                rx="2.5"
                fill={`url(#chrome-${armUid})`}
                stroke="#453E35"
                strokeWidth="1"
              />
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
                <rect x="-4.5" y="-5" width="9" height="4" rx="1" fill={`url(#brass-${armUid})`} />
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

        {/* Tactile Aluminum Play / Stop Button (Bottom-Left) */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className={styles.powerBtn}
          aria-pressed={isPlaying}
        >
          <span
            className={`${styles.statusDot} ${isLampOn ? styles.statusDotActive : ''}`}
            aria-hidden="true"
          />
          <span>{buttonLabel}</span>
        </button>

        {/* Horizontal Left <-> Right Volume Slider (Bottom-Right) */}
        <div className={styles.volumeControl}>
          <div className={styles.volumeHeader}>
            <span>VOL</span>
            <span>{volume}%</span>
          </div>
          <div className={styles.volumeTrackWrap}>
            <div className={styles.volumeGroove}>
              <div className={styles.volumeFill} style={{ width: `${volume}%` }} />
            </div>
            <div
              className={styles.volumeThumbVisual}
              style={{ left: `${volume}%` }}
              aria-hidden="true"
            />
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Turntable volume"
              className={styles.volumeRangeInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
