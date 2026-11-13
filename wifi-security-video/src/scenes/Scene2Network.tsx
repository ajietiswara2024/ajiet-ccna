import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENES} from '../config/timeline';
import {C} from '../config/theme';
import {kf, pop, prog, V3, window01} from '../lib/anim';
import {drawConnected, SH, SW} from '../screens/draw';
import {AccessPoint, Pedestal, Router} from '../three/Devices';
import {FlowLine, SignalWaves} from '../three/Effects';
import {Label3D} from '../three/Label3D';
import {Phone} from '../three/Phone';
import {CameraRig, Stage3D} from '../three/Stage';
import {Cloud, WifiIcon} from '../three/Symbols';
import {useCanvasTexture} from '../three/useCanvasTexture';
import {SceneTag} from '../ui/Overlay';

// ---- Timing (frame lokal; narasi scene dimulai di detik 7) ----
const T = {
  question: 35, // "Pernah kepikiran nggak…"
  apAppear: 50,
  apOn: 148, // "Saat HP kamu terhubung…"
  apLabel: 290, // "…access point"
  router: 310, // "Alat inilah yang menghubungkan…"
  cloud: 360, // "…jaringan internet"
};

// ---- Tata letak 3D ----
const PHONE_POS: V3 = [-0.95, 1.3, 2.3];
const AP_POS: V3 = [1.0, 0, 0.4];
const AP_H = 0.75;
const ROUTER_POS: V3 = [-1.55, 0, -1.7];
const ROUTER_H = 0.9;
const CLOUD_POS: V3 = [0.35, 4.0, -4.4];

const AP_CENTER: V3 = [AP_POS[0], AP_H + 0.82, AP_POS[2]];

