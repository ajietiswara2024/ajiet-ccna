import {Environment, Lightformer} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import React from 'react';
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
  floorColor = '#E6DCCB',
}) => (
  <>
    <color attach="background" args={[bg]} />
    <fog attach="fog" args={[bg, 13, 30]} />
    <hemisphereLight args={['#FFF7EA', '#BFAE93', 0.85]} />
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
    {floor ? (
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color={floorColor} roughness={0.95} />
      </mesh>
    ) : null}
  </>
);

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

/** Kanvas 3D standar untuk setiap scene */
export const Stage3D: React.FC<{children: React.ReactNode; bg?: string; floor?: boolean; style?: React.CSSProperties}> = ({
  children,
  bg,
  floor,
  style,
}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="soft"
      dpr={1}
      style={{position: 'absolute', inset: 0, ...style}}
      gl={{antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1.0}}
      camera={{fov: 38, near: 0.1, far: 100, position: [0, 3, 9]}}
    >
      <Studio bg={bg} floor={floor} />
      {children}
    </ThreeCanvas>
  );
};
