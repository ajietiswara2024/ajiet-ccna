import {RoundedBox} from '@react-three/drei';
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {C} from '../config/theme';
import {clamp01, mixColor} from '../lib/anim';

type GroupProps = React.ComponentProps<'group'>;

/** Ikon Wi-Fi 3D. level 0..3 (pecahan = transisi menyala) */
export const WifiIcon: React.FC<GroupProps & {level?: number; color?: string; dim?: string; glow?: number}> = ({
  level = 3,
  color = C.blue,
  dim = '#D3CABB',
  glow = 0.35,
  ...g
}) => {
  const radii = [0.36, 0.62, 0.88];
  const tube = 0.075;
  const dotOn = clamp01(level * 3);
  const dotCol = mixColor(dim, color, dotOn);
  return (
    <group {...g}>
      {radii.map((r, i) => {
        const on = clamp01(level - i);
        const col = mixColor(dim, color, on);
        const mat = <meshStandardMaterial color={col} emissive={col} emissiveIntensity={glow * on} roughness={0.35} />;
        return (
          <group key={i} position={[0, -0.05, 0]}>
            <mesh rotation-z={Math.PI / 4} castShadow>
              <torusGeometry args={[r, tube, 20, 72, Math.PI / 2]} />
              {mat}
            </mesh>
            {[Math.PI / 4, (3 * Math.PI) / 4].map((a, k) => (
              <mesh key={k} position={[Math.cos(a) * r, Math.sin(a) * r, 0]} castShadow>
                <sphereGeometry args={[tube, 20, 20]} />
                {mat}
              </mesh>
            ))}
          </group>
        );
      })}
      <mesh position={[0, -0.05, 0]} castShadow>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={dotCol} emissive={dotCol} emissiveIntensity={glow * dotOn} roughness={0.35} />
      </mesh>
    </group>
  );
};

/** Gembok 3D. closed 0 = terbuka, 1 = terkunci */
export const Padlock: React.FC<GroupProps & {closed?: number; color?: string; shine?: number}> = ({
  closed = 1,
  color = C.yellow,
  shine = 0,
  ...g
}) => {
  const open = 1 - clamp01(closed);
  return (
    <group {...g}>
      <RoundedBox args={[1.0, 0.82, 0.42]} radius={0.13} smoothness={5} castShadow receiveShadow>
        <meshPhysicalMaterial color={color} roughness={0.28} metalness={0.15} clearcoat={1} emissive={color} emissiveIntensity={0.15 * shine} />
      </RoundedBox>
      <mesh position={[0, 0.04, 0.212]}>
        <circleGeometry args={[0.085, 32]} />
        <meshStandardMaterial color="#3A3D45" />
      </mesh>
      <mesh position={[0, -0.09, 0.212]}>
        <planeGeometry args={[0.07, 0.18]} />
        <meshStandardMaterial color="#3A3D45" />
      </mesh>
      {/* shackle: pivot pada kaki kanan */}
      <group position={[0.28, open * 0.3, 0]} rotation-y={open * 0.9}>
        <group position={[-0.28, 0, 0]}>
          <mesh position={[0, 0.72, 0]} castShadow>
            <torusGeometry args={[0.28, 0.08, 20, 48, Math.PI]} />
            <meshStandardMaterial color="#B8BDC6" roughness={0.22} metalness={0.85} />
          </mesh>
          {[-0.28, 0.28].map((x) => (
            <mesh key={x} position={[x, 0.47, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.5, 24]} />
              <meshStandardMaterial color="#B8BDC6" roughness={0.22} metalness={0.85} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

/** Perisai keamanan dengan tanda centang */
export const Shield: React.FC<GroupProps & {color?: string; check?: number}> = ({color = C.blue, check = 1, ...g}) => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.6);
    s.bezierCurveTo(0.25, 0.45, 0.4, 0.43, 0.5, 0.43);
    s.bezierCurveTo(0.53, -0.05, 0.38, -0.4, 0, -0.62);
    s.bezierCurveTo(-0.38, -0.4, -0.53, -0.05, -0.5, 0.43);
    s.bezierCurveTo(-0.4, 0.43, -0.25, 0.45, 0, 0.6);
    const geom = new THREE.ExtrudeGeometry(s, {depth: 0.16, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 6, curveSegments: 48});
    geom.center();
    return geom;
  }, []);
  const c = clamp01(check);
  return (
    <group {...g}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      <group position={[0, 0, 0.16]} scale={c}>
        <RoundedBox args={[0.1, 0.3, 0.08]} radius={0.04} position={[-0.12, -0.04, 0]} rotation-z={0.75}>
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[0.1, 0.52, 0.08]} radius={0.04} position={[0.09, 0.05, 0]} rotation-z={-0.62}>
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </RoundedBox>
      </group>
    </group>
  );
};

/** Awan "Internet" */
export const Cloud: React.FC<GroupProps & {tint?: string}> = ({tint = '#FFFFFF', ...g}) => {
  const balls: [number, number, number, number][] = [
    [0, 0.12, 0, 0.62],
    [-0.62, -0.1, 0.05, 0.45],
    [0.66, -0.06, 0.02, 0.5],
    [-0.28, 0.42, -0.05, 0.42],
    [0.32, 0.38, 0.02, 0.4],
    [0, -0.2, 0.18, 0.45],
  ];
  return (
    <group {...g}>
      {balls.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 48, 48]} />
          <meshPhysicalMaterial color={tint} roughness={0.5} sheen={0.5} sheenColor="#DDE7FF" />
        </mesh>
      ))}
    </group>
  );
};
