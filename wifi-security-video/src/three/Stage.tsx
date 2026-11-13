import {Environment, Lightformer} from '@react-three/drei';
import {DepthOfField, EffectComposer, ToneMapping} from '@react-three/postprocessing';
import {ToneMappingMode} from 'postprocessing';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import React, {useMemo} from 'react';
import {useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {C} from '../config/theme';
import type {V3} from '../lib/anim';

/**
 * Studio "soft lighting": latar beige, lantai tak berujung (fog),
 * key light dengan bayangan lembut, fill, rim, dan environment reflection.
 */
export const Studio: React.FC<{bg?: string; floor?: boolean; floorColor?: string}> = ({
  bg = C.bg,
  floor = true,
  floorColor = '#EAE6DF',
}) => (
  <>
    <color attach="background" args={[bg]} />
    <fog attach="fog" args={[bg, 14, 34]} />
    <hemisphereLight args={['#FFFFFF', '#CFC6B8', 1.0]} />
    <directionalLight
      castShadow
      position={[4.5, 9, 6]}
      intensity={2.1}
      color="#FFF1DC"
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.03}
    >
      <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.5, 30]} />
    </directionalLight>
    <directionalLight position={[-6, 4, 2]} intensity={0.45} color="#DCE6FF" />
    <directionalLight position={[0, 3, -8]} intensity={0.7} color="#FFFFFF" />
    <Environment resolution={256} frames={1} environmentIntensity={0.55}>
      <Lightformer form="rect" intensity={3} position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[10, 6, 1]} />
      <Lightformer form="rect" intensity={1.5} position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color="#FFF4E4" />
      <Lightformer form="rect" intensity={1.2} position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} color="#E6EEFF" />
      <Lightformer form="ring" intensity={1} position={[0, 3, 8]} scale={4} />
    </Environment>
    {floor ? <TileFloor color={floorColor} /> : null}
  </>
);

/** Lantai ubin terang dengan nat tipis (gaya flat-lay studio) */
const TileFloor: React.FC<{color: string}> = ({color}) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(120,108,90,0.42)';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 512, 512);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(70, 70);
    t.anisotropy = 16;
    return t;
  }, [color]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0.42]} receiveShadow>
      <planeGeometry args={[140, 140]} />
      <meshStandardMaterial map={tex} roughness={0.9} />
    </mesh>
  );
};

/** Kamera dikendalikan per-frame (deterministik) */
export const CameraRig: React.FC<{position: V3; target: V3; fov?: number; roll?: number}> = ({
  position,
  target,
  fov = 38,
  roll = 0,
}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...position);
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(...target);
  if (camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
  return null;
};

/**
 * Kanvas 3D standar untuk setiap scene.
 * `focus` = titik dunia yang tajam; area di depan/belakangnya di-blur (depth of field)
 * seperti foto produk. Set `dof={false}` untuk mematikan (render lebih cepat).
 */
export const Stage3D: React.FC<{
  children: React.ReactNode;
  bg?: string;
  floor?: boolean;
  style?: React.CSSProperties;
  focus?: V3;
  blur?: number;
  /** lebar zona tajam di sekitar titik fokus (satuan dunia) */
  focusRange?: number;
  dof?: boolean;
}> = ({children, bg, floor, style, focus, blur = 2.2, focusRange = 3.2, dof = true}) => {
  const {width, height} = useVideoConfig();
  const useDof = dof && ENABLE_DOF && focus !== undefined;
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="soft"
      dpr={1}
      style={{position: 'absolute', inset: 0, ...style}}
      gl={{antialias: !useDof, preserveDrawingBuffer: true, toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.0}}
      camera={{fov: 38, near: 0.1, far: 100, position: [0, 3, 9]}}
    >
      <Studio bg={bg} floor={floor} />
      {children}
      {useDof ? (
        <EffectComposer multisampling={4}>
          <DepthOfField target={focus} worldFocusRange={focusRange} bokehScale={blur} />
          <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        </EffectComposer>
      ) : null}
    </ThreeCanvas>
  );
};

/** Matikan global bila ingin render cepat (mis. preview di komputer lambat) */
export const ENABLE_DOF = true;
