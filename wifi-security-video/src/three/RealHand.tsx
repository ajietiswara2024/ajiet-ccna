import {useLoader} from '@react-three/fiber';
import React, {useMemo} from 'react';
import {staticFile} from 'remotion';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {clone as cloneSkinned} from 'three/examples/jsm/utils/SkeletonUtils.js';
import {C} from '../config/theme';

/**
 * Tangan 3D realistis (model rigged MIT dari WebXR Input Profiles).
 * Tulang pada model ini tidak bertingkat, jadi tekukan jari dihitung
 * dengan forward kinematics sederhana di sini.
 */
export type FingerName = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
/** Sudut tekuk (radian) per sendi: [metacarpal, proksimal, (tengah), distal] */
export type HandPose = Partial<Record<FingerName, number[]>> & {spread?: number; thumbAxis?: [number, number, number]};

const CHAINS: Record<FingerName, string[]> = {
  thumb: ['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip'],
  index: ['index-finger-metacarpal', 'index-finger-phalanx-proximal', 'index-finger-phalanx-intermediate', 'index-finger-phalanx-distal', 'index-finger-tip'],
  middle: ['middle-finger-metacarpal', 'middle-finger-phalanx-proximal', 'middle-finger-phalanx-intermediate', 'middle-finger-phalanx-distal', 'middle-finger-tip'],
  ring: ['ring-finger-metacarpal', 'ring-finger-phalanx-proximal', 'ring-finger-phalanx-intermediate', 'ring-finger-phalanx-distal', 'ring-finger-tip'],
  pinky: ['pinky-finger-metacarpal', 'pinky-finger-phalanx-proximal', 'pinky-finger-phalanx-intermediate', 'pinky-finger-phalanx-distal', 'pinky-finger-tip'],
};

/** Sumbu tekuk lokal tiap sendi (dapat dikalibrasi) */
export const BEND_AXIS = new THREE.Vector3(1, 0, 0);
export const THUMB_AXIS = new THREE.Vector3(1, 0, 0);

const tmpQ = new THREE.Quaternion();
const tmpV = new THREE.Vector3();
const tmpAxis = new THREE.Vector3();

export const RealHand: React.FC<React.ComponentProps<'group'> & {pose?: HandPose; color?: string}> = ({pose = {}, color = C.skin, ...g}) => {
  const gltf = useLoader(GLTFLoader, staticFile('models/hand-right.glb'));
  const {root, bones, rest} = useMemo(() => {
    const r = cloneSkinned(gltf.scene) as THREE.Object3D;
    const b: Record<string, THREE.Bone> = {};
    r.traverse((o) => {
      if ((o as THREE.Bone).isBone) b[o.name] = o as THREE.Bone;
      const m = o as THREE.SkinnedMesh;
      if (m.isSkinnedMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        m.frustumCulled = false;
        m.material = new THREE.MeshPhysicalMaterial({color, roughness: 0.55, sheen: 0.7, sheenColor: new THREE.Color('#FFD7C2'), sheenRoughness: 0.6});
      }
    });
    const rs: Record<string, {p: THREE.Vector3; q: THREE.Quaternion}> = {};
    Object.values(b).forEach((bn) => (rs[bn.name] = {p: bn.position.clone(), q: bn.quaternion.clone()}));
    return {root: r, bones: b, rest: rs};
  }, [gltf, color]);

  // Forward kinematics per jari
  (Object.keys(CHAINS) as FingerName[]).forEach((finger) => {
    const chain = CHAINS[finger];
    const angles = pose[finger] ?? [];
    const cum = new THREE.Quaternion(); // rotasi kumulatif (ruang armature)
    let prevNew = rest[chain[0]].p.clone();
    chain.forEach((name, k) => {
      const bn = bones[name];
      const r = rest[name];
      if (!bn || !r) return;
      if (k > 0) {
        const prevRest = rest[chain[k - 1]].p;
        tmpV.copy(r.p).sub(prevRest).applyQuaternion(cum);
        prevNew = prevNew.clone().add(tmpV);
      }
      const a = angles[k] ?? 0;
      if (a !== 0 || (k === 1 && pose.spread && finger !== 'thumb')) {
        const axis = (finger === 'thumb' ? (pose.thumbAxis ? tmpAxis.set(...pose.thumbAxis) : THUMB_AXIS) : BEND_AXIS).clone().applyQuaternion(r.q).applyQuaternion(cum).normalize();
        cum.premultiply(tmpQ.setFromAxisAngle(axis, a));
      }
      bn.position.copy(prevNew);
      bn.quaternion.copy(cum).multiply(r.q);
    });
  });

  return (
    <group {...g}>
      <primitive object={root} />
    </group>
  );
};

/**
 * Orientasi dasar agar tangan kanan menggenggam HP:
 * telapak menghadap punggung HP (+Z lokal HP), jari ke kiri (-X), ibu jari ke atas.
 */
export const GRIP_QUATERNION = new THREE.Quaternion().setFromRotationMatrix(
  new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, -1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0)),
);

/** Pose genggam HP yang sudah dikalibrasi (lihat komposisi HandLab) */
export const GRIP = {position: [0.32, -0.42, -0.5] as [number, number, number], rotationZ: -0.45, scale: 9.8};
const FINGERS_GRIP = {index: [0, 0.4, 0.92, 0.35], middle: [0, 0.5, 1.12, 0.45], ring: [0, 0.55, 1.12, 0.45], pinky: [0, 0.6, 1.08, 0.45]};
const THUMB_REST = [-0.35, -0.1, 0];
const THUMB_TAP = [-0.95, -0.35, -0.22];

/**
 * Tangan yang menggenggam HP. Pasang sebagai child dari <Phone>.
 * `thumb` 0 = istirahat di sisi kanan, 1 = menekan layar.
 */
export const GripHand: React.FC<React.ComponentProps<'group'> & {thumb?: number}> = ({thumb = 0, ...g}) => {
  const t = Math.max(0, Math.min(1, thumb));
  const thumbPose = THUMB_REST.map((v, i) => v + (THUMB_TAP[i] - v) * t);
  return (
    <group {...g}>
      <group position={GRIP.position} rotation-z={GRIP.rotationZ} scale={[1, 1, -1]}>
        <RealHand scale={GRIP.scale} quaternion={GRIP_QUATERNION} pose={{...FINGERS_GRIP, thumb: thumbPose, thumbAxis: [0, 1, 0]}} />
      </group>
    </group>
  );
};
