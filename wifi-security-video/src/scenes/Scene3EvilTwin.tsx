import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENES} from '../config/timeline';
import {C, FONT, MONO} from '../config/theme';
import {CLAMP, EASE, kf, mix, mixColor, pop, prog, V3, window01} from '../lib/anim';
import {drawAttackerScreen, drawWifiList, SH, SW, WifiItem} from '../screens/draw';
import {Attacker} from '../three/Attacker';
import {AccessPoint, Laptop, Pedestal} from '../three/Devices';
import {FlowLine, Glow} from '../three/Effects';
import {Label3D} from '../three/Label3D';
import {Phone} from '../three/Phone';
import {CameraRig, Stage3D} from '../three/Stage';
import {WifiIcon} from '../three/Symbols';
import {useCanvasTexture} from '../three/useCanvasTexture';
import {IconCheck, IconCross} from '../ui/Icons';
import {Chip, SceneTag} from '../ui/Overlay';

export const REAL_SSID = 'KafeKopi_Free';
export const FAKE_SSID = 'KafeKop1_Free';

const NETWORKS: WifiItem[] = [
  {name: REAL_SSID, secure: false, level: 2},
  {name: FAKE_SSID, secure: false, level: 3, diffChar: 7, danger: true},
  {name: 'IndiHome-7A21', secure: true, level: 2},
  {name: 'AndroidAP_88', secure: true, level: 1},
];

// ---- Timing (frame lokal; scene dimulai di detik 18) ----
const T = {
  split: 56, // AP palsu "dikloning"
  evilTwin: 140, // "Namanya Evil Twin"
  compare: 176, // "menyerupai Wi-Fi asli"
  attacker: 290, // "jaringan milik penyerang"
  phoneIn: 336, // "Bayangkan…"
  tap: 372,
  connected: 392,
  reality: 430, // "ternyata…"
};

const REAL_X = -1.15;
const FAKE_X = 1.15;
const PED_H = 0.9;
const PHONE_POS: V3 = [0.15, 1.45, 2.75];
const LAPTOP_POS: V3 = [1.95, 0, -1.7];

