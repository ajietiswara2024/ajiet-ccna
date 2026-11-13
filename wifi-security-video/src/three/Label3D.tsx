import React, {useMemo} from 'react';
import * as THREE from 'three';
import {C, cf} from '../config/theme';
import {checkGlyph, crossGlyph, hexA} from '../screens/draw';
import type {V3} from '../lib/anim';

type Variant = 'light' | 'blue' | 'orange' | 'dark' | 'yellow';

const STYLES: Record<Variant, {bg: string; fg: string; dot: string}> = {
  light: {bg: '#FFFEFB', fg: C.ink, dot: C.blue},
  blue: {bg: C.blue, fg: '#FFFFFF', dot: '#FFFFFF'},
  orange: {bg: C.orange, fg: '#FFFFFF', dot: '#FFFFFF'},
  dark: {bg: C.ink, fg: '#FFFFFF', dot: C.yellow},
  yellow: {bg: C.yellow, fg: C.ink, dot: C.ink},
};

/**
 * Label berbentuk "pill" yang selalu menghadap kamera (sprite).
 */
export const Label3D: React.FC<{
  text: string;
  position: V3;
  height?: number;
  opacity?: number;
  variant?: Variant;
  icon?: 'dot' | 'check' | 'cross' | 'none';
  mono?: boolean;
}> = ({text, position, height = 0.34, opacity = 1, variant = 'light', icon = 'dot', mono = false}) => {
  const {texture, aspect} = useMemo(() => {
    const st = STYLES[variant];
    const H = 160;
    const fontSize = 76;
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d')!;
    const font = cf(800, fontSize, mono ? 'JetBrains Mono' : undefined);
    ctx.font = font;
    const tw = ctx.measureText(text).width;
    const iconW = icon === 'none' ? 0 : 74;
    const W = Math.ceil(tw + iconW + 100);
    c.width = W + 20;
    c.height = H + 20;
    ctx.translate(10, 10);
    ctx.fillStyle = st.bg;
    ctx.beginPath();
    ctx.roundRect(3, 3, W - 6, H - 6, H / 2);
    ctx.fill();
    if (variant === 'light' || variant === 'yellow') {
      ctx.strokeStyle = 'rgba(34,37,43,0.85)';
      ctx.lineWidth = 6;
      ctx.stroke();
    }
    const x0 = 50;
    if (icon === 'dot') {
      ctx.fillStyle = hexA(st.dot, 0.25);
      ctx.beginPath();
      ctx.arc(x0 + 22, H / 2, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = st.dot;
      ctx.beginPath();
      ctx.arc(x0 + 22, H / 2, 14, 0, Math.PI * 2);
      ctx.fill();
    } else if (icon === 'check') checkGlyph(ctx, x0 + 22, H / 2, 64, st.dot);
    else if (icon === 'cross') crossGlyph(ctx, x0 + 22, H / 2, 64, st.dot);
    ctx.font = font;
    ctx.fillStyle = st.fg;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x0 + iconW, H / 2 + 4);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return {texture: t, aspect: c.width / c.height};
  }, [text, variant, icon, mono]);

  if (opacity <= 0.001) return null;
  return (
    <sprite position={position} scale={[height * aspect, height, 1]} renderOrder={20}>
      <spriteMaterial map={texture} transparent opacity={opacity} depthTest={false} depthWrite={false} toneMapped={false} />
    </sprite>
  );
};
