'use client';

import { type RefObject, useEffect, useRef } from 'react';

export type HeroFormationId =
  | 'engineering'
  | 'headline'
  | 'primary-cta'
  | 'secondary-cta';

export interface HeroTargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HeroPointerState {
  x: number;
  y: number;
  active: boolean;
}

export interface HeroParticleFieldProps {
  active: boolean;
  activeTarget: HeroFormationId | null;
  getTargetRect: (id: HeroFormationId) => HeroTargetRect | null;
  pointerRef: RefObject<HeroPointerState>;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  homeX: number;
  homeY: number;
  homeZ: number;
  baseSize: number;
  alphaBase: number;
  phase: number;
  driftSpeed: number;
  driftAmpX: number;
  driftAmpY: number;
  driftAmpZ: number;
  layer: 0 | 1; // 0 = full-field ambient, 1 = wide 3D antigravity halo
  haloAngle: number;
  haloRing: number;
  morphEligible: boolean;
  morphSlot: number; // 0..1 continuous slot along formation perimeter
  morphBand: number; // -1..1 subtle radial thickness
  morphSubLayer: 0 | 1; // 0 = inner contour, 1 = outer tilted 3D orbit
  stagger: number; // 0..0.14s subtle organic delay so hover transitions feel silky, not jerky
  formBlend: number; // 0 = idle global 3D, 1 = locked local 3D orbit
  darkR: number;
  darkG: number;
  darkB: number;
  lightR: number;
  lightG: number;
  lightB: number;
}

const FOCAL_LENGTH = 680;
const GOLDEN_RATIO = 0.61803398875;

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Deterministic pseudo-random generator for clean, jitter-free layouts */
function createSeededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Convert HSL (h: 0..360, s: 0..1, l: 0..1) to RGB [0..255] */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) {
    r = c;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = c;
  } else if (hue < 180) {
    g = c;
    b = x;
  } else if (hue < 240) {
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function getParticleCount(width: number): number {
  if (width >= 1200) return 960;
  if (width >= 768) return 640;
  return 360;
}

function buildParticles(width: number, height: number): Particle[] {
  const count = getParticleCount(width);
  const rand = createSeededRandom(20261124);
  const halfW = width * 0.5;
  const halfH = height * 0.5;

  // Stratify morph-eligible slots evenly around 0..1 so formations have smooth full-spectrum coverage
  const morphIndices: number[] = [];
  for (let i = 0; i < count; i++) {
    // ~64% of particles participate in hover morph formations; ~36% remain ambient across hero & gradient
    if (i % 11 !== 0 && i % 11 !== 4 && i % 11 !== 8 && i % 11 !== 10) {
      morphIndices.push(i);
    }
  }
  const morphSlotMap = new Map<number, number>();
  for (let k = 0; k < morphIndices.length; k++) {
    morphSlotMap.set(morphIndices[k], k / Math.max(1, morphIndices.length));
  }

  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const isHalo = i % 3 === 0; // ~33% form a spacious, delicate 3D outer ring in idle

    let homeX: number;
    let homeY: number;
    let homeZ: number;
    let haloAngle = t * Math.PI * 2;
    let haloRing = 0;

    if (isHalo) {
      // Wide, subtle 3D antigravity halo framing the hero stage
      haloAngle = ((i * GOLDEN_RATIO) % 1) * Math.PI * 2;
      haloRing = (rand() - 0.5) * 2; // -1..1 thickness band
      const rx = Math.min(halfW * 0.86, 560) + haloRing * 72;
      const ry = Math.min(halfH * 0.66, 290) + haloRing * 48;
      homeX = Math.cos(haloAngle) * rx;
      homeY = Math.sin(haloAngle) * ry - halfH * 0.04;
      homeZ = Math.sin(haloAngle * 1.5 + 0.6) * 170 + (rand() - 0.5) * 70;
    } else {
      // Quasi-random golden-ratio distribution spanning the entire hero height
      // including all the way down into the black -> white gradient band
      const gx = ((i * GOLDEN_RATIO + rand() * 0.04) % 1) - 0.5;
      const gy = (t + (rand() - 0.5) * 0.06) - 0.5;
      homeX = gx * width * 0.96;
      homeY = clamp(gy * height * 0.96, -halfH + 14, halfH - 12);
      homeZ = (rand() - 0.5) * 440;
    }

    const morphSlot = morphSlotMap.get(i);
    const morphEligible = morphSlot !== undefined;

    // Continuous full-spectrum hue so both idle 3D cosmos and hover orbits look prism-harmonious
    const baseHue = morphEligible
      ? (morphSlot * 360 + (rand() - 0.5) * 14 + 210) % 360
      : ((((homeX / Math.max(1, width)) + 0.5) * 280 + ((homeY / Math.max(1, height)) + 0.5) * 90 + rand() * 24) % 360);

    // Dual-calibrated full spectrum: luminous on #0A0A0A, jewel-crisp over the light bottom gradient
    const [darkR, darkG, darkB] = hslToRgb(baseHue, 0.9, 0.63);
    const [lightR, lightG, lightB] = hslToRgb(baseHue, 0.88, 0.45);

    particles.push({
      x: homeX,
      y: homeY,
      z: homeZ,
      vx: 0,
      vy: 0,
      vz: 0,
      homeX,
      homeY,
      homeZ,
      // Slightly larger delicate particles — clearly legible yet still fine & airy
      baseSize: 1.15 + rand() * 1.05,
      alphaBase: 0.34 + rand() * 0.36,
      phase: rand() * Math.PI * 2,
      driftSpeed: 0.2 + rand() * 0.3,
      driftAmpX: 10 + rand() * 16,
      driftAmpY: 8 + rand() * 14,
      driftAmpZ: 16 + rand() * 30,
      layer: isHalo ? 1 : 0,
      haloAngle,
      haloRing,
      morphEligible,
      morphSlot: morphSlot ?? 0,
      morphBand: (rand() - 0.5) * 2,
      morphSubLayer: i % 5 === 0 || i % 5 === 2 ? 1 : 0,
      stagger: rand() * 0.14,
      formBlend: 0,
      darkR,
      darkG,
      darkB,
      lightR,
      lightG,
      lightB,
    });
  }

  return particles;
}

