import {useMemo} from 'react';
import * as THREE from 'three';

/**
 * Membuat CanvasTexture yang digambar ulang setiap render (deterministik per frame).
 */
export const useCanvasTexture = (
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) => {
  const {canvas, texture} = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    return {canvas: c, texture: t};
  }, [width, height]);

  const ctx = canvas.getContext('2d')!;
  ctx.save();
  ctx.clearRect(0, 0, width, height);
  draw(ctx, width, height);
  ctx.restore();
  texture.needsUpdate = true;
  return texture;
};
