import {RoundedBox} from '@react-three/drei';
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {C, cf} from '../config/theme';
import {wifiGlyph} from '../screens/draw';

const makeTex = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

/** Meja kafe bundar */
export const CafeTable: React.FC<React.ComponentProps<'group'>> = (g) => (
  <group {...g}>
    <mesh position={[0, 0.96, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1.55, 1.55, 0.08, 96]} />
      <meshPhysicalMaterial color={C.wood} roughness={0.55} clearcoat={0.35} />
    </mesh>
    <mesh position={[0, 0.48, 0]} castShadow>
      <cylinderGeometry args={[0.08, 0.1, 0.9, 32]} />
      <meshStandardMaterial color="#3A3D45" roughness={0.4} metalness={0.4} />
    </mesh>
    <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.55, 0.6, 0.04, 48]} />
      <meshStandardMaterial color="#3A3D45" roughness={0.4} metalness={0.4} />
    </mesh>
  </group>
);

/** Cangkir kopi + uap */
export const CoffeeCup: React.FC<React.ComponentProps<'group'> & {frame: number}> = ({frame, ...g}) => {
  const lathe = useMemo(() => {
    const pts = [
      [0.0, 0],
      [0.13, 0],
      [0.15, 0.02],
      [0.19, 0.24],
      [0.18, 0.25],
      [0.165, 0.04],
      [0.0, 0.04],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 64);
  }, []);
  return (
    <group {...g}>
      <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.28, 0.025, 64]} />
        <meshPhysicalMaterial color={C.offWhite} roughness={0.3} clearcoat={0.8} />
      </mesh>
      <mesh geometry={lathe} position={[0, 0.025, 0]} castShadow>
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.25} clearcoat={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.235, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.17, 48]} />
        <meshStandardMaterial color="#6B4428" roughness={0.3} />
      </mesh>
      <mesh position={[0.2, 0.15, 0]} rotation-z={-0.1} castShadow>
        <torusGeometry args={[0.065, 0.02, 12, 32]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.25} clearcoat={1} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const ph = (frame * 0.01 + i / 5) % 1;
        return (
          <mesh key={i} position={[Math.sin(frame * 0.05 + i * 2) * 0.04 * (1 + ph), 0.32 + ph * 0.6, 0]} scale={[1, 1.6, 1]}>
            <sphereGeometry args={[0.035 + ph * 0.05, 16, 16]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.16 * Math.sin(Math.PI * ph)} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Lampu gantung */
export const PendantLamp: React.FC<React.ComponentProps<'group'>> = (g) => (
  <group {...g}>
    <mesh position={[0, 1.2, 0]}>
      <cylinderGeometry args={[0.012, 0.012, 2.4, 8]} />
      <meshStandardMaterial color="#3A3D45" />
    </mesh>
    <mesh castShadow>
      <coneGeometry args={[0.42, 0.42, 64, 1, true]} />
      <meshStandardMaterial color={C.yellow} roughness={0.5} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, -0.16, 0]}>
      <sphereGeometry args={[0.12, 24, 24]} />
      <meshBasicMaterial color="#FFF6DA" toneMapped={false} />
    </mesh>
    <pointLight position={[0, -0.3, 0]} intensity={2.5} distance={4} color="#FFD999" />
  </group>
);

