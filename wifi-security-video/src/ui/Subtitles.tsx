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
  const enter = spring({frame: local, fps, config: {damping: 200, mass: 0.5}});
  const exit = interpolate(frame, [endF - 5, endF], [1, 0], {...CLAMP, easing: EASE});
  const words = parseCue(text);
  // Karaoke: perkiraan waktu tiap kata diucapkan, proporsional jumlah huruf
  const lens = words.map((w) => w.reduce((n, p) => n + p.t.length, 0) + 1);
  const total = lens.reduce((a, b) => a + b, 0);
  const speakDur = Math.max(1, (endF - startF) * 0.82);
  let acc = 0;
  return (
    <div
      style={{
        opacity: Math.min(enter, exit),
        transform: `translateY(${(1 - enter) * 18}px)`,
        maxWidth: 880,
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 46,
        lineHeight: 1.62,
        letterSpacing: '-0.01em',
      }}
    >
      <span
        style={{
          background: 'rgba(28, 30, 35, 0.92)',
          color: '#FFFFFF',
          padding: '5px 16px 7px',
          borderRadius: 12,
          WebkitBoxDecorationBreak: 'clone',
          boxDecorationBreak: 'clone',
        }}
      >
        {words.map((parts, i) => {
          const at = (acc / total) * speakDur;
          acc += lens[i];
          const spoken = interpolate(local, [at - 2, at + 3], [0, 1], CLAMP);
          return (
            <React.Fragment key={i}>
              <span style={{opacity: 0.45 + 0.55 * spoken}}>
                {parts.map((p, k) => (
                  <span
                    key={k}
                    style={
                      p.hl
                        ? {
                            background: C.yellow,
                            color: C.ink,
                            borderRadius: 7,
                            padding: '0 6px',
                            margin: '0 -2px',
                            WebkitBoxDecorationBreak: 'clone',
                            boxDecorationBreak: 'clone',
                            ...(k === parts.length - 1 && i < words.length - 1 && words[i + 1][0].hl ? {borderTopRightRadius: 0, borderBottomRightRadius: 0, paddingRight: 0, marginRight: 0} : {}),
                            ...(k === 0 && i > 0 && words[i - 1][words[i - 1].length - 1].hl ? {borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: 0, marginLeft: 0} : {}),
                          }
                        : undefined
                    }
                  >
                    {p.t}
                  </span>
                ))}
              </span>
              {i < words.length - 1 ? (
                parts[parts.length - 1].hl && words[i + 1][0].hl ? (
                  <span style={{background: C.yellow, opacity: 0.45 + 0.55 * spoken}}> </span>
                ) : (
                  ' '
                )
              ) : null}
            </React.Fragment>
          );
        })}
      </span>
    </div>
  );
};

/** Subtitle sinkron narasi, maksimal 2 baris, kotak per baris (gaya editorial) */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const active = SUBTITLES.filter((c) => frame >= Math.round(c.start * fps) && frame < Math.round(c.end * fps));
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1250, pointerEvents: 'none'}}>
      {active.map((c) => (
        <Cue key={c.start} text={c.text} startF={Math.round(c.start * fps)} endF={Math.round(c.end * fps)} />
      ))}
    </AbsoluteFill>
  );
};
