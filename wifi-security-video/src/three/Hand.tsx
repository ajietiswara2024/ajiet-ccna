import {RoundedBox} from '@react-three/drei';
import React from 'react';
import {C} from '../config/theme';

type GroupProps = React.ComponentProps<'group'>;

const Skin: React.FC = () => <meshPhysicalMaterial color={C.skin} roughness={0.55} sheen={0.6} sheenColor="#FFD9C0" />;

const Finger: React.FC<{position: [number, number, number]; rotation?: [number, number, number]; length?: number; r?: number}> = ({
  position,
  rotation = [0, 0, 0],
  length = 0.26,
  r = 0.058,
}) => (
  <mesh position={position} rotation={rotation} castShadow>
    <capsuleGeometry args={[r, length, 8, 16]} />
    <Skin />
  </mesh>
);

/**
 * Tangan stilistik minimalis yang menggenggam HP.
 * Koordinat lokal = koordinat HP (HP di origin, layar menghadap +Z).
 * `thumb` 0 = istirahat, 1 = menekan layar.
 */
export const Hand: React.FC<GroupProps & {thumb?: number}> = ({thumb = 0, ...g}) => {
  const thumbRot = 0.5 + (-0.42 - 0.5) * thumb; // rotasi Z
  const thumbZ = 0.1 + 0.02 * thumb;
  return (
    <group {...g}>
      {/* telapak di belakang HP */}
      <RoundedBox args={[0.66, 0.74, 0.2]} radius={0.09} smoothness={4} position={[0.06, -0.42, -0.16]} rotation={[0.05, 0, -0.08]} castShadow>
        <Skin />
      </RoundedBox>
      {/* ujung jari menggenggam sisi kanan */}
      {[0, 1, 2, 3].map((i) => (
        <Finger
          key={i}
          position={[0.4, -0.08 - i * 0.135, 0.005]}
          rotation={[0, 0.5, Math.PI / 2 + 0.06]}
          length={0.1 - (i === 3 ? 0.03 : 0)}
          r={0.052 - i * 0.003}
        />
      ))}
      {/* ibu jari: pivot di pangkal kiri bawah */}
      <group position={[-0.33, -0.52, thumbZ]} rotation={[0, 0, thumbRot]}>
        <mesh position={[0, 0.24, 0]} castShadow>
          <capsuleGeometry args={[0.062, 0.36, 8, 16]} />
          <Skin />
        </mesh>
      </group>
      <mesh position={[-0.36, -0.6, 0.03]} castShadow>
        <sphereGeometry args={[0.1, 24, 24]} />
        <Skin />
      </mesh>
      {/* pergelangan + lengan baju */}
      <mesh position={[0.12, -0.92, -0.17]} rotation={[0.25, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.2, 0.21, 0.4, 32]} />
        <Skin />
      </mesh>
      <mesh position={[0.55, -1.95, -0.45]} rotation={[0.25, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.27, 0.32, 2.0, 40]} />
        <meshPhysicalMaterial color={C.blue} roughness={0.75} sheen={0.8} sheenColor="#9CB8FF" />
      </mesh>
    </group>
  );
};
