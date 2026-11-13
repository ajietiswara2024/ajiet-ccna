import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, MONO} from '../config/theme';
import {CLAMP, EASE, TRANSITION_EASE} from './uiEase';

/**
 * Header scene ala editorial: label mono kecil (eyebrow) + judul tebal pendek.
 * Prop `index`/`label`/`color` dipertahankan agar kompatibel.
 */
export const SceneTag: React.FC<{index: number; label: string; delay?: number; color?: string; eyebrow?: string; title?: string}> = ({
  label,
  delay = 6,
  eyebrow,
  title,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s1 = spring({frame: frame - delay, fps, config: {damping: 200}});
  const s2 = spring({frame: frame - delay - 4, fps, config: {damping: 200}});
  return (
    <div style={{position: 'absolute', top: 140, left: 64, right: 64, fontFamily: FONT}}>
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#6E6A63',
          opacity: s1,
          transform: `translateY(${(1 - s1) * 10}px)`,
        }}
      >
        {eyebrow ?? label}
      </div>
      <div
        style={{
          marginTop: 10,
          fontWeight: 800,
          fontSize: 44,
          letterSpacing: '-0.02em',
          color: C.ink,
          opacity: s2,
          transform: `translateY(${(1 - s2) * 14}px)`,
        }}
      >
        {title ?? label}
      </div>
    </div>
  );
};

/** Kartu info putih ala katalog: border tipis + label mono */
export const InfoCard: React.FC<{t: number; eyebrow?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({t, eyebrow, children, style}) => (
  <div
    style={{
      position: 'absolute',
      padding: '20px 26px 22px',
      borderRadius: 18,
      background: '#FFFEFB',
      border: '2px solid rgba(34,37,43,0.82)',
      boxShadow: '0 10px 28px rgba(60,50,30,0.10)',
      fontFamily: FONT,
      color: C.ink,
      opacity: Math.min(1, t),
      transform: `translateY(${(1 - Math.min(1, t)) * 18}px) scale(${0.95 + 0.05 * Math.min(1, t)})`,
      ...style,
    }}
  >
    {eyebrow ? (
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 18, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7A766E', marginBottom: 12}}>
        {eyebrow}
      </div>
    ) : null}
    {children}
  </div>
);

/** Checklist bernomor: item yang belum aktif tampil pudar */
export const Checklist: React.FC<{items: React.ReactNode[]; active: number[]}> = ({items, active}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
    {items.map((it, i) => {
      const a = Math.min(1, Math.max(0, active[i] ?? 0));
      return (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, fontWeight: 700, opacity: 0.32 + 0.68 * a}}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              border: '2px solid #22252B',
              background: a > 0.5 ? C.yellow : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div>{it}</div>
        </div>
      );
    })}
  </div>
);

/** Pill kecil (harga/status) */
export const Pill: React.FC<{children: React.ReactNode; color?: 'yellow' | 'green' | 'orange' | 'white'; style?: React.CSSProperties}> = ({children, color = 'yellow', style}) => {
  const map = {
    yellow: {bg: C.yellow, fg: C.ink, bd: 'rgba(34,37,43,0.85)'},
    green: {bg: '#DDF3E4', fg: '#1F6B3C', bd: '#58B07A'},
    orange: {bg: '#FFE3D2', fg: C.orangeDeep, bd: C.orange},
    white: {bg: '#FFFEFB', fg: C.ink, bd: 'rgba(34,37,43,0.85)'},
  }[color];
  return (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: map.bg, color: map.fg, border: `2px solid ${map.bd}`, fontWeight: 800, fontSize: 26, fontFamily: FONT, ...style}}>
      {children}
    </span>
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
}> = ({children, t, style, color = C.ink, bg = '#FFFEFB'}) => (
  <div
    style={{
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 24px',
      borderRadius: 18,
      background: bg,
      color,
      border: '2px solid rgba(34,37,43,0.82)',
      boxShadow: '0 10px 28px rgba(60,50,30,0.10)',
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 30,
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
