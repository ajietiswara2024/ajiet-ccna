# Folder audio

| File | Fungsi |
|------|--------|
| `voiceover.mp3` | Narasi (voice-over). Otomatis dipakai bila ada. |
| `background-music.mp3` | Musik latar. Otomatis di-*duck* (dikecilkan) saat ada voice-over. |

- Nama file **harus persis** seperti di atas (atau ubah di `src/config/audio.ts`).
- Jika file dihapus/tidak ada, video tetap bisa dirender tanpa audio tersebut.
- `background-music.mp3` saat ini adalah musik placeholder buatan skrip (`npm run music`), bebas hak cipta.
- Voice-over asli (sebelum diproses) disimpan di `audio-source/voiceover-original.mp3`.
