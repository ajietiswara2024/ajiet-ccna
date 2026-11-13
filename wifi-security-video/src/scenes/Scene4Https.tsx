import React, {useMemo} from 'react';
import {AbsoluteFill, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {SCENES} from '../config/timeline';
import {C, cf, FONT, MONO} from '../config/theme';
import {kf, pop, prog, V3, window01} from '../lib/anim';
import {drawBrowser, lockGlyph, rr, SH, SW} from '../screens/draw';
import {Pedestal, Server} from '../three/Devices';
import {curvePoint, FlowLine, Glow} from '../three/Effects';
import {Label3D} from '../three/Label3D';
import {Phone} from '../three/Phone';
import {CameraRig, Stage3D} from '../three/Stage';
import {Padlock} from '../three/Symbols';
import {useCanvasTexture} from '../three/useCanvasTexture';
import {IconEye, IconLock} from '../ui/Icons';
import {Chip, SceneTag} from '../ui/Overlay';

// ---- Timing (frame lokal; scene dimulai di detik 34) ----
const T = {
  press: 20,
  https: 120, // "Koneksi HTTPS…"
  encrypt: 156, // "…enkripsi"
  spy: 225, // "…tidak mudah dibaca orang lain"
};

const PHONE_POS: V3 = [-0.8, 1.75, 1.9];
const SERVER_POS: V3 = [1.2, 0, -2.2];
const PATH: V3[] = [
  [-0.55, 2.5, 1.85],
  [-0.4, 2.85, 0.9],
  [0.25, 3.0, -0.4],
  [1.0, 2.6, -1.6],
  [1.2, 2.2, -2.1],
];
const TUNNEL_FROM = 0.26;
const TUNNEL_TO = 0.8;

const PLAIN = ['Halo!', 'pass: kopi123', 'kartu 4512…'];
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz0123456789#$%&@!?*+=';
const scramble = (seed: string, len: number) =>
  new Array(len)
    .fill(0)
    .map((_, i) => GLYPHS[Math.floor(random(`${seed}-${i}`) * GLYPHS.length)])
    .join('');

/** Paket data (sprite) yang berubah menjadi teks terenkripsi */
const Packet: React.FC<{u: number; text: string; encrypted: boolean; seed: string; opacity: number}> = ({u, text, encrypted, seed, opacity}) => {
  const tex = useCanvasTexture(420, 120, (ctx, w, h) => {
    ctx.fillStyle = encrypted ? C.ink : '#FFFDF9';
    rr(ctx, 4, 4, w - 8, h - 8, 34);
    ctx.fill();
    ctx.strokeStyle = encrypted ? C.yellow : '#E0D8CA';
    ctx.lineWidth = 4;
    ctx.stroke();
    if (encrypted) lockGlyph(ctx, 52, 60, 40, C.yellow);
    ctx.fillStyle = encrypted ? C.yellow : C.ink;
    ctx.font = cf(700, 40, MONO);
    ctx.textBaseline = 'middle';
    ctx.fillText(encrypted ? scramble(seed, 11) : text, encrypted ? 92 : 34, 63);
  });
  const p = curvePoint(PATH, u);
  return (
    <sprite position={[p[0], p[1] + 0.32, p[2]]} scale={[1.05, 0.3, 1]} renderOrder={15}>
      <spriteMaterial map={tex} transparent opacity={opacity} depthTest={false} depthWrite alphaTest={0.4} toneMapped={false} />
    </sprite>
  );
};

export const Scene4Https: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const secure = prog(frame, T.https, 14);
  const lockPop = pop(frame, fps, T.https - 8);
  const lockClose = spring({frame: frame - T.https - 10, fps, config: {damping: 10, mass: 0.6, stiffness: 140}});
  const tunnel = prog(frame, T.https, 24);

  const screen = useCanvasTexture(SW, SH, (ctx) =>
    drawBrowser(ctx, {frame, press: prog(frame, T.press, 10), sending: ((frame - T.press - 8) / 90) % 1.0001, secure: frame >= T.https ? 1 : 0}),
  );

  // terowongan kaca (enkripsi)
  const tunnelGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 30; i++) {
      const p = curvePoint(PATH, TUNNEL_FROM + ((TUNNEL_TO - TUNNEL_FROM) * i) / 30);
      pts.push(new THREE.Vector3(...p));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.36, 32, false);
  }, []);
  const mid = curvePoint(PATH, (TUNNEL_FROM + TUNNEL_TO) / 2);
  const tunnelStart = curvePoint(PATH, TUNNEL_FROM);
  const tunnelEnd = curvePoint(PATH, TUNNEL_TO);

  const cam = kf(
    frame,
    [0, 111.2, 300],
    [
      [-0.3, 4.05, 9.2],
      [0.0, 4.15, 8.9],
      [0.45, 4.25, 8.5],
    ],
  );
  const target = kf(
    frame,
    [0, 110, 300],
    [
      [0, 2.35, 0],
      [0.05, 2.4, -0.1],
      [0.1, 2.45, -0.2],
    ],
  );

  // paket data
  const travel = (frame - T.press - 6) * 0.0075;
  const packets = [0, 1, 2].map((k) => ({k, u: (((travel + k / 3) % 1) + 1) % 1, visible: travel >= 0 && travel + k / 3 >= 0}));

  const spyChip = window01(frame, T.spy, T.spy + 14, 400, 410);
  const httpsChip = spring({frame: frame - T.https, fps, config: {damping: 14, mass: 0.7}});

  return (
    <AbsoluteFill>
      <Stage3D focus={target} focusRange={9} blur={1.6}>
        <CameraRig position={cam} target={target} fov={38} />

        <Phone screen={screen} position={[PHONE_POS[0], PHONE_POS[1] + Math.sin(frame * 0.05) * 0.04, PHONE_POS[2]]} rotation={[-0.06, 0.42, 0.02]} scale={1.05} />
        <Label3D text="HP kamu" position={[PHONE_POS[0] + 0.2, PHONE_POS[1] + 1.12, PHONE_POS[2] + 0.2]} height={0.28} opacity={window01(frame, 14, 26, T.spy - 10, T.spy)} />

        <Pedestal position={SERVER_POS} height={0.25} radius={1.0} />
        <Server position={[SERVER_POS[0], 0.25, SERVER_POS[2]]} rotation-y={-0.35} frame={frame} />
        <Label3D text="Server situs" position={[SERVER_POS[0] + 0.15, 0.62, SERVER_POS[2] + 0.75]} height={0.28} opacity={prog(frame, 24, 12)} />

        <FlowLine points={PATH} frame={frame} progress={prog(frame, T.press + 4, 20)} color="#CDBFA9" radius={0.03} pulseColor={secure > 0.5 ? C.yellow : C.blue} pulses={5} speed={0.0075} />

        {/* terowongan enkripsi */}
        {tunnel > 0 ? (
          <group>
            <mesh geometry={tunnelGeo} renderOrder={4}>
              <meshPhysicalMaterial color="#9FBCF7" transparent opacity={0.28 * tunnel} roughness={0.15} clearcoat={1} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
            {[tunnelStart, tunnelEnd].map((p, i) => (
              <Glow key={i} position={p} size={1.6 * tunnel} color={C.blue} opacity={0.45 * tunnel} />
            ))}
          </group>
        ) : null}
        <Label3D text="HTTPS · Terenkripsi" variant="blue" icon="dot" position={[mid[0] - 0.2, mid[1] - 0.85, mid[2] + 0.2]} height={0.3} opacity={window01(frame, T.encrypt, T.encrypt + 12, T.spy - 10, T.spy)} />

        <group position={[mid[0], mid[1] + 1.0, mid[2] + 0.2]} scale={0.5 * lockPop} rotation-y={Math.sin(frame * 0.04) * 0.25}>
          <Padlock closed={lockClose} shine={lockClose} />
        </group>
        <Glow position={[mid[0], mid[1] + 1.0, mid[2] - 0.1]} size={2.4} color={C.yellow} opacity={0.35 * lockClose} />

        {packets.map(({k, u, visible}) =>
          visible ? (
            <Packet
              key={k}
              u={u}
              text={PLAIN[k]}
              encrypted={frame >= T.https && u > TUNNEL_FROM + 0.04}
              seed={`p${k}-${Math.floor(frame / 3)}`}
              opacity={Math.min(1, u * 10, (1 - u) * 10)}
            />
          ) : null,
        )}
      </Stage3D>

      <SceneTag index={SCENES.https.index} label={SCENES.https.tag} eyebrow={SCENES.https.eyebrow} title={SCENES.https.title} delay={10} />

      <Chip t={httpsChip} style={{top: 290, left: 64}} bg={C.blue} color="#fff">
        <div style={{width: 52, height: 52, borderRadius: 16, background: C.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IconLock size={32} color={C.ink} />
        </div>
        <span style={{fontFamily: FONT}}>
          HTTPS = <span style={{color: C.yellow}}>data terenkripsi</span>
        </span>
      </Chip>

      <Chip t={spyChip} style={{top: 1000, left: 64, flexDirection: 'column', alignItems: 'flex-start', gap: 10}} bg="rgba(34,37,43,0.94)" color="#fff">
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 28, color: '#FFB07A'}}>
          <IconEye size={34} color="#FFB07A" />
          Yang terlihat oleh penyerang:
        </div>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.yellow, letterSpacing: '0.02em'}}>{scramble(`spy-${Math.floor(frame / 3)}`, 20)}</div>
      </Chip>
    </AbsoluteFill>
  );
};