export const Scene2Network: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bob = Math.sin(frame * 0.05) * 0.05;
  const apPop = pop(frame, fps, T.apAppear);
  const apOn = prog(frame, T.apOn, 20);
  const routerPop = pop(frame, fps, T.router);
  const cloudPop = pop(frame, fps, T.cloud);

  const screen = useCanvasTexture(SW, SH, (ctx) =>
    drawConnected(ctx, {frame, activity: 0.3 + 0.7 * apOn, question: window01(frame, T.question, T.question + 12, T.apOn - 6, T.apOn + 6)}),
  );

  const cam = kf(
    frame,
    [0, 40, 140, 280, 368, 410],
    [
      [-0.65, 3.05, 6.0],
      [-0.5, 3.25, 6.4],
      [0.1, 3.8, 9.9],
      [0.15, 3.85, 9.5],
      [0.0, 5.5, 11.6],
      [0.0, 5.55, 11.9],
    ],
  );
  const target = kf(
    frame,
    [0, 40, 140, 280, 368, 410],
    [
      [-0.9, 1.4, 2.3],
      [-0.75, 1.45, 2.0],
      [0.05, 1.65, 1.1],
      [0.05, 1.65, 1.0],
      [-0.1, 2.05, -0.9],
      [-0.1, 2.05, -1.0],
    ],
  );

  const phoneToAp: V3[] = [
    [PHONE_POS[0] + 0.25, PHONE_POS[1] + 0.55 + bob, PHONE_POS[2] - 0.1],
    [0.1, 2.25, 1.6],
    [AP_CENTER[0] - 0.35, AP_CENTER[1] + 0.2, AP_CENTER[2] + 0.1],
  ];
  const apToRouter: V3[] = [
    [AP_POS[0], AP_H + 0.4, AP_POS[2] - 0.25],
    [0.6, 0.55, -0.6],
    [-0.6, 0.6, -1.4],
    [ROUTER_POS[0] + 0.5, ROUTER_H + 0.18, ROUTER_POS[2] + 0.1],
  ];
  const routerToCloud: V3[] = [
    [ROUTER_POS[0], ROUTER_H + 0.9, ROUTER_POS[2] - 0.2],
    [-1.3, 2.9, -2.8],
    [-0.6, 3.8, -3.9],
    [CLOUD_POS[0] - 0.55, CLOUD_POS[1] - 0.1, CLOUD_POS[2] + 0.2],
  ];

  // Arah gelombang dari AP menuju HP
  const dx = PHONE_POS[0] - AP_POS[0];
  const dz = PHONE_POS[2] - AP_POS[2];
  const waveYaw = Math.atan2(-dz, dx);

  return (
    <AbsoluteFill>
      <Stage3D focus={target} focusRange={9} blur={1.6}>
        <CameraRig position={cam} target={target} fov={38} />

        {/* Smartphone */}
        <Phone screen={screen} position={[PHONE_POS[0], PHONE_POS[1] + bob, PHONE_POS[2]]} rotation={[-0.08, 0.38, 0.02]} />
        <Label3D text="Smartphone" position={[PHONE_POS[0], PHONE_POS[1] + 1.15 + bob, PHONE_POS[2]]} opacity={prog(frame, 150, 12)} height={0.3} />

        {/* Access point */}
        <group scale={apPop}>
          <Pedestal position={AP_POS} height={AP_H} radius={0.75} />
          <AccessPoint position={[AP_POS[0], AP_H, AP_POS[2]]} rotation-y={-0.35} led={apOn > 0 ? C.blue : '#C9C3B8'} ledPower={apOn} />
          <WifiIcon position={[AP_CENTER[0], AP_CENTER[1] + 1.05, AP_CENTER[2]]} rotation-y={-0.3} scale={0.55} level={apOn * 3} />
        </group>
        <Label3D text="?" variant="yellow" icon="none" position={[AP_CENTER[0], AP_CENTER[1] + 1.15, AP_CENTER[2] + 0.2]} height={0.6} opacity={window01(frame, T.apAppear + 6, T.apAppear + 16, T.apOn - 8, T.apOn)} />
        <Label3D text="Access Point" variant="blue" position={[AP_CENTER[0], AP_CENTER[1] + 1.75, AP_CENTER[2]]} opacity={prog(frame, T.apLabel, 12)} />

        {/* HP <-> AP (nirkabel) */}
        <SignalWaves frame={frame} position={AP_CENTER} rotation={[0, waveYaw, 0.12]} maxR={1.7} opacity={0.75 * apOn} />
        <FlowLine points={phoneToAp} frame={frame} progress={prog(frame, T.apOn + 8, 26)} lineOpacity={0.0} pulses={4} speed={0.02} />

        {/* AP -> Router (kabel) */}
        <group scale={routerPop}>
          <Pedestal position={ROUTER_POS} height={ROUTER_H} radius={0.95} />
          <Router position={[ROUTER_POS[0], ROUTER_H, ROUTER_POS[2]]} rotation-y={0.3} frame={frame} power={routerPop} />
        </group>
        <FlowLine points={apToRouter} frame={frame} progress={prog(frame, T.router + 4, 22)} color="#BFB5A3" radius={0.035} pulseColor={C.blue} speed={0.016} />
        <Label3D text="Router" position={[ROUTER_POS[0], ROUTER_H + 1.55, ROUTER_POS[2]]} opacity={prog(frame, T.router + 10, 12)} />

        {/* Router -> Internet */}
        <group position={CLOUD_POS} scale={cloudPop}>
          <Cloud position={[0, Math.sin(frame * 0.04) * 0.06, 0]} scale={1.15} />
        </group>
        <FlowLine points={routerToCloud} frame={frame} progress={prog(frame, T.cloud, 22)} color="#BFB5A3" radius={0.03} pulseColor={C.yellow} speed={0.016} />
        <Label3D text="Internet" variant="dark" position={[CLOUD_POS[0], CLOUD_POS[1] + 1.25, CLOUD_POS[2]]} opacity={prog(frame, T.cloud + 10, 12)} height={0.42} />
      </Stage3D>
      <SceneTag index={SCENES.network.index} label={SCENES.network.tag} eyebrow={SCENES.network.eyebrow} title={SCENES.network.title} delay={10} />
    </AbsoluteFill>
  );
};
