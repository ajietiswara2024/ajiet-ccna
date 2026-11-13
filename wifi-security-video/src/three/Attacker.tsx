import React from 'react';
import {C} from '../config/theme';

/** Sosok penyerang ber-hoodie (minimalis, tanpa wajah) */
export const Attacker: React.FC<React.ComponentProps<'group'> & {eyes?: number}> = ({eyes = 1, ...g}) => (
  <group {...g}>
    <mesh position={[0, 0.7, 0]} castShadow>
      <capsuleGeometry args={[0.46, 0.55, 10, 32]} />
      <meshStandardMaterial color="#3E414A" roughness={0.85} />
    </mesh>
    <mesh position={[0, 1.62, 0]} castShadow>
      <sphereGeometry args={[0.4, 40, 40]} />
      <meshStandardMaterial color="#3E414A" roughness={0.85} />
    </mesh>
    <mesh position={[0, 1.58, 0.2]} scale={[1, 1.1, 0.6]}>
      <sphereGeometry args={[0.28, 32, 32]} />
      <meshStandardMaterial color="#14151A" roughness={1} />
    </mesh>
    {[-0.09, 0.09].map((x) => (
      <mesh key={x} position={[x, 1.62, 0.37]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color={C.orange} transparent opacity={eyes} toneMapped={false} />
      </mesh>
    ))}
  </group>
);
