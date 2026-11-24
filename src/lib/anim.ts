import {Easing, interpolate, spring} from 'remotion';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);

/** 0→1 suave entre `at` e `at+dur`. */
export const ease = (frame: number, at: number, dur = 18) =>
  interpolate(frame, [at, at + dur], [0, 1], {...CLAMP, easing: OUT});

/** 0→1 com aceleração e desaceleração (para deslocamentos). */
export const move = (frame: number, at: number, dur = 24) =>
  interpolate(frame, [at, at + dur], [0, 1], {...CLAMP, easing: INOUT});

/** 1→0 entre `at` e `at+dur`. */
export const fadeOut = (frame: number, at: number, dur = 12) =>
  interpolate(frame, [at, at + dur], [1, 0], CLAMP);

/** Mola com leve “pop”. */
export const pop = (frame: number, fps: number, at: number, damping = 13) =>
  spring({frame: frame - at, fps, config: {damping, stiffness: 150, mass: 0.7}});

/** Visível entre [from, to): opacidade com fade de entrada e saída. */
export const vis = (frame: number, from: number, to: number, fin = 12, fout = 12) =>
  Math.min(ease(frame, from, fin), to === Infinity ? 1 : fadeOut(frame, to - fout, fout));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Formato brasileiro: 18500 → "18.500"; com sinal: "+18.500" / "−1.800". */
export const fmt = (n: number, sign = false) => {
  const r = Math.round(n);
  const abs = Math.abs(r)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (r < 0) return `−${abs}`;
  if (sign && r > 0) return `+${abs}`;
  return abs;
};
