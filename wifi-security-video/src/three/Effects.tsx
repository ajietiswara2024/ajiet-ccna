import React, {useMemo} from 'react';
import * as THREE from 'three';
import {C} from '../config/theme';
import type {V3} from '../lib/anim';

type GroupProps = React.ComponentProps<'group'>;

let glowTex: THREE.Texture | null = null;
const getGlow = () => {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  return glowTex;
};

/** Halo cahaya lembut */
export const Glow: React.FC<{position?: V3; size?: number; color?: string; opacity?: number}> = ({
  position = [0, 0, 0],
  size = 0.5,
  color = C.blue,
  opacity = 0.8,
}) => (
  <sprite position={position} scale={[size, size, 1]} renderOrder={5}>
    <spriteMaterial map={getGlow()} color={color} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
  </sprite>
);

/**
 * Gelombang sinyal nirkabel: busur-busur yang mengembang.
 * Arah default: +X. Putar group untuk mengarahkan.
 */
export const SignalWaves: React.FC<
  GroupProps & {frame: number; color?: string; count?: number; maxR?: number; arc?: number; speed?: number; opacity?: number}
> = ({frame, color = C.blue, count = 4, maxR = 2.2, arc = Math.PI / 2.4, speed = 0.02, opacity = 1, ...g}) => {
  if (opacity <= 0.001) return null;
  return (
    <group {...g}>
      {new Array(count).fill(0).map((_, i) => {
        const ph = (frame * speed + i / count) % 1;
        const r = 0.25 + ph * maxR;
        const a = Math.sin(Math.PI * ph) * opacity;
        return (
          <mesh key={i} rotation-z={-arc / 2}>
            <torusGeometry args={[r, 0.03 + 0.02 * (1 - ph), 8, 48, arc]} />
            <meshBasicMaterial color={color} transparent opacity={a} depthWrite={false} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * Garis koneksi (tube) dengan paket data berupa titik cahaya yang mengalir.
 */
export const FlowLine: React.FC<{
  points: V3[];
  frame: number;
  progress?: number;
  color?: string;
  pulseColor?: string;
  pulses?: number;
  speed?: number;
  radius?: number;
  lineOpacity?: number;
  pulseSize?: number;
  opacity?: number;
}> = ({
  points,
  frame,
  progress = 1,
  color = '#CFC6B6',
  pulseColor = C.blue,
  pulses = 3,
  speed = 0.012,
  radius = 0.028,
  lineOpacity = 1,
  pulseSize = 0.075,
  opacity = 1,
}) => {
  const key = JSON.stringify(points);
  const {curve, geometry} = useMemo(() => {
    const cv = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    const geo = new THREE.TubeGeometry(cv, 160, radius, 12, false);
    return {curve: cv, geometry: geo};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, radius]);
  const total = geometry.index ? geometry.index.count : 0;
  const p = Math.max(0, Math.min(1, progress));
  geometry.setDrawRange(0, Math.floor((total * p) / 6) * 6);
  if (opacity <= 0.001 || p <= 0) return null;
  return (
    <group>
      <mesh geometry={geometry} castShadow={lineOpacity > 0.9}>
        <meshStandardMaterial color={color} roughness={0.5} transparent={lineOpacity < 1 || opacity < 1} opacity={lineOpacity * opacity} />
      </mesh>
      {new Array(pulses).fill(0).map((_, k) => {
        const u = (frame * speed + k / pulses) % 1;
        if (u > p) return null;
        const pos = curve.getPointAt(u);
        const fade = Math.min(1, u * 8, (1 - u) * 8) * opacity;
        return (
          <group key={k} position={pos}>
            <mesh>
              <sphereGeometry args={[pulseSize, 20, 20]} />
              <meshBasicMaterial color={pulseColor} transparent opacity={fade} toneMapped={false} />
            </mesh>
            <Glow size={pulseSize * 6} color={pulseColor} opacity={0.55 * fade} />
          </group>
        );
      })}
    </group>
  );
};

/** Ambil titik pada kurva (untuk menempatkan objek di sepanjang jalur) */
export const curvePoint = (points: V3[], u: number): V3 => {
  const cv = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const v = cv.getPointAt(Math.max(0, Math.min(1, u)));
  return [v.x, v.y, v.z];
};
