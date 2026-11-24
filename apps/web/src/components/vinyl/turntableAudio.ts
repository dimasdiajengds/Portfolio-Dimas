'use client';

/**
 * Lightweight Web Audio vinyl scratch synthesizer + per-project music track controller.
 *
 * - Synthesizes realistic forward/backward vinyl scratch & needle-groove friction SFX
 *   with zero external audio assets required.
 * - Manages an HTMLAudioElement per project (`audioSrc`) when music assets are provided:
 *   holds/pauses music while the user drags the vinyl, scrubs `currentTime` forward/backward,
 *   and resumes smoothly on release.
 */
export class TurntableAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  private chirpOsc: OscillatorNode | null = null;
  private chirpFilter: BiquadFilterNode | null = null;
  private chirpGain: GainNode | null = null;
  private masterScratchGain: GainNode | null = null;

  private audioEl: HTMLAudioElement | null = null;
  private currentSrc: string | null = null;
  private volume = 0.72;
  private wantsPlay = false;
  private isScratching = false;
  private scratchFadeTimer: number | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private ensureScratchGraph(): boolean {
    const ctx = this.ensureContext();
    if (!ctx) return false;
    if (this.masterScratchGain) return true;

    // 1. Create a 2-second warm vinyl groove noise buffer (pink/brown weighted + subtle crackle)
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.997 * b0 + white * 0.029;
      b1 = 0.985 * b1 + white * 0.032;
      b2 = 0.95 * b2 + white * 0.048;
      // Add subtle groove dust ticks mixed with textured wax noise
      const tick = Math.random() > 0.9992 ? (Math.random() * 2 - 1) * 0.55 : 0;
      data[i] = Math.max(-1, Math.min(1, (b0 + b1 + b2 + white * 0.14) * 1.45 + tick));
    }

    const master = ctx.createGain();
    master.gain.value = this.volume;
    master.connect(ctx.destination);
    this.masterScratchGain = master;

    // 2. Bandpass-filtered vinyl groove friction noise layer
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buffer;
    noiseSrc.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 950;
    noiseFilter.Q.value = 2.8;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0;

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noiseSrc.start();

    this.noiseSource = noiseSrc;
    this.noiseFilter = noiseFilter;
    this.noiseGain = noiseGain;

    // 3. Pitched record-groove "chirp / slip" resonant layer (distinguishes forward vs backward sweep)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 180;

    const chirpFilter = ctx.createBiquadFilter();
    chirpFilter.type = 'bandpass';
    chirpFilter.frequency.value = 720;
    chirpFilter.Q.value = 5.2;

    const chirpGain = ctx.createGain();
    chirpGain.gain.value = 0;

    osc.connect(chirpFilter);
    chirpFilter.connect(chirpGain);
    chirpGain.connect(master);
    osc.start();

    this.chirpOsc = osc;
    this.chirpFilter = chirpFilter;
    this.chirpGain = chirpGain;

    return true;
  }

  /** Attach or switch the active project's music track URL (safe when undefined/empty) */
  public setTrack(src?: string): void {
    const normalized = src?.trim() || null;
    if (normalized === this.currentSrc) return;
    this.currentSrc = normalized;

    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.removeAttribute('src');
      this.audioEl.load();
    }

    if (!normalized || typeof Audio === 'undefined') {
      return;
    }

    if (!this.audioEl) {
      this.audioEl = new Audio();
      this.audioEl.loop = true;
      this.audioEl.preload = 'metadata';
    }

    this.audioEl.src = normalized;
    this.audioEl.volume = this.volume;

    if (this.wantsPlay && !this.isScratching) {
      void this.audioEl.play().catch(() => {});
    }
  }

  /** Master volume (0..1) controlling both music playback and vinyl scratch SFX */
  public setVolume(nextVolume: number): void {
    const clamped = Math.max(0, Math.min(1, nextVolume));
    this.volume = clamped;

    if (this.audioEl) {
      this.audioEl.volume = clamped;
    }
    if (this.masterScratchGain && this.ctx) {
      this.masterScratchGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.02);
    }
  }

  /** Sync desired music playback state (Play vs Stop) */
  public setPlaying(playing: boolean): void {
    this.wantsPlay = playing;
    if (!this.audioEl || !this.currentSrc) return;

    if (playing && !this.isScratching) {
      this.audioEl.volume = this.volume;
      void this.audioEl.play().catch(() => {});
    } else {
      this.audioEl.pause();
    }
  }

  /** Called when the user grabs the vinyl disc: holds music temporarily & primes scratch synth */
  public beginScratch(): void {
    this.isScratching = true;
    this.ensureScratchGraph();
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause();
    }
  }

  /**
   * Called continuously while dragging the vinyl forward (+deg) or backward (-deg).
   * - `deltaDeg`: signed degrees moved since last pointer sample
   * - `velocityDegPerSec`: signed angular velocity (+ clockwise/forward, - counter-clockwise/backward)
   */
  public updateScratch(deltaDeg: number, velocityDegPerSec: number): void {
    if (!this.isScratching) return;

    // Scrub actual track timeline gently forward/backward if an audio track is loaded
    if (this.audioEl && this.currentSrc && Number.isFinite(this.audioEl.duration) && this.audioEl.duration > 0) {
      const scrubSec = deltaDeg * 0.015;
      const nextTime = Math.max(
        0,
        Math.min(this.audioEl.duration - 0.05, this.audioEl.currentTime + scrubSec),
      );
      this.audioEl.currentTime = nextTime;
    }

    if (!this.ensureScratchGraph() || !this.ctx || !this.noiseFilter || !this.noiseGain || !this.chirpOsc || !this.chirpFilter || !this.chirpGain) {
      return;
    }

    const now = this.ctx.currentTime;
    const speed = Math.abs(velocityDegPerSec);
    const normSpeed = Math.min(1, speed / 540);
    const isReverse = velocityDegPerSec < 0;

    if (speed < 12) {
      // Hand resting still on the vinyl -> hold silence cleanly
      this.noiseGain.gain.setTargetAtTime(0, now, 0.025);
      this.chirpGain.gain.setTargetAtTime(0, now, 0.025);
      return;
    }

    // Forward scratch sounds brighter/rising; backward scratch sounds deeper/swept-down
    const noiseFreq = isReverse
      ? 420 + normSpeed * 1350
      : 680 + normSpeed * 1950;
    const chirpPitch = isReverse
      ? 95 + normSpeed * 320
      : 145 + normSpeed * 460;
    const chirpFilterFreq = isReverse
      ? 520 + normSpeed * 1100
      : 820 + normSpeed * 1650;

    this.noiseFilter.frequency.setTargetAtTime(noiseFreq, now, 0.015);
    this.noiseFilter.Q.setTargetAtTime(2.4 + normSpeed * 3.2, now, 0.02);
    this.noiseGain.gain.setTargetAtTime(0.06 + normSpeed * 0.24, now, 0.012);

    this.chirpOsc.frequency.setTargetAtTime(chirpPitch, now, 0.014);
    this.chirpFilter.frequency.setTargetAtTime(chirpFilterFreq, now, 0.015);
    this.chirpGain.gain.setTargetAtTime(0.03 + normSpeed * 0.14, now, 0.012);

    // Auto-silence scratch SFX quickly if pointer stops emitting move events while held still
    if (this.scratchFadeTimer !== null) {
      window.clearTimeout(this.scratchFadeTimer);
    }
    this.scratchFadeTimer = window.setTimeout(() => {
      if (this.ctx && this.noiseGain && this.chirpGain) {
        const t = this.ctx.currentTime;
        this.noiseGain.gain.setTargetAtTime(0, t, 0.028);
        this.chirpGain.gain.setTargetAtTime(0, t, 0.028);
      }
    }, 55);
  }

  /** Called when the user releases the vinyl disc: stops scratch SFX & resumes music if playing */
  public endScratch(): void {
    this.isScratching = false;
    if (this.scratchFadeTimer !== null) {
      window.clearTimeout(this.scratchFadeTimer);
      this.scratchFadeTimer = null;
    }

    if (this.ctx && this.noiseGain && this.chirpGain) {
      const now = this.ctx.currentTime;
      this.noiseGain.gain.setTargetAtTime(0, now, 0.025);
      this.chirpGain.gain.setTargetAtTime(0, now, 0.025);
    }

    if (this.wantsPlay && this.audioEl && this.currentSrc) {
      this.audioEl.volume = this.volume;
      void this.audioEl.play().catch(() => {});
    }
  }

  /** Clean up all audio nodes & media element on unmount */
  public dispose(): void {
    if (this.scratchFadeTimer !== null) {
      window.clearTimeout(this.scratchFadeTimer);
      this.scratchFadeTimer = null;
    }
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.removeAttribute('src');
      this.audioEl.load();
      this.audioEl = null;
    }
    try {
      this.noiseSource?.stop();
      this.chirpOsc?.stop();
    } catch {
      // Ignore if already stopped
    }
    this.noiseSource = null;
    this.chirpOsc = null;
    this.noiseFilter = null;
    this.noiseGain = null;
    this.chirpFilter = null;
    this.chirpGain = null;
    this.masterScratchGain = null;
    if (this.ctx) {
      void this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
