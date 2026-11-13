import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENES} from '../config/timeline';
import {C, FONT} from '../config/theme';
import {CLAMP, EASE, kf, mix, mixV, prog, V3, window01} from '../lib/anim';
import {drawLockScreen, drawWifiList, SH, SW, WifiItem} from '../screens/draw';
import {CafeBackdrop, CafeTable, CoffeeCup, PendantLamp, WifiTentCard} from '../three/Cafe';
import {Hand} from '../three/Hand';
import {Phone} from '../three/Phone';
import {CameraRig, Stage3D} from '../three/Stage';
import {useCanvasTexture} from '../three/useCanvasTexture';
import {IconSignalLow} from '../ui/Icons';
import {Chip, SceneTag} from '../ui/Overlay';

/** Daftar Wi-Fi yang muncul di layar HP */
export const CAFE_NETWORKS: WifiItem[] = [
  {name: 'Rumah_PakRT', secure: true, level: 2},
  {name: 'IndiHome-7A21', secure: true, level: 2},
  {name: 'KafeKopi_Free', secure: false, level: 3},
  {name: 'AndroidAP_88', secure: true, level: 1},
  {name: 'Free_WiFi_Mall', secure: false, level: 1},
];
const TARGET = 2;

// ---- Timing (frame lokal scene) ----
const T = {
  wake: 8, // layar HP menyala
  handIn: 26, // tangan mulai masuk
  grab: 56, // tangan menggenggam & mengangkat
  list: 92, // daftar Wi-Fi muncul
  tap: 150, // ibu jari menekan
  connecting: 158,
  connected: 196,
};

// Pose HP di meja vs di tangan
const PHONE_TABLE_POS: V3 = [0.2, 1.045, 0.55];
const PHONE_TABLE_ROT: V3 = [-Math.PI / 2, 0, 0.35];
const PHONE_HELD_POS: V3 = [0, 2.28, 1.95];
const PHONE_HELD_ROT: V3 = [-0.1, 0.06, 0.03];

export const Scene1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // --- tangan & HP ---
  const handIn = prog(frame, T.handIn, 30);
  const lift = spring({frame: frame - T.grab, fps, config: {damping: 16, mass: 0.9, stiffness: 80}});
  const liftC = Math.min(1, lift);
  const idle = Math.sin(frame * 0.06) * 0.012 * liftC;

  const phonePos = mixV(PHONE_TABLE_POS, PHONE_HELD_POS, lift);
  phonePos[1] += idle;
  const phoneRot = mixV(PHONE_TABLE_ROT, PHONE_HELD_ROT, liftC);
  // tangan di koordinat lokal HP: datang dari bawah-kanan (di atas meja), lalu masuk ke belakang HP
  const handApproach = mixV([1.4, -3.2, 0.6], [0.05, -0.15, 0.32], handIn);
  const handLocal = mixV(handApproach, [0, 0, 0], liftC);
  const thumb = interpolate(frame, [T.tap - 10, T.tap, T.tap + 8, T.tap + 20], [0, 1, 1, 0.1], {...CLAMP, easing: EASE});

  // --- layar ---
  const isList = frame >= T.list;
  const screen = useCanvasTexture(SW, SH, (ctx) => {
    if (!isList) {
      drawLockScreen(ctx, {notif: prog(frame, T.wake + 6, 16), glow: interpolate(frame, [T.wake, T.wake + 10], [0.6, 0], CLAMP)});
      if (frame < T.wake) {
        ctx.fillStyle = `rgba(8,9,12,${interpolate(frame, [0, T.wake], [1, 0.95], CLAMP)})`;
        ctx.fillRect(0, 0, SW, SH);
      }
      return;
    }
    const sel = frame >= T.tap ? TARGET : -1;
    const connected = frame >= T.connected;
    drawWifiList(ctx, {
      items: CAFE_NETWORKS,
      reveal: interpolate(frame, [T.list + 4, T.list + 40], [0, CAFE_NETWORKS.length], CLAMP),
      frame,
      scanning: !connected,
      selected: sel,
      selectT: prog(frame, T.tap, 6),
      tap: interpolate(frame, [T.tap, T.tap + 18], [0, 1], CLAMP),
      status: frame >= T.connecting ? (connected ? 'Terhubung' : 'Menghubungkan…') : undefined,
      statusColor: C.blue,
    });
  });

  // --- kamera ---
  const cam = kf(
    frame,
    [0, 50, 108, 236],
    [
      [0.2, 3.9, 7.3],
      [0.45, 3.1, 6.2],
      [0, 2.45, 6.45],
      [-0.08, 2.42, 6.1],
    ],
  );
  const target = kf(
    frame,
    [0, 50, 108, 236],
    [
      [0, 1.25, 0.2],
      [0.15, 1.3, 0.5],
      [0, 2.1, 1.95],
      [0, 2.08, 1.95],
    ],
  );

  // --- overlay ---
  const hook = window01(frame, 4, 18, 46, 60);
  const kuota = spring({frame: frame - 126, fps, config: {damping: 14, mass: 0.7}});
  const drain = interpolate(frame, [126, 215], [0.16, 0.03], CLAMP);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.35);

  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Stage3D>
        <CameraRig position={cam} target={target} fov={38} />
        <CafeBackdrop position={[0, 0, -3.2]} />
        <CafeTable />
        <PendantLamp position={[-0.75, 3.75, -0.5]} />
        <CoffeeCup frame={frame} position={[-0.75, 1.0, 0.2]} />
        <WifiTentCard position={[0.85, 1.0, -0.45]} rotation-y={-0.35} />
        <Phone screen={screen} position={phonePos} rotation={phoneRot}>
          {handIn > 0 ? <Hand thumb={thumb} position={handLocal} /> : null}
        </Phone>
      </Stage3D>

      {/* Hook judul di awal */}
      <div
        style={{
          position: 'absolute',
          top: 230,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 82,
          lineHeight: 1.04,
          letterSpacing: '-0.03em',
          color: C.ink,
          opacity: hook,
          transform: `translateY(${(1 - hook) * 30}px)`,
          textShadow: '0 6px 30px rgba(237,228,214,0.9)',
        }}
      >
        WI-FI GRATIS,
        <br />
        <span style={{color: C.blue}}>TAPI AMAN NGGAK?</span>
      </div>

      {frame > 92 ? <SceneTag index={SCENES.opening.index} label={SCENES.opening.tag} delay={96} /> : null}

      {/* Chip kuota sekarat */}
      <Chip t={kuota} style={{top: 250, right: 48}} bg="rgba(255,253,249,0.96)">
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 18,
            background: C.orange,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 0 ${mix(0, 10, pulse)}px rgba(240,122,46,0.18)`,
          }}
        >
          <IconSignalLow size={40} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <div style={{fontSize: 26, color: C.gray, fontWeight: 700, lineHeight: 1}}>SISA KUOTA</div>
          <div style={{fontSize: 38, fontWeight: 800, lineHeight: 1, color: C.orangeDeep}}>0,2 MB</div>
          <div style={{width: 190, height: 10, borderRadius: 5, background: '#EEE6DA'}}>
            <div style={{width: `${drain * 100}%`, height: '100%', borderRadius: 5, background: C.orange}} />
          </div>
        </div>
      </Chip>
    </AbsoluteFill>
  );
};
