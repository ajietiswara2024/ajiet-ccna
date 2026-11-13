import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENES} from '../config/timeline';
import {C, FONT} from '../config/theme';
import {CLAMP, EASE, kf, pop, prog} from '../lib/anim';
import {drawSecure, SH, SW} from '../screens/draw';
import {Glow} from '../three/Effects';
import {Phone} from '../three/Phone';
import {CameraRig, Stage3D} from '../three/Stage';
import {Padlock, Shield, WifiIcon} from '../three/Symbols';
import {useCanvasTexture} from '../three/useCanvasTexture';
import {SceneTag} from '../ui/Overlay';

/** Kredit kreator — ubah di sini */
export const CREDIT = {label: 'Created by', handle: '@andiajietiswaraputra'};

// ---- Timing (frame lokal; scene dimulai di detik 46) ----
const T = {
  check1: 14, // "pastikan nama Wi-Fi benar"
  check2: 100, // "jangan sembarangan memasukkan informasi pribadi"
  check3: 170,
  title: 258, // judul akhir
  credit: 296,
  fadeOut: 372, // fade-out ke latar
};

export const Scene5Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const screen = useCanvasTexture(SW, SH, (ctx) =>
    drawSecure(ctx, {frame, shield: prog(frame, 4, 24), checks: [prog(frame, T.check1, 18), prog(frame, T.check2, 18), prog(frame, T.check3, 18)]}),
  );

  const shieldPop = pop(frame, fps, 8);
  const wifiPop = pop(frame, fps, 18);
  const lockPop = pop(frame, fps, 28);
  const outro = prog(frame, T.title - 14, 26);

  const cam = kf(
    frame,
    [0, 250, 310, 393],
    [
      [0, 2.25, 6.7],
      [0.55, 2.45, 6.3],
      [0.2, 2.9, 8.6],
      [0.1, 3.0, 9.0],
    ],
  );
  const target = kf(
    frame,
    [0, 250, 310, 393],
    [
      [0, 2.0, 0.6],
      [0.05, 2.05, 0.6],
      [0, 2.2, 0.4],
      [0, 2.2, 0.4],
    ],
  );

  const t = (d: number) => spring({frame: frame - T.title - d, fps, config: {damping: 16, mass: 0.8, stiffness: 110}});
  const credit = spring({frame: frame - T.credit, fps, config: {damping: 200}});
  const fade = interpolate(frame, [T.fadeOut, durationInFrames - 1], [1, 0], {...CLAMP, easing: EASE});

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <AbsoluteFill style={{opacity: 1 - 0.78 * outro, filter: outro > 0 ? `blur(${outro * 12}px)` : undefined}}>
        <Stage3D>
          <CameraRig position={cam} target={target} fov={38} />
          <Phone screen={screen} position={[0, 2.0 + Math.sin(frame * 0.05) * 0.04, 0.6]} rotation={[-0.05, Math.sin(frame * 0.02) * 0.12, 0]} scale={1.15} />
          <group position={[0.85, 1.25 + Math.sin(frame * 0.06 + 1) * 0.06, 1.25]} scale={0.62 * shieldPop} rotation={[0, -0.45, 0.08]}>
            <Shield check={prog(frame, 16, 14)} />
          </group>
          <Glow position={[1.05, 1.25, 1.0]} size={2} color={C.blue} opacity={0.25 * shieldPop} />
          <group position={[-0.82, 2.75 + Math.sin(frame * 0.05 + 2) * 0.06, 0.8]} scale={0.5 * wifiPop} rotation-y={0.35}>
            <WifiIcon level={3} />
          </group>
          <group position={[0.85, 2.85 + Math.sin(frame * 0.055) * 0.06, 0.4]} scale={0.34 * lockPop} rotation-y={-0.4 + Math.sin(frame * 0.03) * 0.2}>
            <Padlock closed={1} shine={1} />
          </group>
        </Stage3D>
      </AbsoluteFill>

      <div style={{opacity: 1 - outro}}>
        <SceneTag index={SCENES.closing.index} label={SCENES.closing.tag} delay={10} />
      </div>

      {/* Tipografi judul akhir */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 470, fontFamily: FONT}}>
        <div style={{textAlign: 'center', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.0, color: C.ink}}>
          {[
            {text: 'WI-FI GRATIS,', color: C.ink, size: 112, d: 0},
            {text: 'TAPI AMAN', color: C.blue, size: 128, d: 5},
            {text: 'NGGAK?', color: C.orange, size: 150, d: 10},
          ].map((l) => {
            const s = t(l.d);
            return (
              <div key={l.text} style={{overflow: 'hidden', paddingBottom: 8}}>
                <div style={{fontSize: l.size, color: l.color, opacity: s, transform: `translateY(${(1 - s) * 110}%)`}}>{l.text}</div>
              </div>
            );
          })}
          <div
            style={{
              height: 14,
              width: 380,
              margin: '18px auto 0',
              borderRadius: 7,
              background: C.yellow,
              transform: `scaleX(${prog(frame, T.title + 18, 20)})`,
            }}
          />
        </div>

        {/* Kredit kreator */}
        <div style={{marginTop: 90, textAlign: 'center', opacity: credit, transform: `translateY(${(1 - credit) * 30}px)`}}>
          <div style={{fontSize: 34, fontWeight: 600, color: C.gray, letterSpacing: '0.12em', textTransform: 'uppercase'}}>{CREDIT.label}</div>
          <div
            style={{
              marginTop: 18,
              display: 'inline-block',
              padding: '18px 40px',
              borderRadius: 999,
              background: 'rgba(255,253,249,0.95)',
              boxShadow: '0 16px 40px rgba(60,45,20,0.14)',
              fontSize: 50,
              fontWeight: 800,
              color: C.ink,
            }}
          >
            <span style={{color: C.blue}}>@</span>
            {CREDIT.handle.replace(/^@/, '')}
          </div>
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
