import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SUBTITLES} from '../config/subtitles';
import {C, FONT} from '../config/theme';
import {CLAMP, EASE} from '../lib/anim';

type Part = {t: string; hl: boolean};

/** Pecah teks menjadi kata; *kata* = sorot kuning (tanda baca menempel ke kata sebelumnya) */
export const parseCue = (text: string): Part[][] => {
  const tokens: Part[][] = [];
  let current: Part[] | null = null;
  for (const seg of text.split(/(\*[^*]+\*)/).filter(Boolean)) {
    const hl = seg.startsWith('*') && seg.endsWith('*');
    const body = hl ? seg.slice(1, -1) : seg;
    for (const p of body.split(/(\s+)/)) {
      if (p === '') continue;
      if (/^\s+$/.test(p)) {
        current = null;
        continue;
      }
      if (!current) {
        current = [];
        tokens.push(current);
      }
      current.push({t: p, hl});
    }
  }
  return tokens;
};

const Cue: React.FC<{text: string; startF: number; endF: number}> = ({text, startF, endF}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - startF;
  const enter = spring({frame: local, fps, config: {damping: 200, mass: 0.6}});
  const exit = interpolate(frame, [endF - 6, endF], [1, 0], {...CLAMP, easing: EASE});
  const words = parseCue(text);
  const long = text.replace(/\*/g, '').length > 40;
  return (
    <div
      style={{
        opacity: Math.min(enter, exit),
        transform: `translateY(${(1 - enter) * 26 + (1 - exit) * -10}px) scale(${0.96 + 0.04 * enter})`,
        maxWidth: 940,
        padding: '22px 36px 24px',
        borderRadius: 30,
        background: 'rgba(30, 32, 38, 0.86)',
        boxShadow: '0 18px 40px rgba(40, 30, 10, 0.22)',
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: long ? 48 : 54,
        lineHeight: 1.24,
        letterSpacing: '-0.01em',
        color: '#FFFFFF',
      }}
    >
      <div style={{textWrap: 'balance', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
      {words.map((parts, i) => {
        const s = spring({frame: local - i * 1.6, fps, config: {damping: 200, mass: 0.5}});
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: 'inline-block',
                opacity: s,
                transform: `translateY(${(1 - s) * 16}px)`,
                filter: `blur(${(1 - s) * 4}px)`,
              }}
            >
              {parts.map((p, k) => (
                <span key={k} style={p.hl ? {color: C.yellow} : undefined}>
                  {p.t}
                </span>
              ))}
            </span>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
      </div>
    </div>
  );
};

/** Subtitle sinkron narasi, maksimal 2 baris, di area bawah yang aman */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const active = SUBTITLES.filter((c) => frame >= Math.round(c.start * fps) && frame < Math.round(c.end * fps));
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 330, pointerEvents: 'none'}}>
      {active.map((c) => (
        <Cue key={c.start} text={c.text} startF={Math.round(c.start * fps)} endF={Math.round(c.end * fps)} />
      ))}
    </AbsoluteFill>
  );
};
