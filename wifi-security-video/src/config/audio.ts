/**
 * KONFIGURASI AUDIO
 * Letakkan file di folder public/audio/ dengan nama di bawah.
 * Jika file tidak ada, video tetap bisa dirender (tanpa audio tsb).
 */
export const AUDIO = {
  voiceover: {
    file: 'audio/voiceover.mp3',
    volume: 1,
    /** Geser voice-over (detik) bila rekaman dimulai lebih lambat/cepat */
    startAtSeconds: 0,
  },
  music: {
    file: 'audio/background-music.mp3',
    /** Volume musik saat TIDAK ada voice-over */
    volume: 0.32,
    /** Volume musik saat ada voice-over (ducking) */
    duckedVolume: 0.1,
    fadeInSeconds: 1.2,
    fadeOutSeconds: 2.5,
    loop: true,
  },
};
