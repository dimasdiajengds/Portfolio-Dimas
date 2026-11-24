export const PROJECT_COUNT = 7;
export const COPIES = 5;
export const TOTAL_SLOTS = PROJECT_COUNT * COPIES; // 35 virtual slim LP records
export const HALF_TOTAL = TOTAL_SLOTS / 2; // 17.5
export const PERSPECTIVE = 1400;
export const VINYL_ASPECT = 1.7; // Matches normalized 1360x800 WebP fronts & 680x400 back cells

export interface ArcMetrics {
  H: number;
  ws: number;      // Ultra-slim real LP thickness (~5-8px)
  slot: number;    // Tight pitch per slim angled vinyl on side shelf
  dFull: number;   // Full 3:2/1.70 width of front/back vinyl cutout
  gap: number;
  U: number;       // Depth falloff radius
  P: number;
  XS: Float64Array;
}

export function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/**
 * Maps virtual index v relative to continuous scroll s into [-TOTAL_SLOTS/2, TOTAL_SLOTS/2).
 */
export function relIndex(v: number, s: number): number {
  let r = (((v - s) % TOTAL_SLOTS) + TOTAL_SLOTS) % TOTAL_SLOTS;
  if (r >= HALF_TOTAL) r -= TOTAL_SLOTS;
  return r;
}

/**
 * Smooth bump function B(r): pushes neighboring slim angled vinyls apart smoothly around r = 0.
 */
export function bumpB(r: number): number {
  if (Math.abs(r) < 1) {
    return (r + Math.sin(Math.PI * r) / Math.PI) * 0.5;
  }
  return r >= 0 ? 0.5 : -0.5;
}

export function arcLengthF(r: number, m: ArcMetrics): number {
  return r * (m.slot + m.gap) + (m.dFull - m.slot + 1.4 * m.gap) * bumpB(r);
}

export function screenScale(u: number, U: number): number {
  return 1 / (1 + Math.pow(Math.abs(u) / U, 1.6));
}

/**
 * Precomputes integral of scl(u) from 0 to 3U in 2px steps so far records pack tightly in screen space.
 */
export function buildArcMetrics(H: number, isMobile: boolean): ArcMetrics {
  const ws = Math.max(4, H * 0.022);
  const slot = H * (isMobile ? 0.165 : 0.145);
  const dFull = H * VINYL_ASPECT;
  const gap = H * 0.035;
  const U = H * (isMobile ? 1.15 : 1.48);
  const P = PERSPECTIVE;

  const maxU = Math.ceil(U * 3);
  const steps = Math.ceil(maxU / 2) + 2;
  const XS = new Float64Array(steps);
  let acc = 0;
  for (let i = 1; i < steps; i++) {
    const uMid = (i - 0.5) * 2;
    acc += 2 / (1 + Math.pow(uMid / U, 1.6));
    XS[i] = acc;
  }

  return { H, ws, slot, dFull, gap, U, P, XS };
}

export function lookupXS(u: number, m: ArcMetrics): number {
  const au = Math.abs(u);
  const idx = au * 0.5;
  const i0 = Math.floor(idx);
  const frac = idx - i0;
  const len = m.XS.length;
  const v0 = i0 < len ? m.XS[i0] : m.XS[len - 1];
  const v1 = i0 + 1 < len ? m.XS[i0 + 1] : v0;
  const mag = v0 + (v1 - v0) * frac;
  return u >= 0 ? mag : -mag;
}

export interface VinylFrameState {
  visible: boolean;
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  zIndex: number;
  shade: number;
  o: number;
  nearCenter: boolean;
}

/**
 * Computes exact 3D position, slim bowl arc curvature, and 1-step directional back-face spin.
 *
 * Only the incoming vinyl that is 1 step away from center (0 < |r| < 1 and sign(r) === navDir)
 * performs a full smooth 3D spin through +-180deg (revealing its clean matte back cover .back)
 * before settling flush at +-360deg === 0deg front-facing!
 */
export function computeVinylFrame(
  r: number,
  m: ArcMetrics,
  navDir: 1 | -1,
  lift: number,
  tiltX: number,
  tiltY: number,
  reducedMotion: boolean,
): VinylFrameState {
  const o = smoothstep(Math.max(0, 1 - Math.abs(r)));
  const u = arcLengthF(r, m);

  if (Math.abs(u) > m.U * 1.95) {
    return {
      visible: false,
      x: 0,
      y: 0,
      z: -4000,
      rotX: 0,
      rotY: 0,
      zIndex: 0,
      shade: 0.6,
      o: 0,
      nearCenter: false,
    };
  }

  const sc = screenScale(u, m.U);
  const k = 1 / sc;
  const z = m.P * (1 - k) + o * m.H * 0.1;
  const x = lookupXS(u, m) * k;
  const y = (m.H * 0.5 * (1 - sc) * 0.42 + o * m.H * 0.012 - lift * m.H * 0.05) * k;

  const signU = u === 0 ? 0 : u > 0 ? 1 : -1;
  // Parked slim angled LP orientation on left (+70..+80deg) and right (-70..-80deg)
  const shelfDeg = -signU * (70 + Math.min(1, Math.abs(u) / m.U) * 10);

  let rotY: number;
  const isIncomingOneStep =
    !reducedMotion &&
    Math.abs(r) > 0.0005 &&
    Math.abs(r) < 1 &&
    (r > 0 ? 1 : -1) === navDir;

  if (isIncomingOneStep) {
    if (navDir === 1) {
      // Coming from right (r: 1 -> 0): sweeps -70deg -> -180deg (BACK!) -> -360deg (0deg FRONT)
      rotY = shelfDeg * (1 - o) - 360 * o + tiltY * o;
    } else {
      // Coming from left (r: -1 -> 0): sweeps +70deg -> +180deg (BACK!) -> +360deg (0deg FRONT)
      rotY = shelfDeg * (1 - o) + 360 * o + tiltY * o;
    }
  } else {
    // Outgoing record or settled center record eases cleanly without extra spin
    rotY = shelfDeg * (1 - o) + tiltY * o;
  }

  const rotX = tiltX * o;
  const shade = Math.min(0.58, (1 - sc) * 0.42 * (1 - o));
  const zIndex = Math.round(3000 + z + o * 120);

  return {
    visible: true,
    x,
    y,
    z,
    rotX,
    rotY,
    zIndex,
    shade,
    o,
    nearCenter: Math.abs(r) < 1.35,
  };
}
