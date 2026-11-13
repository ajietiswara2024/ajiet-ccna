import {Easing, interpolate, spring, SpringConfig} from 'remotion';
import * as THREE from 'three';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Easing halus ala "cinematic" (ease in-out) */
export const EASE = Easing.bezier(0.45, 0, 0.2, 1);
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

/** Progress 0..1 dari frame `start` selama `dur` frame */
export const prog = (frame: number, start: number, dur: number, easing = EASE) =>
  interpolate(frame, [start, start + dur], [0, 1], {...CLAMP, easing});

/** Spring standar */
export const sp = (frame: number, fps: number, delay = 0, config: Partial<SpringConfig> = {damping: 200}) =>
  spring({frame: frame - delay, fps, config});

/** Spring dengan sedikit pantulan (untuk objek muncul) */
export const pop = (frame: number, fps: number, delay = 0) =>
  spring({frame: frame - delay, fps, config: {damping: 13, mass: 0.7, stiffness: 120}});

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export type V3 = [number, number, number];
export const mixV = (a: V3, b: V3, t: number): V3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

/** Interpolasi keyframe vektor: frames [f0,f1,...], values [v0,v1,...] */
export const kf = (frame: number, frames: number[], values: V3[], easing = EASE): V3 =>
  [0, 1, 2].map((i) =>
    interpolate(
      frame,
      frames,
      values.map((v) => v[i]),
      {...CLAMP, easing},
    ),
  ) as V3;

/** Naik lalu turun: 0 -> 1 (fadeIn) ... 1 -> 0 (fadeOut) */
export const window01 = (frame: number, a: number, b: number, c: number, d: number) =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {...CLAMP, easing: EASE});

const tmpA = new THREE.Color();
const tmpB = new THREE.Color();
export const mixColor = (a: string, b: string, t: number) => {
  tmpA.set(a);
  tmpB.set(b);
  return '#' + tmpA.lerp(tmpB, clamp01(t)).getHexString();
};