/**
 * Compute superellipse contour point (smooth rounded capsule/pill) around a DOM rect.
 * Exponent ~0.68..0.75 hugs rectangular text/buttons smoothly without wide corner gaps.
 */
function superellipsePoint(
  theta: number,
  rx: number,
  ry: number,
  exp: number,
): [number, number] {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const x = Math.sign(c) * Math.pow(Math.abs(c), exp) * rx;
  const y = Math.sign(s) * Math.pow(Math.abs(s), exp) * ry;
  return [x, y];
}

export function HeroParticleField({
  active,
  activeTarget,
  getTargetRect,
  pointerRef,
}: HeroParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeTargetRef = useRef<HeroFormationId | null>(activeTarget);
  const getTargetRectRef = useRef(getTargetRect);
  const measuredRectRef = useRef<HeroTargetRect | null>(null);
  const activeRef = useRef(active);
  const loopControlRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  useEffect(() => {
    activeTargetRef.current = activeTarget;
    measuredRectRef.current = activeTarget ? getTargetRectRef.current(activeTarget) : null;
  }, [activeTarget]);

  useEffect(() => {
    getTargetRectRef.current = getTargetRect;
  }, [getTargetRect]);

  useEffect(() => {
    activeRef.current = active;
    if (active) {
      loopControlRef.current?.start();
    } else {
      loopControlRef.current?.stop();
    }
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];

    // Smoothly damped 3D camera parallax tilt, cursor lag, & continuous formation anchor
    let camRotX = 0;
    let camRotY = 0;
    let smoothMx = 0;
    let smoothMy = 0;
    let hadPointerPrev = false;
    let heldAnchorX = 0;
    let heldAnchorY = 0;
    let hadLocalAnchorPrev = false;
    let prevModeKey = 'idle';
    let transitionAge = 10;
    let lastTime = performance.now();
    let elapsed = 0;
    let lastRectSync = 0;
    let rafId = 0;
    let pageVisible = document.visibilityState !== 'hidden';

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const nextW = Math.max(1, Math.round(rect.width));
      const nextH = Math.max(1, Math.round(rect.height));
      if (nextW === width && nextH === height && particles.length > 0) return;

      width = nextW;
      height = nextH;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = buildParticles(width, height);

      if (activeTargetRef.current) {
        measuredRectRef.current = getTargetRectRef.current(activeTargetRef.current);
      }

      if (reducedMotion) {
        renderFrame(0, true);
      }
    };

    const renderFrame = (dtSec: number, staticOnly = false) => {
      if (width <= 0 || height <= 0) return;

      const halfW = width * 0.5;
      const halfH = height * 0.5;
      const ptr = pointerRef.current;
      const pointerActive = Boolean(ptr && ptr.active);
      const targetId = activeTargetRef.current;
      const targetRect = measuredRectRef.current;
      const hasFormation = Boolean(targetId && targetRect && targetRect.width > 4 && targetRect.height > 4);

      // Track mode transitions (free-roam <-> hover target) so enter/leave glides smoothly without jolting
      const modeKey = hasFormation && targetId ? `target:${targetId}` : 'free';
      if (modeKey !== prevModeKey) {
        prevModeKey = modeKey;
        transitionAge = 0;
      } else {
        transitionAge += dtSec;
      }

      const rawMx = pointerActive && ptr ? ptr.x - halfW : 0;
      const rawMy = pointerActive && ptr ? ptr.y - halfH : 0;

      // Smooth virtual cursor for gentle free-roam sway (no clumping)
      if (pointerActive) {
        if (!hadPointerPrev) {
          smoothMx = rawMx;
          smoothMy = rawMy;
        } else {
          const ptrEase = 1 - Math.exp(-dtSec * 5.2);
          smoothMx += (rawMx - smoothMx) * ptrEase;
          smoothMy += (rawMy - smoothMy) * ptrEase;
        }
      } else {
        const ptrReturn = 1 - Math.exp(-dtSec * 2.5);
        smoothMx += (0 - smoothMx) * ptrReturn;
        smoothMy += (0 - smoothMy) * ptrReturn;
      }
      hadPointerPrev = pointerActive;

      // Formation center in centered canvas coordinates
      const tcx = hasFormation && targetRect
        ? targetRect.x + targetRect.width * 0.5 - halfW
        : 0;
      const tcy = hasFormation && targetRect
        ? targetRect.y + targetRect.height * 0.5 - halfH
        : 0;
      const tHalfW = hasFormation && targetRect ? targetRect.width * 0.5 : 0;
      const tHalfH = hasFormation && targetRect ? targetRect.height * 0.5 : 0;

      // Hold the last hovered target anchor smoothly while particles glide back to free-roam
      if (hasFormation) {
        if (!hadLocalAnchorPrev) {
          heldAnchorX = tcx;
          heldAnchorY = tcy;
        } else {
          const anchorEase = 1 - Math.exp(-dtSec * 5.2);
          heldAnchorX += (tcx - heldAnchorX) * anchorEase;
          heldAnchorY += (tcy - heldAnchorY) * anchorEase;
        }
      }
      hadLocalAnchorPrev = hasFormation;

      // Smooth 3D camera parallax sway following free-roam cursor
      const tiltStrength = hasFormation ? 0.04 : 0.13;
      const desiredRotY =
        pointerActive && ptr
          ? ((ptr.x / width) - 0.5) * 2 * tiltStrength
          : Math.sin(elapsed * 0.16) * 0.032;
      const desiredRotX =
        pointerActive && ptr
          ? -((ptr.y / height) - 0.5) * 2 * (tiltStrength * 0.65)
          : Math.cos(elapsed * 0.13) * 0.02;

      const camEase = 1 - Math.exp(-dtSec * 4.2);
      camRotY += (desiredRotY - camRotY) * camEase;
      camRotX += (desiredRotX - camRotX) * camEase;

      // Bottom black-to-white gradient zone height (matches HeroSection smooth 260px fade)
      const gradientBand = 260;
      const gradientStartY = height - gradientBand;

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';

      // Lively yet smooth framerate-independent steering rates (px/sec velocity model)
      const blendRate = 1 - Math.exp(-dtSec * 3.4);
      const velLerpForm = 1 - Math.exp(-dtSec * 6.2);
      const velLerpIdle = 1 - Math.exp(-dtSec * 5.2);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const joinFormation = hasFormation && p.morphEligible && !staticOnly;

        // Smoothly interpolate between global 3D field (0) and local target orbit (1)
        const targetBlend = joinFormation ? 1 : 0;
        p.formBlend += (targetBlend - p.formBlend) * blendRate;

        let tx: number;
        let ty: number;
        let tz: number;

        if (joinFormation && targetId) {
          const baseAngle = p.morphSlot * Math.PI * 2;

          if (targetId === 'engineering') {
            // Smooth 3D double-ring capsule surrounding the word "Engineering"
            if (p.morphSubLayer === 0) {
              const theta = baseAngle + elapsed * 0.36;
              const rx = tHalfW + 24 + p.morphBand * 7;
              const ry = tHalfH + 15 + p.morphBand * 5;
              const [cx, cy] = superellipsePoint(theta, rx, ry, 0.72);
              tx = tcx + cx;
              ty = tcy + cy;
              tz = Math.sin(theta * 2 - elapsed * 0.85) * 44 + p.morphBand * 16;
            } else {
              const theta = -baseAngle - elapsed * 0.26 + 0.5;
              const rx = tHalfW + 52 + p.morphBand * 10;
              const ry = tHalfH + 31 + p.morphBand * 7;
              const ox = Math.cos(theta) * rx;
              const oy = Math.sin(theta) * ry;
              const tilt = 0.22;
              tx = tcx + ox * Math.cos(tilt) - oy * Math.sin(tilt);
              ty = tcy + ox * Math.sin(tilt) + oy * Math.cos(tilt);
              tz = Math.sin(theta + 0.8) * 95 + p.morphBand * 22;
            }
          } else if (targetId === 'headline') {
            // Smooth 3D dual-ribbon wave framing top & bottom of the typing headline
            const spanX = Math.max(tHalfW, Math.min(halfW * 0.68, 280)) + 34;
            const u = p.morphSlot;
            if (p.morphSubLayer === 0) {
              const side = i % 2 === 0 ? -1 : 1;
              const along = ((u * 2) % 1) * 2 - 1;
              const wavePhase = along * Math.PI * 2.4 - elapsed * 0.85 * side;
              tx = tcx + along * spanX;
              ty =
                tcy +
                side * (tHalfH + 18 + Math.sin(wavePhase) * 9 + p.morphBand * 4.5);
              tz = Math.cos(wavePhase) * 72 + p.morphBand * 20;
            } else {
              const theta = baseAngle + elapsed * 0.22;
              const [cx, cy] = superellipsePoint(
                theta,
                spanX + 26 + p.morphBand * 9,
                tHalfH + 34 + p.morphBand * 7,
                0.76,
              );
              tx = tcx + cx;
              ty = tcy + cy;
              tz = Math.sin(theta * 2 + elapsed * 0.58) * 85;
            }
          } else if (targetId === 'primary-cta') {
            // Crisp pill orbit hugging "Explore Projects ↓" + downward shimmer
            if (p.morphSubLayer === 0) {
              const theta = baseAngle + elapsed * 0.52;
              const rx = tHalfW + 14 + p.morphBand * 5;
              const ry = tHalfH + 11 + p.morphBand * 4;
              const [cx, cy] = superellipsePoint(theta, rx, ry, 0.64);
              tx = tcx + cx;
              ty = tcy + cy;
              tz = Math.sin(theta * 2 - elapsed * 1.15) * 38;
            } else {
              const spread = (p.morphSlot - 0.5) * 2;
              const pulse = (elapsed * 0.42 + p.phase) % 1;
              tx = tcx + spread * (tHalfW + 24) * (1 - pulse * 0.32);
              ty = tcy + tHalfH + 18 + pulse * 42 + Math.abs(spread) * -10;
              tz = Math.cos(spread * Math.PI + elapsed * 0.9) * 48;
            }
          } else {
            // 'secondary-cta': Tilted 3D constellation double-orbit around "Get in Touch"
            const dir = p.morphSubLayer === 0 ? 1 : -1;
            const theta = baseAngle + elapsed * 0.4 * dir;
            const rx = tHalfW + (p.morphSubLayer === 0 ? 15 : 32) + p.morphBand * 5;
            const ry = tHalfH + (p.morphSubLayer === 0 ? 11 : 22) + p.morphBand * 4;
            const [cx, cy] = superellipsePoint(theta, rx, ry, 0.66);
            const tilt = p.morphSubLayer === 0 ? 0.08 : -0.24;
            tx = tcx + cx * Math.cos(tilt) - cy * Math.sin(tilt);
            ty = tcy + cx * Math.sin(tilt) + cy * Math.cos(tilt);
            tz = Math.sin(theta * 2 + elapsed * 0.85 * dir) * (p.morphSubLayer === 0 ? 36 : 74);
          }
        } else {
          // Free roam / Idle: full-hero 3D cosmos & spacious outer halo that gently sways
          // with cursor movement without clumping/gathering around the pointer
          const swayX = smoothMx * 0.08;
          const swayY = smoothMy * 0.06;

          if (p.layer === 1) {
            const a = p.haloAngle + elapsed * 0.05;
            const rx = Math.min(halfW * 0.86, 560) + p.haloRing * 72;
            const ry = Math.min(halfH * 0.66, 290) + p.haloRing * 48;
            tx = Math.cos(a) * rx + Math.sin(elapsed * p.driftSpeed + p.phase) * 9 + swayX;
            ty = Math.sin(a) * ry - halfH * 0.04 + Math.cos(elapsed * p.driftSpeed * 0.8 + p.phase) * 7 + swayY;
            tz = Math.sin(a * 1.5 + elapsed * 0.18) * 170 + p.haloRing * 30;
          } else {
            const w1 = elapsed * p.driftSpeed + p.phase;
            tx = p.homeX + Math.sin(w1) * p.driftAmpX + swayX;
            ty = p.homeY + Math.cos(w1 * 0.82) * p.driftAmpY + swayY;
            tz = p.homeZ + Math.sin(w1 * 0.6 + 1.1) * p.driftAmpZ;
          }
        }

        if (!staticOnly) {
          // Lively, zero-jolt velocity steering (px/sec):
          // Smooth ease-in removes harsh snapping while preserving responsive ~0.6–0.85s morph speed.
          const toX = tx - p.x;
          const toY = ty - p.y;
          const toZ = tz - p.z;

          let followRate: number; // 1/sec
          let maxSpeed: number; // px/sec
          let velLerp: number;

          if (joinFormation) {
            const gatherRamp = smoothstep(p.stagger, p.stagger + 0.3, transitionAge);
            followRate = 1.1 + 3.2 * gatherRamp;
            maxSpeed = 240 + 210 * gatherRamp;
            velLerp = velLerpForm;
          } else {
            const releaseRamp = smoothstep(p.stagger, p.stagger + 0.32, transitionAge);
            followRate = 0.9 + 2.6 * releaseRamp;
            maxSpeed = 210 + 170 * releaseRamp;
            velLerp = velLerpIdle;
          }

          let desiredVx = toX * followRate;
          let desiredVy = toY * followRate;
          let desiredVz = toZ * followRate;

          // Weightless cursor sway/parting ripple in free roam (and micro-breath on hovered target)
          if (pointerActive) {
            const dx = p.x - rawMx;
            const dy = p.y - rawMy;
            const distSq = dx * dx + dy * dy;
            const radius = joinFormation ? 90 : 155;
            if (distSq > 0.001 && distSq < radius * radius) {
              const dist = Math.sqrt(distSq);
              const falloff = 1 - dist / radius;
              const push = falloff * falloff * (joinFormation ? 28 : 135);
              const nx = dx / dist;
              const ny = dy / dist;
              desiredVx += (nx * 0.82 - ny * 0.42) * push;
              desiredVy += (ny * 0.82 + nx * 0.42) * push;
              desiredVz -= falloff * (joinFormation ? 16 : 65);
            }
          }

          // Smooth speed ceiling so distant particles glide fluidly without snapping
          const desiredMag = Math.hypot(desiredVx, desiredVy, desiredVz);
          if (desiredMag > maxSpeed) {
            const cap = maxSpeed / desiredMag;
            desiredVx *= cap;
            desiredVy *= cap;
            desiredVz *= cap;
          }

          p.vx += (desiredVx - p.vx) * velLerp;
          p.vy += (desiredVy - p.vy) * velLerp;
          p.vz += (desiredVz - p.vz) * velLerp;

          p.x += p.vx * dtSec;
          p.y += p.vy * dtSec;
          p.z += p.vz * dtSec;
        }

        // Anchor-blended 3D projection:
        // Global camera tilt applies cleanly in idle, and gracefully locks onto the
        // exact hovered DOM element center when in formation so rings stay pixel-accurate.
        const globalWeight = 1 - p.formBlend;
        const rotY = camRotY * globalWeight;
        const rotX = camRotX * globalWeight;
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const anchorX = heldAnchorX * p.formBlend;
        const anchorY = heldAnchorY * p.formBlend;
        const localX = p.x - anchorX;
        const localY = p.y - anchorY;

        const rx1 = localX * cosY - p.z * sinY;
        const rz1 = localX * sinY + p.z * cosY;
        const ry2 = localY * cosX - rz1 * sinX;
        const rz2 = localY * sinX + rz1 * cosX;

        const denom = FOCAL_LENGTH + rz2;
        if (denom <= 80) continue;

        const persp = FOCAL_LENGTH / denom;
        const sx = halfW + anchorX + rx1 * persp;
        const sy = halfH + anchorY + ry2 * persp;

        // Cull offscreen particles cheaply
        if (sx < -24 || sx > width + 24 || sy < -24 || sy > height + 24) continue;

        // Depth-weighted opacity & thin radius
        const depthNorm = clamp((280 - rz2) / 560, 0.12, 1);
        let alpha = p.alphaBase * (0.35 + depthNorm * 0.72);

        // Keep idle center behind hero typography gently hushed so text stays razor-legible
        if (p.formBlend < 0.35) {
          const centerDistX = Math.abs(sx - halfW) / Math.max(260, width * 0.34);
          const centerDistY = Math.abs(sy - halfH * 0.92) / Math.max(130, height * 0.22);
          const centerFactor = clamp(Math.hypot(centerDistX, centerDistY), 0, 1);
          const quietMask = 0.5 + smoothstep(0.25, 1.0, centerFactor) * 0.5;
          alpha *= quietMask + (1 - quietMask) * p.formBlend * 2.5;
        }

        // Crisp clarity boost on active orbiting ring or cursor halo while staying refined
        if (p.formBlend > 0.1) {
          alpha = Math.min(0.88, alpha + p.formBlend * 0.14);
        }

        // Soft top/bottom edge fade (especially right at bottom seam into white VinylShowcaseSection)
        const topFade = smoothstep(0, 28, sy);
        const bottomFade = smoothstep(0, 34, height - sy);
        alpha *= topFade * bottomFade;
        if (alpha <= 0.015) continue;

        // Adapt hue lightness & clarity smoothly across the black -> grey -> white bottom gradient
        const gradMix = smoothstep(gradientStartY + 12, height - 16, sy);
        const r = Math.round(p.darkR + (p.lightR - p.darkR) * gradMix);
        const g = Math.round(p.darkG + (p.lightG - p.darkG) * gradMix);
        const b = Math.round(p.darkB + (p.lightB - p.darkB) * gradMix);
        alpha = Math.min(0.88, alpha * (1 + gradMix * 0.24));

        // Crisp delicate particle dots (velocity is in px/sec; subtle streak only on swift glides)
        const radius = clamp(p.baseSize * persp, 0.9, 2.75);
        const v2x = p.vx * persp;
        const v2y = p.vy * persp;
        const speedPxSec = Math.hypot(v2x, v2y);

        const colorStr = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;

        if (speedPxSec > 180 && !staticOnly) {
          const streakLen = Math.min((speedPxSec - 150) * 0.018, 4.2);
          const inv = streakLen / speedPxSec;
          ctx.strokeStyle = colorStr;
          ctx.lineWidth = Math.max(1.25, radius * 1.5);
          ctx.beginPath();
          ctx.moveTo(sx - v2x * inv, sy - v2y * inv);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          ctx.fillStyle = colorStr;
          ctx.beginPath();
          ctx.arc(sx, sy, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = (now: number) => {
      rafId = 0;
      if (!activeRef.current || !pageVisible || reducedMotion) return;

      const dtSec = clamp((now - lastTime) / 1000, 0.001, 0.04);
      lastTime = now;
      elapsed += dtSec;

      // Keep active hover target bounding rect synced (e.g., while headline text types)
      if (activeTargetRef.current && now - lastRectSync > 160) {
        lastRectSync = now;
        measuredRectRef.current = getTargetRectRef.current(activeTargetRef.current);
      }

      renderFrame(dtSec, false);
      rafId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (reducedMotion || !activeRef.current || !pageVisible || rafId) return;
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const handleVisibility = () => {
      pageVisible = document.visibilityState !== 'hidden';
      if (pageVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    const handleMotionChange = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        stopLoop();
        renderFrame(0, true);
      } else {
        startLoop();
      }
    };

    resize();

    const ro =
      typeof ResizeObserver !== 'undefined' && canvas.parentElement
        ? new ResizeObserver(resize)
        : null;
    if (ro && canvas.parentElement) {
      ro.observe(canvas.parentElement);
    }

    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery.addEventListener('change', handleMotionChange);

    loopControlRef.current = { start: startLoop, stop: stopLoop };

    if (reducedMotion) {
      renderFrame(0, true);
    } else {
      startLoop();
    }

    return () => {
      loopControlRef.current = null;
      stopLoop();
      ro?.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [pointerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full block"
    />
  );
}