export const Scene3EvilTwin: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const split = spring({frame: frame - T.split, fps, config: {damping: 18, mass: 0.9, stiffness: 70}});
  const realX = mix(0, REAL_X, split);
  const fakeX = mix(0, FAKE_X, split);
  const evil = prog(frame, T.evilTwin, 18);
  const glitch = frame > T.evilTwin && frame < T.evilTwin + 26 && Math.floor(frame / 2) % 3 === 0 ? 0.06 : 0;
  const fakeLed = mixColor(C.blue, C.orange, evil);
  const attacker = pop(frame, fps, T.attacker);
  const phoneIn = spring({frame: frame - T.phoneIn, fps, config: {damping: 16, mass: 0.9, stiffness: 80}});
  const reality = prog(frame, T.reality, 14);

  // layar HP
  const screen = useCanvasTexture(SW, SH, (ctx) => {
    const sel = frame >= T.tap ? 1 : -1;
    drawWifiList(ctx, {
      items: NETWORKS,
      reveal: interpolate(frame, [T.phoneIn + 6, T.phoneIn + 26], [0, NETWORKS.length], CLAMP),
      frame,
      scanning: frame < T.connected,
      selected: sel,
      selectT: prog(frame, T.tap, 6),
      tap: interpolate(frame, [T.tap, T.tap + 18], [0, 1], CLAMP),
      status: frame >= T.tap ? (frame >= T.connected ? 'Terhubung' : 'Menghubungkan…') : undefined,
      statusColor: frame >= T.reality ? C.orange : C.blue,
      markDiff: prog(frame, T.reality, 12),
      banner:
        frame >= T.reality
          ? {title: 'Ini bukan Wi-Fi kafe!', body: 'Datamu lewat perangkat milik penyerang.', color: C.orange, t: prog(frame, T.reality + 8, 14), icon: 'warn'}
          : undefined,
    });
  });
  const laptopScreen = useCanvasTexture(512, 320, (ctx, w, h) => drawAttackerScreen(ctx, w, h, frame, prog(frame, T.attacker + 10, 40)));

  // kamera
  const cam = kf(
    frame,
    [0, 80, 240, 300, 336, 376, 518],
    [
      [0, 2.5, 7.0],
      [0, 2.8, 11.0],
      [0, 2.85, 11.2],
      [0.55, 3.2, 12.0],
      [0.55, 3.2, 12.0],
      [0.3, 3.3, 10.9],
      [0.25, 3.25, 10.6],
    ],
  );
  const target = kf(
    frame,
    [0, 80, 240, 300, 336, 376, 518],
    [
      [0, 1.9, 0],
      [0, 2.05, 0],
      [0, 2.05, 0],
      [0.45, 1.95, -0.6],
      [0.45, 1.95, -0.6],
      [0.25, 1.85, 0.3],
      [0.25, 1.85, 0.3],
    ],
  );

  const apY = PED_H + 0.82;
  const toFake: V3[] = [
    [PHONE_POS[0] + 0.3, PHONE_POS[1] + 0.6, PHONE_POS[2] - 0.1],
    [0.9, 2.4, 1.4],
    [FAKE_X - 0.2, apY + 0.15, 0.15],
  ];
  const fakeToLaptop: V3[] = [
    [FAKE_X + 0.2, PED_H + 0.4, -0.3],
    [1.7, 0.7, -0.9],
    [LAPTOP_POS[0], PED_H - 0.05 + 0.3, LAPTOP_POS[2] + 0.1],
  ];

  // overlay
  const headline = window01(frame, T.evilTwin, T.evilTwin + 10, T.compare + 60, T.compare + 76);
  const cards = window01(frame, T.compare + 4, T.compare + 18, T.phoneIn - 14, T.phoneIn);
  const think = window01(frame, T.phoneIn + 8, T.phoneIn + 20, T.reality - 4, T.reality + 4);
  const real = spring({frame: frame - T.reality - 4, fps, config: {damping: 14, mass: 0.7}});

  return (
    <AbsoluteFill>
      <Stage3D>
        <CameraRig position={cam} target={target} fov={38} />

        {/* AP ASLI */}
        <group position={[realX, 0, 0]}>
          <Pedestal height={PED_H} radius={0.8} />
          <AccessPoint position={[0, PED_H, 0]} led={C.blue} />
          <WifiIcon position={[0, apY + 1.05, 0]} scale={0.5} level={3} />
          <Label3D text={REAL_SSID} position={[0, apY + 1.75, 0]} height={0.3} opacity={prog(frame, T.compare, 12) * (1 - phoneIn * 0.0)} mono />
          <Label3D text="ASLI" variant="blue" icon="check" position={[0, 0.45, 0.95]} height={0.3} opacity={prog(frame, T.phoneIn, 14)} />
        </group>

        {/* AP PALSU (Evil Twin) */}
        <group position={[fakeX + glitch, 0, 0]} scale={0.6 + 0.4 * split}>
          <Pedestal height={PED_H} radius={0.8} color={mixColor(C.cream, '#F3DCC8', evil)} />
          <AccessPoint position={[0, PED_H, 0]} led={fakeLed} ledPower={1 + evil * 0.5} />
          <Glow position={[0, apY, 0.3]} size={1.6} color={C.orange} opacity={0.35 * evil * (0.7 + 0.3 * Math.sin(frame * 0.3))} />
          <WifiIcon position={[0, apY + 1.05, 0]} scale={0.5} level={3} color={mixColor(C.blue, C.orange, evil)} />
          <Label3D text={FAKE_SSID} position={[0, apY + 1.75, 0]} height={0.3} opacity={prog(frame, T.compare, 12)} mono />
          <Label3D text="PALSU" variant="orange" icon="cross" position={[0, 0.45, 0.95]} height={0.3} opacity={prog(frame, T.phoneIn + 6, 14)} />
        </group>

        {/* Penyerang di belakang AP palsu */}
        <group scale={attacker}>
          <Pedestal position={LAPTOP_POS} height={PED_H - 0.05} radius={0.75} color="#E2D6C4" />
          <Laptop position={[LAPTOP_POS[0], PED_H - 0.05, LAPTOP_POS[2]]} rotation-y={-0.55} screen={laptopScreen} open={prog(frame, T.attacker + 4, 18)} />
          <Attacker position={[LAPTOP_POS[0] + 0.55, 0, LAPTOP_POS[2] - 1.0]} rotation-y={-0.5} eyes={prog(frame, T.attacker + 20, 10)} />
        </group>
        <Label3D text="Penyerang" variant="orange" position={[LAPTOP_POS[0] + 0.4, 2.45, LAPTOP_POS[2] - 0.6]} height={0.3} opacity={prog(frame, T.attacker + 18, 12)} />
        <FlowLine points={fakeToLaptop} frame={frame} progress={prog(frame, T.attacker + 14, 22)} color="#D9B9A0" radius={0.03} pulseColor={C.orange} speed={0.02} />

        {/* HP korban */}
        {phoneIn > 0.001 ? (
          <Phone
            screen={screen}
            position={[PHONE_POS[0], mix(-1.5, PHONE_POS[1], phoneIn) + Math.sin(frame * 0.05) * 0.03, PHONE_POS[2]]}
            rotation={[-0.12, -0.12, 0]}
            scale={1.3}
          />
        ) : null}
        <FlowLine points={toFake} frame={frame} progress={prog(frame, T.connected - 6, 20)} lineOpacity={0} pulseColor={C.orange} pulses={4} speed={0.022} />
      </Stage3D>

      <SceneTag index={SCENES.evilTwin.index} label={SCENES.evilTwin.tag} delay={10} color={C.orange} />

      {/* Headline EVIL TWIN dengan efek glitch */}
      <div
        style={{
          position: 'absolute',
          top: 270,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 140,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          opacity: headline,
          transform: `scale(${0.9 + 0.1 * headline})`,
        }}
      >
        <span style={{position: 'absolute', left: 0, right: 0, color: C.blue, opacity: 0.55, transform: `translate(${glitch ? -10 : -4}px, 2px)`}}>EVIL TWIN</span>
        <span style={{position: 'relative', color: C.orange, transform: `translate(${glitch ? 8 : 0}px, 0)`, display: 'inline-block'}}>EVIL TWIN</span>
        <div style={{fontSize: 36, fontWeight: 700, color: C.inkSoft, marginTop: 18, letterSpacing: 0}}>Wi-Fi palsu yang meniru Wi-Fi asli</div>
      </div>

      {/* Kartu perbandingan nama jaringan */}
      <div style={{position: 'absolute', top: 1110, left: 48, right: 48, display: 'flex', gap: 24, opacity: cards, transform: `translateY(${(1 - cards) * 30}px)`}}>
        {[
          {title: 'ASLI', ssid: REAL_SSID, color: C.blue, Icon: IconCheck},
          {title: 'PALSU', ssid: FAKE_SSID, color: C.orange, Icon: IconCross},
        ].map(({title, ssid, color, Icon}, i) => {
          const mark = prog(frame, T.compare + 50 + i * 6, 14);
          return (
            <div key={title} style={{flex: 1, background: 'rgba(255,253,249,0.96)', borderRadius: 30, padding: '22px 26px', boxShadow: '0 16px 36px rgba(60,45,20,0.14)', fontFamily: FONT}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, fontWeight: 800, fontSize: 30, color}}>
                <div style={{width: 46, height: 46, borderRadius: 23, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon size={30} />
                </div>
                {title}
              </div>
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 37, color: C.ink, marginTop: 14, whiteSpace: 'nowrap'}}>
                {ssid.split('').map((ch, k) =>
                  k === 7 ? (
                    <span key={k} style={{background: `rgba(${i ? '240,122,46' : '246,195,67'},${0.45 * mark})`, borderRadius: 8, boxShadow: `0 0 0 ${3 * mark}px ${i ? C.orange : C.yellow}`}}>
                      {ch}
                    </span>
                  ) : (
                    <span key={k}>{ch}</span>
                  ),
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* "Kamu kira" vs "Ternyata" */}
      <Chip t={think} style={{top: 270, left: 0, right: 0, margin: '0 auto', width: 'fit-content'}}>
        <div style={{width: 50, height: 50, borderRadius: 25, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IconCheck size={32} />
        </div>
        <span>
          Kamu kira: <span style={{color: C.blue}}>Wi-Fi kafe</span>
        </span>
      </Chip>
      <Chip t={real} style={{top: 270, left: 0, right: 0, margin: '0 auto', width: 'fit-content'}} bg={C.orange} color="#fff">
        <div style={{width: 50, height: 50, borderRadius: 25, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IconCross size={32} color={C.orange} />
        </div>
        <span>Ternyata: jaringan penyerang</span>
      </Chip>
      {/* garis peringatan tipis saat "ternyata" */}
      <AbsoluteFill style={{boxShadow: `inset 0 0 ${interpolate(reality, [0, 1], [0, 160])}px rgba(240,122,46,${0.22 * reality})`, pointerEvents: 'none', opacity: interpolate(frame, [T.reality, T.reality + 30], [1, 0.6], {...CLAMP, easing: EASE})}} />
    </AbsoluteFill>
  );
};
