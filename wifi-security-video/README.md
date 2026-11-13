# WI-FI GRATIS, TAPI AMAN NGGAK? 🎬

Video edukasi keamanan Wi-Fi publik bergaya **Minimalist 3D Technical Explainer**.
Dibuat dengan **Remotion + React + TypeScript + React Three Fiber (Three.js)**.

| Spesifikasi | Nilai |
|---|---|
| Durasi | 60 detik (1800 frame) |
| Resolusi | 1080 × 1920 (9:16) |
| Frame rate | 30 FPS |
| Output | MP4 H.264 (`out/wifi-gratis-aman-nggak.mp4`) |
| Bahasa | Indonesia |

---

## 1. Menjalankan proyek

Prasyarat: **Node.js 18+** (diuji dengan Node 22) dan **ffmpeg** (hanya untuk skrip audio).

```bash
npm install          # pasang dependensi
npm run dev          # buka Remotion Studio (preview interaktif di browser)
npm run render       # render video final -> out/wifi-gratis-aman-nggak.mp4
npm run still        # render satu frame (PNG) untuk cek cepat
npm run typecheck    # cek TypeScript
```

### Kualitas visual 3D
- **Tangan realistis**: model rigged `public/models/hand-right.glb` (lisensi MIT). Pose jari dihitung dengan
  forward kinematics di `src/three/RealHand.tsx`. Komposisi **HandLab** di Remotion Studio dipakai untuk mengecek pose.
- **Depth of field** (blur latar ala foto produk) via `@react-three/postprocessing`. Atur per scene lewat
  `<Stage3D focus={...} focusRange={...} blur={...}>`, atau matikan global dengan `ENABLE_DOF = false`
  di `src/three/Stage.tsx` untuk render lebih cepat.

### Catatan render 3D (WebGL)
- `remotion.config.ts` memakai renderer OpenGL **`swangle`** (software), agar bisa render di server tanpa GPU.
  Di komputer dengan GPU, ganti ke `'angle'` agar jauh lebih cepat.
- Jika unduhan Chrome otomatis milik Remotion diblokir jaringan, pakai Chrome/Chromium lokal:
  ```bash
  REMOTION_BROWSER=/path/ke/chrome-headless-shell npm run render
  ```
- Atur jumlah thread: `npx remotion render WifiSecurity out/video.mp4 --concurrency=4`.

---

## 2. Struktur folder

```
wifi-security-video/
├── public/
│   ├── audio/
│   │   ├── voiceover.mp3            ← narasi (sudah terpasang, sudah disinkronkan)
│   │   ├── background-music.mp3     ← musik latar (placeholder buatan skrip)
│   │   └── README.md
│   ├── fonts/                       ← Plus Jakarta Sans & JetBrains Mono (lokal, SIL OFL)
│   └── models/hand-right.glb        ← model tangan (MIT, WebXR Input Profiles)
├── audio-source/voiceover-original.mp3   ← voice-over asli sebelum diproses
├── scripts/
│   ├── prepare-voiceover.sh         ← potong jeda awal + atur tempo voice-over
│   ├── generate-placeholder-music.py← buat musik latar placeholder
│   ├── preview-stills.mjs           ← render beberapa frame PNG untuk pengecekan
│   └── sheet.py                     ← gabungkan PNG jadi contact sheet
├── src/
│   ├── index.ts / Root.tsx          ← registrasi komposisi + deteksi file audio otomatis
│   ├── Video.tsx                    ← timeline utama (<Sequence> per scene + transisi)
│   ├── config/
│   │   ├── timeline.ts              ← batas waktu tiap scene (detik)
│   │   ├── subtitles.ts             ← teks & waktu subtitle (*kata* = sorot kuning)
│   │   ├── audio.ts                 ← nama file, volume, fade, ducking
│   │   └── theme.ts                 ← palet warna & font
│   ├── scenes/                      ← SATU KOMPONEN PER SCENE
│   │   ├── Scene1Opening.tsx        (0–7,4 s)  Kafe, tangan mengambil HP, pilih Wi-Fi
│   │   ├── Scene2Network.tsx        (7,4–20,6 s) HP → Access Point → Router → Internet
│   │   ├── Scene3EvilTwin.tsx       (20,6–37,4 s) Wi-Fi asli vs palsu, penyerang
│   │   ├── Scene4Https.tsx          (37,4–46,9 s) Paket data terenkripsi + gembok
│   │   └── Scene5Closing.tsx        (46,9–60 s) Checklist aman, judul, kredit
│   ├── three/                       ← model 3D buatan kode (tanpa aset eksternal)
│   │   ├── Stage.tsx                (studio lighting, bayangan lembut, kamera)
│   │   ├── Phone.tsx, Devices.tsx, Symbols.tsx, Cafe.tsx, Attacker.tsx
│   │   ├── RealHand.tsx             (tangan 3D realistis ter-rig + pose genggam HP)
│   │   ├── Effects.tsx              (gelombang sinyal, aliran data, glow)
│   │   └── Label3D.tsx, useCanvasTexture.ts
│   ├── screens/draw.ts              ← UI layar HP (Canvas 2D → tekstur 3D)
│   ├── ui/                          ← subtitle, tag scene, progress bar, chip, ikon
│   ├── audio/AudioLayer.tsx         ← voice-over + musik (fade & ducking)
│   └── lib/anim.ts                  ← helper interpolate / spring / keyframe kamera
└── out/                             ← hasil render
```

