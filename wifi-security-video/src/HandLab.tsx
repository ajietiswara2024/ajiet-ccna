import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Phone} from './three/Phone';
import {GripHand} from './three/RealHand';
import {CameraRig, Stage3D} from './three/Stage';

/**
 * Komposisi uji (tidak ikut video utama) untuk mengecek pose tangan.
 * Frame 0–29: tampak depan, 30–59: tampak samping. Ibu jari menekan di tengah.
 */
export const HandLab: React.FC = () => {
  const frame = useCurrentFrame();
  const thumb = interpolate(frame % 30, [0, 15, 29], [0, 1, 0]);
  return (
    <AbsoluteFill>
      <Stage3D floor={false}>
        <CameraRig position={frame >= 30 ? [3.2, 0.4, 0.6] : [0, 0.3, 3.6]} target={[0, -0.1, 0]} fov={34} />
        <Phone>
          <GripHand thumb={thumb} />
        </Phone>
      </Stage3D>
    </AbsoluteFill>
  );
};
