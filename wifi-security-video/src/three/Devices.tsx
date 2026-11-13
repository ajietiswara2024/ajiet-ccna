import {RoundedBox} from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';
import {C} from '../config/theme';

type GroupProps = React.ComponentProps<'group'>;

const Plastic: React.FC<{color?: string}> = ({color = C.offWhite}) => (
  <meshPhysicalMaterial color={color} roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.3} />
);

/** Alas silinder ala display produk */
export const Pedestal: React.FC<GroupProps & {height?: number; radius?: number; color?: string}> = ({
  height = 0.8,
  radius = 0.7,
  color = C.cream,
  ...g
}) => (
  <group {...g}>
    <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 64]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
    <mesh position={[0, height + 0.005, 0]} rotation-x={-Math.PI / 2} receiveShadow>
      <circleGeometry args={[radius - 0.02, 64]} />
      <meshStandardMaterial color="#FBF6EE" roughness={0.8} />
    </mesh>
  </group>
);

/** Access point berbentuk "puck" berdiri pada stand. */
export const AccessPoint: React.FC<GroupProps & {led?: string; ledPower?: number; bodyColor?: string}> = ({
  led = C.blue,
  ledPower = 1,
  bodyColor = C.offWhite,
  ...g
}) => (
  <group {...g}>
    {/* stand */}
    <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.32, 0.36, 0.06, 48]} />
      <Plastic color="#E9E3D8" />
    </mesh>
    <mesh position={[0, 0.3, -0.03]} rotation-x={-0.12} castShadow>
      <cylinderGeometry args={[0.05, 0.06, 0.5, 24]} />
      <Plastic color="#D8D1C4" />
    </mesh>
    {/* puck */}
    <group position={[0, 0.82, 0]} rotation-x={-0.12}>
      <mesh rotation-x={Math.PI / 2} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.6, 0.16, 72]} />
        <Plastic color={bodyColor} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, 0, 0.082]}>
        <cylinderGeometry args={[0.5, 0.5, 0.01, 72]} />
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.25} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <torusGeometry args={[0.2, 0.022, 16, 64]} />
        <meshStandardMaterial color={led} emissive={led} emissiveIntensity={1.6 * ledPower} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <circleGeometry args={[0.05, 32]} />
        <meshStandardMaterial color="#C9C3B8" />
      </mesh>
    </group>
  </group>
);

/** Router dengan antena dan lampu indikator */
export const Router: React.FC<GroupProps & {frame?: number; power?: number}> = ({frame = 0, power = 1, ...g}) => (
  <group {...g}>
    <RoundedBox args={[1.5, 0.3, 0.95]} radius={0.1} smoothness={4} position={[0, 0.15, 0]} castShadow receiveShadow>
      <Plastic />
    </RoundedBox>
    <mesh position={[0, 0.02, 0]} receiveShadow>
      <boxGeometry args={[1.3, 0.04, 0.8]} />
      <meshStandardMaterial color="#C9C3B8" />
    </mesh>
    {[0, 1, 2, 3, 4].map((i) => {
      const on = power * (0.45 + 0.55 * (Math.sin(frame * 0.35 + i * 1.7) > -0.2 ? 1 : 0));
      const col = i === 0 ? C.yellow : C.blue;
      return (
        <mesh key={i} position={[-0.44 + i * 0.22, 0.16, 0.476]}>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={2 * on} toneMapped={false} />
        </mesh>
      );
    })}
    {[-0.55, 0, 0.55].map((x, i) => (
      <group key={i} position={[x, 0.3, -0.38]} rotation={[-0.12, 0, (i - 1) * 0.22]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.8, 8, 16]} />
          <meshStandardMaterial color="#3A3D45" roughness={0.45} />
        </mesh>
      </group>
    ))}
  </group>
);

/** Server (rak) untuk tujuan data HTTPS */
export const Server: React.FC<GroupProps & {frame?: number}> = ({frame = 0, ...g}) => (
  <group {...g}>
    {[0, 1, 2].map((i) => (
      <group key={i} position={[0, 0.25 + i * 0.5, 0]}>
        <RoundedBox args={[1.2, 0.44, 0.95]} radius={0.07} smoothness={4} castShadow receiveShadow>
          <Plastic color={i === 2 ? '#FFFFFF' : C.offWhite} />
        </RoundedBox>
        <mesh position={[-0.12, 0, 0.478]}>
          <boxGeometry args={[0.6, 0.06, 0.01]} />
          <meshStandardMaterial color={C.blue} emissive={C.blue} emissiveIntensity={0.6 + 0.4 * Math.sin(frame * 0.2 + i)} toneMapped={false} />
        </mesh>
        {[0, 1].map((k) => (
          <mesh key={k} position={[0.36 + k * 0.11, 0, 0.478]}>
            <circleGeometry args={[0.03, 16]} />
            <meshStandardMaterial
              color={k ? C.yellow : C.blue}
              emissive={k ? C.yellow : C.blue}
              emissiveIntensity={Math.sin(frame * 0.4 + i * 2 + k) > 0 ? 2 : 0.3}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);

/** Laptop dengan layar bertekstur */
export const Laptop: React.FC<GroupProps & {screen?: THREE.Texture; open?: number}> = ({screen, open = 1, ...g}) => (
  <group {...g}>
    <RoundedBox args={[1.2, 0.05, 0.8]} radius={0.02} smoothness={3} position={[0, 0.025, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#8C9098" roughness={0.35} metalness={0.4} />
    </RoundedBox>
    <mesh position={[0, 0.052, 0.05]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1.0, 0.45]} />
      <meshStandardMaterial color="#5E626B" roughness={0.6} />
    </mesh>
    {/* engsel: open 0 = tertutup, 1 = terbuka */}
    <group position={[0, 0.05, -0.39]} rotation-x={Math.PI / 2 + (-0.25 - Math.PI / 2) * open}>
      <RoundedBox args={[1.2, 0.78, 0.035]} radius={0.015} smoothness={3} position={[0, 0.39, -0.018]} castShadow>
        <meshStandardMaterial color="#8C9098" roughness={0.35} metalness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.4, 0.001]}>
        <planeGeometry args={[1.08, 0.66]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
    </group>
  </group>
);
