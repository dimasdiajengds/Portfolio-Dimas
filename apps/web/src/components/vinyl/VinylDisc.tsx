'use client';

import { useId } from 'react';
import type { ProjectId, ProjectItem } from '@/data/projects';

interface VinylDiscProps {
  project: ProjectItem;
  className?: string;
}

interface LabelCropConfig {
  /** Horizontal center of the artwork to place at the disc spindle (0..1 of 1360px image width) */
  cx: number;
  /** Vertical center of the artwork to place at the disc spindle (0..1 of 800px image height) */
  cy: number;
  /** Rendered height of the 1360x800 WebP inside the 400x400 SVG viewBox (width = imgH * 1.7) */
  imgH: number;
  /** Clean circular label base behind the cropped WebP */
  bg: string;
  /** Optional left-edge trim (0..1 of image width) to exclude jacket edge where sleeve overlaps label */
  clipLeftPct?: number;
}

const IMAGE_ASPECT = 1.7; // All public/assets/vinyl/*.webp front cutouts are normalized 1360x800

const DISC_LABEL_CROPS: Record<ProjectId, LabelCropConfig> = {
  // Real circular white center labels directly from the peeking vinyl in each WebP
  javaskripsi: { cx: 0.667, cy: 0.498, imgH: 468, bg: '#FFFFFF' },
  grace: { cx: 0.668, cy: 0.495, imgH: 455, bg: '#FFFFFF' },
  psychobot: { cx: 0.695, cy: 0.497, imgH: 448, bg: '#FFFFFF' },
  loghub: { cx: 0.633, cy: 0.5, imgH: 470, bg: '#FFFFFF', clipLeftPct: 0.592 },
  esc: { cx: 0.618, cy: 0.498, imgH: 475, bg: '#FFFFFF', clipLeftPct: 0.581 },
  // For Sebatik & Skynet (whose peeking label is partially behind the sleeve), crop the central iconic motif from the cover
  sebatik: { cx: 0.286, cy: 0.488, imgH: 255, bg: '#1D140B' },
  skynet: { cx: 0.288, cy: 0.488, imgH: 236, bg: '#0A1622' },
};

/**
 * Lightweight 12-inch vinyl LP record that reuses each project's real WebP artwork for its center label.
 * Rotates purely on the GPU compositor thread (transform: rotate) at 0% CPU cost.
 */
export function VinylDisc({ project, className = '' }: VinylDiscProps) {
  const uid = useId().replace(/:/g, '');
  const bodyGradId = `vinyl-body-${uid}`;
  const labelClipId = `vinyl-label-clip-${uid}`;
  const cropClipId = `vinyl-crop-clip-${uid}`;

  const crop = DISC_LABEL_CROPS[project.id] ?? {
    cx: 0.66,
    cy: 0.5,
    imgH: 460,
    bg: '#FFFFFF',
  };

  const imgH = crop.imgH;
  const imgW = imgH * IMAGE_ASPECT;
  const imgX = 200 - crop.cx * imgW;
  const imgY = 200 - crop.cy * imgH;
  const clipRectX =
    crop.clipLeftPct !== undefined ? imgX + crop.clipLeftPct * imgW : 120;

  return (
    <svg
      viewBox="0 0 400 400"
      className={`block w-full h-full select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Deep glossy-black pressed vinyl body matching the project WebP vinyl texture */}
        <radialGradient id={bodyGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1D1C1B" />
          <stop offset="38%" stopColor="#121111" />
          <stop offset="70%" stopColor="#0A0A0A" />
          <stop offset="94%" stopColor="#151414" />
          <stop offset="100%" stopColor="#070707" />
        </radialGradient>

        {/* Circular 12" LP center label clip */}
        <clipPath id={labelClipId}>
          <circle cx="200" cy="200" r="71" />
        </clipPath>

        {/* Optional sleeve-edge guard clip so jacket edge never bleeds onto white labels */}
        <clipPath id={cropClipId}>
          <rect x={clipRectX} y="120" width="200" height="160" />
        </clipPath>
      </defs>

      {/* Outer LP disc & bevel lip */}
      <circle cx="200" cy="200" r="198" fill={`url(#${bodyGradId})`} />
      <circle cx="200" cy="200" r="197" fill="none" stroke="rgba(255,250,240,0.14)" strokeWidth="1.2" />
      <circle cx="200" cy="200" r="192" fill="none" stroke="rgba(255,250,240,0.06)" strokeWidth="0.7" />

      {/* Realistic concentric audio track bands & micro-grooves */}
      <g fill="none" stroke="rgba(255,250,242,0.075)">
        <circle cx="200" cy="200" r="185" strokeWidth="0.65" />
        <circle cx="200" cy="200" r="179" strokeWidth="0.45" />
        <circle cx="200" cy="200" r="173" strokeWidth="0.55" />
        <circle cx="200" cy="200" r="166" strokeWidth="0.45" />
        <circle cx="200" cy="200" r="160" strokeWidth="0.65" />
        {/* Track break gap */}
        <circle cx="200" cy="200" r="151" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="145" strokeWidth="0.45" />
        <circle cx="200" cy="200" r="139" strokeWidth="0.6" />
        <circle cx="200" cy="200" r="133" strokeWidth="0.45" />
        <circle cx="200" cy="200" r="127" strokeWidth="0.55" />
        {/* Track break gap */}
        <circle cx="200" cy="200" r="118" strokeWidth="0.5" />
        <circle cx="200" cy="200" r="112" strokeWidth="0.45" />
        <circle cx="200" cy="200" r="106" strokeWidth="0.55" />
        <circle cx="200" cy="200" r="100" strokeWidth="0.45" />
        {/* Inner run-out groove */}
        <circle cx="200" cy="200" r="88" strokeWidth="0.8" stroke="rgba(255,250,242,0.12)" />
      </g>

      {/* Subtle groove light streaks for smooth rotational read */}
      <path
        d="M 200 18 A 182 182 0 0 1 258 27"
        fill="none"
        stroke="rgba(255,250,242,0.11)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 200 382 A 182 182 0 0 1 142 373"
        fill="none"
        stroke="rgba(255,250,242,0.11)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Real Project Vinyl Center Label (cropped cleanly from project's preloaded WebP) */}
      <circle cx="200" cy="200" r="71.5" fill={crop.bg} />
      <g clipPath={`url(#${labelClipId})`}>
        <g clipPath={crop.clipLeftPct !== undefined ? `url(#${cropClipId})` : undefined}>
          <image
            href={project.frontImage}
            x={imgX}
            y={imgY}
            width={imgW}
            height={imgH}
            preserveAspectRatio="none"
          />
        </g>
      </g>

      {/* Crisp label perimeter bezel & center spindle hole */}
      <circle cx="200" cy="200" r="71" fill="none" stroke="rgba(10,10,10,0.22)" strokeWidth="1.1" />
      <circle cx="200" cy="200" r="7.5" fill="#141312" />
      <circle cx="200" cy="200" r="3.2" fill="#D9C7A3" />
    </svg>
  );
}
