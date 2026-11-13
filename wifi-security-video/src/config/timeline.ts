/**
 * TIMELINE UTAMA VIDEO
 * Batas scene disesuaikan dengan voice-over (public/audio/voiceover.mp3).
 * Semua waktu dalam DETIK. Ubah di sini untuk menggeser durasi scene.
 */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Konversi detik -> frame */
export const sec = (s: number) => Math.round(s * FPS);

export type SceneId = 'opening' | 'network' | 'evilTwin' | 'https' | 'closing';

export const SCENES: Record<SceneId, {start: number; end: number; tag: string; index: number}> = {
  opening: {start: 0, end: 7.4, tag: 'Wi-Fi Gratis di Kafe', index: 1},
  network: {start: 7.4, end: 20.6, tag: 'Cara Kerja Wi-Fi', index: 2},
  evilTwin: {start: 20.6, end: 37.4, tag: 'Evil Twin', index: 3},
  https: {start: 37.4, end: 46.9, tag: 'HTTPS & Enkripsi', index: 4},
  closing: {start: 46.9, end: 60, tag: 'Tips Aman', index: 5},
};

export const TOTAL_SECONDS = 60;
export const DURATION = sec(TOTAL_SECONDS);

/** Lama crossfade antar-scene (frame). Sama untuk semua scene agar konsisten. */
export const TRANSITION = 14;