---

## 3. Mengganti voice-over

1. Siapkan rekaman narasi (MP3).
2. **Cara cepat:** salin langsung ke `public/audio/voiceover.mp3`.
3. **Jika durasinya tidak pas 60 detik**, gunakan skrip (memotong jeda awal & mengatur tempo tanpa mengubah nada):
   ```bash
   # bash scripts/prepare-voiceover.sh <input.mp3> <TEMPO> <POTONG_AWAL_DETIK>
   bash scripts/prepare-voiceover.sh rekaman-saya.mp3 1.0 0.3
   ```
   Voice-over saat ini: rekaman asli 68,1 dtk → dipotong 0,75 dtk + tempo 1,15× → 58,6 dtk.
4. Geser voice-over tanpa mengedit file: ubah `startAtSeconds` di `src/config/audio.ts`.
5. Render ulang: `npm run render`.

> Video mendeteksi file audio secara otomatis (`calculateMetadata` di `Root.tsx`).
> Jika file tidak ada, video tetap dirender — subtitle tetap tampil.

### Sinkronisasi subtitle
Edit `src/config/subtitles.ts`. Setiap baris berisi `start`/`end` (detik) dan teks.
Bungkus kata penting dengan `*bintang*` agar disorot kuning. Jaga tiap cue ≤ ±50 karakter (maks. 2 baris).

Tip mencari waktu jeda di rekaman baru:
```bash
ffmpeg -i public/audio/voiceover.mp3 -af silencedetect=noise=-38dB:d=0.18 -f null - 2>&1 | grep silence_
```
Jika waktu narasi bergeser jauh, sesuaikan juga batas scene di `src/config/timeline.ts`
dan konstanta `T` (frame lokal) di bagian atas setiap file `src/scenes/*.tsx`.

---

## 4. Mengganti musik latar

1. Simpan musik ke `public/audio/background-music.mp3` (otomatis di-loop bila lebih pendek).
2. Atur volume di `src/config/audio.ts`:
   - `volume` — volume saat **tanpa** voice-over
   - `duckedVolume` — volume saat ada voice-over (default 0,1)
   - `fadeInSeconds` / `fadeOutSeconds`
3. Buat ulang musik placeholder kapan saja: `npm run music`.

---

## 5. Mengedit konten

| Ingin mengubah… | File |
|---|---|
| Durasi/urutan scene | `src/config/timeline.ts`, `src/Video.tsx` |
| Teks subtitle | `src/config/subtitles.ts` |
| Warna & font | `src/config/theme.ts` |
| Nama Wi-Fi asli/palsu | `REAL_SSID` / `FAKE_SSID` di `Scene3EvilTwin.tsx` |
| Daftar Wi-Fi di HP | `CAFE_NETWORKS` di `Scene1Opening.tsx` |
| Kredit kreator | `CREDIT` di `Scene5Closing.tsx` |
| Tampilan layar HP | `src/screens/draw.ts` |
| Gerak kamera | `kf(...)` keyframe di tiap scene |

Semua animasi deterministik (berbasis `useCurrentFrame`, `interpolate`, `spring`), sehingga hasil render selalu identik dengan preview.

---

Created by **@andiajietiswaraputra**
