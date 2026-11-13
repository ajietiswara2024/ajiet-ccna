/**
 * SUBTITLE / NARASI
 * - Waktu dalam detik (absolut terhadap video).
 * - Bungkus kata penting dengan *bintang* agar disorot warna kuning.
 * - Jaga setiap cue cukup pendek (maks. 2 baris).
 * Waktu sudah disinkronkan dengan voice-over saat ini. Jika voice-over diganti,
 * geser angka start/end di sini (lihat README: "Sinkronisasi subtitle").
 */
export type Cue = {start: number; end: number; text: string};

export const SUBTITLES: Cue[] = [
  // SCENE 1 — PEMBUKAAN (0–7,4 s)
  {start: 0.12, end: 2.28, text: 'Pernah nggak, masuk *kafe*, belum pesan makanan,'},
  {start: 2.28, end: 4.19, text: 'tapi sudah sibuk mencari *Wi-Fi*?'},
  {start: 4.19, end: 5.39, text: '*Kuota sekarat* memang bisa'},
  {start: 5.39, end: 7.4, text: 'mengubah *prioritas hidup* seseorang.'},

  // SCENE 2 — CARA KERJA WI-FI (7,4–20,6 s)
  {start: 7.46, end: 8.56, text: 'Tapi *tunggu dulu*.'},
  {start: 8.56, end: 9.69, text: 'Pernah kepikiran nggak,'},
  {start: 9.69, end: 12.33, text: '*siapa sebenarnya* yang menyediakan Wi-Fi itu?'},
  {start: 12.33, end: 14.31, text: 'Saat HP kamu terhubung ke Wi-Fi,'},
  {start: 14.31, end: 15.74, text: 'perangkat akan berkomunikasi'},
  {start: 15.74, end: 17.74, text: 'dengan alat bernama *access point*.'},
  {start: 17.74, end: 19.01, text: 'Alat inilah yang menghubungkan'},
  {start: 19.01, end: 20.6, text: 'perangkatmu ke *jaringan internet*.'},

  // SCENE 3 — EVIL TWIN (20,6–37,4 s)
  {start: 20.73, end: 22.9, text: 'Nah, masalahnya, ada jaringan Wi-Fi'},
  {start: 22.9, end: 24.81, text: 'yang sengaja dibuat *palsu*.'},
  {start: 24.81, end: 26.41, text: 'Namanya *Evil Twin*.'},
  {start: 26.41, end: 28.75, text: 'Jaringan ini dibuat *menyerupai Wi-Fi asli*,'},
  {start: 28.75, end: 30.28, text: 'supaya orang *terkecoh* dan terhubung'},
  {start: 30.28, end: 31.8, text: 'ke *jaringan milik penyerang*.'},
  {start: 31.8, end: 33.31, text: 'Bayangkan, kamu pikir sedang'},
  {start: 33.31, end: 34.89, text: 'terhubung ke *Wi-Fi kafe*,'},
  {start: 34.89, end: 36.22, text: 'ternyata malah masuk ke jaringan'},
  {start: 36.22, end: 37.4, text: '*orang yang tidak dikenal*.'},

  // SCENE 4 — HTTPS DAN ENKRIPSI (37,4–46,9 s)
  {start: 37.56, end: 38.43, text: 'Tapi *tenang*,'},
  {start: 38.43, end: 41.1, text: 'bukan berarti semua Wi-Fi publik *berbahaya*.'},
  {start: 41.1, end: 43.05, text: 'Koneksi *HTTPS* menggunakan *enkripsi*'},
  {start: 43.05, end: 44.82, text: 'untuk melindungi isi komunikasi'},
  {start: 44.82, end: 46.9, text: 'agar *tidak mudah dibaca* orang lain.'},

  // SCENE 5 — PENUTUP (46,9–60 s)
  {start: 47.09, end: 50.14, text: 'Jadi, pastikan *nama Wi-Fi benar* sebelum terhubung.'},
  {start: 50.14, end: 52.63, text: 'Jangan sembarangan memasukkan *informasi pribadi*.'},
  {start: 52.63, end: 55.27, text: 'Ingat, mencari Wi-Fi gratis itu *boleh*.'},
  {start: 55.27, end: 57.15, text: 'Tapi jangan sampai *keamanan data*'},
  {start: 57.15, end: 58.85, text: 'ikut kamu *gratiskan*.'},
];
