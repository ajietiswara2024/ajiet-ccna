import {RoundedBox} from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';
import {C} from '../config/theme';

export const PHONE = {w: 0.78, h: 1.6, d: 0.085, screenW: 0.72, screenH: 1.54};

type GroupProps = React.ComponentProps<'group'>;

/** Smartphone minimalis. `screen` = tekstur kanvas layar. */
export const Phone: React.FC<GroupProps & {screen?: THREE.Texture; bodyColor?: string}> = ({
  screen,
  bodyColor = C.graphite,
  children,
  ...g
}) => (
  <group {...g}>
    <RoundedBox args={[PHONE.w, PHONE.h, PHONE.d]} radius={0.04} smoothness={5} castShadow receiveShadow>
      <meshPhysicalMaterial color={bodyColor} roughness={0.32} metalness={0.25} clearcoat={0.8} clearcoatRoughness={0.2} />
    </RoundedBox>
    {/* bezel kaca */}
    <mesh position={[0, 0, PHONE.d / 2 + 0.0005]}>
      <planeGeometry args={[PHONE.w - 0.03, PHONE.h - 0.03]} />
      <meshPhysicalMaterial color="#0E0F12" roughness={0.12} clearcoat={1} />
    </mesh>
    {/* layar */}
    <mesh position={[0, 0, PHONE.d / 2 + 0.0015]}>
      <planeGeometry args={[PHONE.screenW, PHONE.screenH]} />
      <meshBasicMaterial map={screen} transparent toneMapped={false} />
    </mesh>
    {/* kamera belakang */}
    <RoundedBox args={[0.3, 0.3, 0.03]} radius={0.012} smoothness={3} position={[-0.19, 0.57, -PHONE.d / 2 - 0.012]} castShadow>
      <meshPhysicalMaterial color="#3A3D45" roughness={0.3} clearcoat={1} />
    </RoundedBox>
    {[
      [-0.25, 0.63],
      [-0.13, 0.51],
    ].map(([x, y], i) => (
      <mesh key={i} position={[x, y, -PHONE.d / 2 - 0.03]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.045, 0.05, 0.02, 32]} />
        <meshPhysicalMaterial color="#111216" roughness={0.1} clearcoat={1} />
      </mesh>
    ))}
    {/* tombol samping */}
    <RoundedBox args={[0.015, 0.22, 0.03]} radius={0.006} position={[PHONE.w / 2 + 0.004, 0.3, 0]}>
      <meshStandardMaterial color="#3A3D45" roughness={0.4} metalness={0.3} />
    </RoundedBox>
    {children}
  </group>
);
