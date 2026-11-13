import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, MONO} from '../config/theme';
import {CLAMP, EASE, TRANSITION_EASE} from './uiEase';

/** Tag scene konsisten di kiri atas: nomor + judul */
export const SceneTag: React.FC<{index: number; label: string; delay?: number; color?: string}> = ({
  index,
  label,
  delay = 6,
  color = C.blue,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 200}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 150,
        left: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '12px 28px 12px 12px',
        borderRadius: 999,
        background: 'rgba(255, 253, 249, 0.92)',
        boxShadow: '0 10px 30px rgba(60, 45, 20, 0.12)',
        opacity: s,
        transform: `translateX(${(1 - s) * -40}px)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          background: color,
          color: '#fff',
          fontWeight: 800,
          fontSize: 26,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {String(index).padStart(2, '0')}
      </div>
      <div style={{fontWeight: 700, fontSize: 32, color: C.ink, letterSpacing: '-0.01em'}}>{label}</div>
    </div>
  );
};

/** Progress bar tipis di atas */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const fade = interpolate(frame, [durationInFrames - 70, durationInFrames - 50], [1, 0], CLAMP);
  return (
    <div style={{position: 'absolute', top: 92, left: 64, right: 64, height: 8, borderRadius: 4, background: 'rgba(34,37,43,0.08)', opacity: fade}}>
      <div style={{width: `${(frame / (durationInFrames - 1)) * 100}%`, height: '100%', borderRadius: 4, background: C.blue}} />
    </div>
  );
};

/** Transisi masuk scene: fade + sedikit zoom + blur (konsisten di semua scene) */
export const SceneFrame: React.FC<{children: React.ReactNode; fadeIn: boolean; duration: number}> = ({children, fadeIn, duration}) => {
  const frame = useCurrentFrame();
  const t = fadeIn ? interpolate(frame, [0, duration], [0, 1], {...CLAMP, easing: TRANSITION_EASE}) : 1;
  return (
    <AbsoluteFill
      style={{
        opacity: t,
        transform: `scale(${1.05 - 0.05 * t})`,
        filter: t < 1 ? `blur(${(1 - t) * 14}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Chip informasi */
export const Chip: React.FC<{
  children: React.ReactNode;
  t: number;
  style?: React.CSSProperties;
  color?: string;
  bg?: string;
}> = ({children, t, style, color = C.ink, bg = 'rgba(255,253,249,0.95)'}) => (
  <div
    style={{
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '18px 28px',
      borderRadius: 26,
      background: bg,
      color,
      boxShadow: '0 16px 36px rgba(60,45,20,0.16)',
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 34,
      opacity: Math.min(1, t),
      transform: `translateY(${(1 - Math.min(1, t)) * 24}px) scale(${0.92 + 0.08 * Math.min(1, t)})`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const MonoText: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <span style={{fontFamily: MONO, fontWeight: 700, ...style}}>{children}</span>
);

export {EASE};