/** Kartu meja "FREE WI-FI" */
export const WifiTentCard: React.FC<React.ComponentProps<'group'>> = (g) => {
  const tex = useMemo(
    () =>
      makeTex(400, 300, (ctx) => {
        ctx.fillStyle = '#FFFDF9';
        ctx.fillRect(0, 0, 400, 300);
        wifiGlyph(ctx, 200, 140, 90, 3, C.blue);
        ctx.fillStyle = C.ink;
        ctx.textAlign = 'center';
        ctx.font = cf(800, 46);
        ctx.fillText('FREE WI-FI', 200, 212);
        ctx.font = cf(600, 26);
        ctx.fillStyle = '#6B707A';
        ctx.fillText('KafeKopi_Free', 200, 256);
      }),
    [],
  );
  return (
    <group {...g}>
      <mesh position={[0, 0.17, 0.08]} rotation-x={-0.42} castShadow>
        <boxGeometry args={[0.56, 0.42, 0.012]} />
        <meshStandardMaterial attach="material-0" color="#FFFDF9" />
        <meshStandardMaterial attach="material-1" color="#FFFDF9" />
        <meshStandardMaterial attach="material-2" color="#FFFDF9" />
        <meshStandardMaterial attach="material-3" color="#FFFDF9" />
        <meshStandardMaterial attach="material-4" map={tex} roughness={0.7} />
        <meshStandardMaterial attach="material-5" color="#F0E8DA" />
      </mesh>
      <mesh position={[0, 0.17, -0.08]} rotation-x={0.42} castShadow>
        <boxGeometry args={[0.56, 0.42, 0.012]} />
        <meshStandardMaterial color="#F0E8DA" />
      </mesh>
    </group>
  );
};

/** Dinding kafe + papan menu + rak */
export const CafeBackdrop: React.FC<React.ComponentProps<'group'>> = (g) => {
  const menu = useMemo(
    () =>
      makeTex(512, 640, (ctx) => {
        ctx.fillStyle = '#2E3440';
        ctx.fillRect(0, 0, 512, 640);
        ctx.fillStyle = C.yellow;
        ctx.textAlign = 'center';
        ctx.font = cf(800, 64);
        ctx.fillText('MENU', 256, 110);
        ctx.fillStyle = '#E9E3D8';
        ctx.textAlign = 'left';
        ctx.font = cf(600, 34);
        const items = [
          ['Kopi Susu', '18K'],
          ['Americano', '15K'],
          ['Latte', '22K'],
          ['Teh Tarik', '16K'],
          ['Roti Bakar', '20K'],
        ];
        items.forEach(([n, p], i) => {
          ctx.fillText(n, 60, 200 + i * 80);
          ctx.textAlign = 'right';
          ctx.fillText(p, 452, 200 + i * 80);
          ctx.textAlign = 'left';
        });
      }),
    [],
  );
  return (
    <group {...g}>
      <mesh position={[0, 3, 0]} receiveShadow>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#EFE6D7" roughness={0.95} />
      </mesh>
      {/* papan menu */}
      <RoundedBox args={[1.7, 2.1, 0.08]} radius={0.04} position={[-1.7, 3.1, 0.05]} castShadow>
        <meshStandardMaterial color="#D6B48C" roughness={0.6} />
      </RoundedBox>
      <mesh position={[-1.7, 3.1, 0.1]}>
        <planeGeometry args={[1.52, 1.9]} />
        <meshStandardMaterial map={menu} roughness={0.9} />
      </mesh>
      {/* rak + cangkir */}
      <RoundedBox args={[2.2, 0.08, 0.4]} radius={0.02} position={[1.9, 3.0, 0.2]} castShadow receiveShadow>
        <meshStandardMaterial color={C.wood} roughness={0.6} />
      </RoundedBox>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[1.2 + i * 0.45, 3.18, 0.2]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.28, 32]} />
          <meshPhysicalMaterial color={i % 2 ? C.blueSoft : C.offWhite} roughness={0.3} clearcoat={0.8} />
        </mesh>
      ))}
      {/* tanaman */}
      <group position={[3.0, 0, 1.2]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.38, 0.3, 0.7, 40]} />
          <meshStandardMaterial color={C.orange} roughness={0.8} />
        </mesh>
        {[
          [0, 1.15, 0, 0.42],
          [-0.28, 0.95, 0.1, 0.3],
          [0.28, 1.0, -0.05, 0.32],
          [0.05, 1.45, 0.05, 0.28],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <sphereGeometry args={[r, 32, 32]} />
            <meshStandardMaterial color="#A9B79B" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
