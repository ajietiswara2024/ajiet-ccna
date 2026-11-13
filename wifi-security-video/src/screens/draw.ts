/**
 * Penggambar UI layar smartphone (Canvas 2D).
 * Hasilnya dipakai sebagai tekstur pada layar HP 3D.
 * Resolusi kanvas mengikuti rasio layar HP: 720 x 1540.
 */
import {C, cf, MONO} from '../config/theme';

export const SW = 720;
export const SH = 1540;

type Ctx = CanvasRenderingContext2D;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

export const rr = (ctx: Ctx, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

/* ------------------------------------------------------------------ */
/* Glyph / ikon                                                        */
/* ------------------------------------------------------------------ */

/** Ikon Wi-Fi. (cx, cy) = titik bawah. level 0..3 */
export const wifiGlyph = (ctx: Ctx, cx: number, cy: number, size: number, level: number, color: string, dim = 'rgba(30,32,38,0.16)') => {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineWidth = size * 0.14;
  for (let i = 1; i <= 3; i++) {
    const r = size * (0.12 + i * 0.29);
    ctx.strokeStyle = i <= level ? color : dim;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();
  }
  ctx.fillStyle = level > 0 ? color : dim;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

/** Gembok kecil. (x, y) = pusat */
export const lockGlyph = (ctx: Ctx, x: number, y: number, s: number, color: string) => {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.14;
  rr(ctx, x - s * 0.42, y - s * 0.1, s * 0.84, s * 0.62, s * 0.14);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y - s * 0.1, s * 0.26, Math.PI, 0);
  ctx.stroke();
  ctx.restore();
};

export const checkGlyph = (ctx: Ctx, x: number, y: number, s: number, color: string, progress = 1) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const p = clamp01(progress);
  const a = [x - s * 0.32, y + s * 0.02];
  const b = [x - s * 0.08, y + s * 0.26];
  const c = [x + s * 0.36, y - s * 0.24];
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  if (p < 0.4) {
    const t = p / 0.4;
    ctx.lineTo(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t);
  } else {
    ctx.lineTo(b[0], b[1]);
    const t = (p - 0.4) / 0.6;
    ctx.lineTo(b[0] + (c[0] - b[0]) * t, b[1] + (c[1] - b[1]) * t);
  }
  ctx.stroke();
  ctx.restore();
};

export const crossGlyph = (ctx: Ctx, x: number, y: number, s: number, color: string) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.16;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.26, y - s * 0.26);
  ctx.lineTo(x + s * 0.26, y + s * 0.26);
  ctx.moveTo(x + s * 0.26, y - s * 0.26);
  ctx.lineTo(x - s * 0.26, y + s * 0.26);
  ctx.stroke();
  ctx.restore();
};

export const shieldPath = (ctx: Ctx, x: number, y: number, s: number) => {
  ctx.beginPath();
  ctx.moveTo(x, y - s * 0.5);
  ctx.bezierCurveTo(x + s * 0.2, y - s * 0.38, x + s * 0.34, y - s * 0.36, x + s * 0.42, y - s * 0.36);
  ctx.bezierCurveTo(x + s * 0.44, y + s * 0.05, x + s * 0.32, y + s * 0.34, x, y + s * 0.52);
  ctx.bezierCurveTo(x - s * 0.32, y + s * 0.34, x - s * 0.44, y + s * 0.05, x - s * 0.42, y - s * 0.36);
  ctx.bezierCurveTo(x - s * 0.34, y - s * 0.36, x - s * 0.2, y - s * 0.38, x, y - s * 0.5);
  ctx.closePath();
};

const spinner = (ctx: Ctx, x: number, y: number, r: number, frame: number, color: string) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const a = frame * 0.22;
  ctx.beginPath();
  ctx.arc(x, y, r, a, a + Math.PI * 1.3);
  ctx.stroke();
  ctx.restore();
};

/* ------------------------------------------------------------------ */
/* Kerangka layar                                                      */
/* ------------------------------------------------------------------ */

export const beginScreen = (ctx: Ctx, bg: string | CanvasGradient) => {
  ctx.save();
  rr(ctx, 0, 0, SW, SH, 70);
  ctx.clip();
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SW, SH);
};

export const endScreen = (ctx: Ctx, dark = false) => {
  // dynamic island
  ctx.fillStyle = '#0C0D10';
  rr(ctx, SW / 2 - 96, 24, 192, 56, 28);
  ctx.fill();
  // home indicator
  ctx.fillStyle = dark ? 'rgba(255,255,255,0.7)' : 'rgba(20,22,26,0.75)';
  rr(ctx, SW / 2 - 120, SH - 34, 240, 10, 5);
  ctx.fill();
  ctx.restore();
};

export const statusBar = (ctx: Ctx, opts: {dark?: boolean; wifi?: number; wifiColor?: string; lowData?: boolean} = {}) => {
  const col = opts.dark ? '#FFFFFF' : '#16181D';
  ctx.save();
  ctx.fillStyle = col;
  ctx.font = cf(700, 30);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('09:41', 66, 54);
  // sinyal seluler
  for (let i = 0; i < 4; i++) {
    ctx.globalAlpha = opts.lowData && i > 0 ? 0.25 : 1;
    rr(ctx, 470 + i * 13, 62 - (i + 1) * 6, 9, (i + 1) * 6, 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (opts.wifi !== undefined && opts.wifi > 0) {
    wifiGlyph(ctx, 548, 66, 30, opts.wifi, opts.wifiColor ?? col, 'rgba(0,0,0,0)');
  }
  // baterai
  ctx.strokeStyle = col;
  ctx.lineWidth = 2.5;
  ctx.globalAlpha = 0.6;
  rr(ctx, 590, 41, 54, 26, 8);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = col;
  rr(ctx, 594, 45, 34, 18, 5);
  ctx.fill();
  ctx.restore();
};

/* ------------------------------------------------------------------ */
/* Layar 1: Lock screen + notifikasi kuota                              */
/* ------------------------------------------------------------------ */

export const drawLockScreen = (ctx: Ctx, o: {notif: number; glow: number}) => {
  const g = ctx.createLinearGradient(0, 0, 0, SH);
  g.addColorStop(0, '#DCE6FA');
  g.addColorStop(0.55, '#F2E7D6');
  g.addColorStop(1, '#F6D9B8');
  beginScreen(ctx, g);
  statusBar(ctx, {lowData: true});
  ctx.fillStyle = '#1D2026';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = cf(600, 34);
  ctx.fillText('Jumat, 13 November', SW / 2, 250);
  ctx.font = cf(800, 190);
  ctx.fillText('09:41', SW / 2, 440);

  // Notifikasi kuota
  const t = easeOut(o.notif);
  if (t > 0) {
    ctx.save();
    ctx.globalAlpha = t;
    ctx.translate(0, (1 - t) * 40);
    ctx.fillStyle = 'rgba(255,255,255,0.86)';
    ctx.shadowColor = 'rgba(0,0,0,0.12)';
    ctx.shadowBlur = 30;
    rr(ctx, 40, 560, SW - 80, 190, 40);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = C.orange;
    rr(ctx, 72, 598, 76, 76, 20);
    ctx.fill();
    // ikon sinyal kosong
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 4; i++) {
      ctx.globalAlpha = t * (i === 0 ? 1 : 0.35);
      rr(ctx, 88 + i * 12, 660 - (i + 1) * 11, 8, (i + 1) * 11, 2);
      ctx.fill();
    }
    ctx.globalAlpha = t;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1D2026';
    ctx.font = cf(800, 31);
    ctx.fillText('Kuota hampir habis!', 172, 628);
    ctx.font = cf(500, 27);
    ctx.fillStyle = '#4A4E57';
    ctx.fillText('Sisa kuota kamu tinggal', 172, 672);
    ctx.fillStyle = C.orangeDeep;
    ctx.font = cf(800, 27);
    ctx.fillText('0,2 MB', 172, 712);
    ctx.restore();
  }
  // glow layar saat menyala
  if (o.glow > 0) {
    ctx.fillStyle = `rgba(255,255,255,${0.5 * o.glow})`;
    ctx.fillRect(0, 0, SW, SH);
  }
  endScreen(ctx);
};

/* ------------------------------------------------------------------ */
/* Layar 2: daftar jaringan Wi-Fi                                       */
/* ------------------------------------------------------------------ */

export type WifiItem = {
  name: string;
  secure: boolean;
  level: number;
  /** index karakter yang berbeda (untuk menyorot nama palsu) */
  diffChar?: number;
  danger?: boolean;
};

export type WifiListOpts = {
  items: WifiItem[];
  /** 0..items.length (pecahan = animasi masuk) */
  reveal: number;
  frame: number;
  scanning?: boolean;
  selected?: number;
  selectT?: number;
  tap?: number;
  status?: string;
  statusColor?: string;
  markDiff?: number;
  /** posisi X riak tap (px kanvas) */
  tapX?: number;
  banner?: {title: string; body: string; color: string; t: number; icon: 'warn' | 'ok'};
};

export const LIST_TOP = 470;
export const ROW_H = 124;

export const drawWifiList = (ctx: Ctx, o: WifiListOpts) => {
  beginScreen(ctx, '#F2EFE9');
  const sel = o.selected ?? -1;
  const connectedLevel = sel >= 0 && o.statusColor ? 3 : 0;
  statusBar(ctx, {lowData: true, wifi: connectedLevel, wifiColor: o.statusColor});

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = C.blue;
  ctx.font = cf(600, 30);
  ctx.fillText('‹ Pengaturan', 40, 140);
  ctx.fillStyle = '#16181D';
  ctx.font = cf(800, 70);
  ctx.fillText('Wi-Fi', 40, 222);

  // toggle card
  ctx.fillStyle = '#FFFFFF';
  rr(ctx, 30, 282, SW - 60, 100, 28);
  ctx.fill();
  ctx.fillStyle = '#16181D';
  ctx.font = cf(700, 34);
  ctx.fillText('Wi-Fi', 64, 332);
  ctx.fillStyle = '#34C27A';
  rr(ctx, SW - 160, 306, 100, 54, 27);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(SW - 87, 333, 23, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#8B9099';
  ctx.font = cf(700, 24);
  ctx.fillText('JARINGAN TERSEDIA', 52, 440);
  if (o.scanning) spinner(ctx, SW - 70, 440, 14, o.frame, '#8B9099');

  const n = o.items.length;
  const shown = Math.min(n, Math.ceil(o.reveal));
  if (shown > 0) {
    const cardAlpha = clamp01(o.reveal);
    ctx.save();
    ctx.globalAlpha = cardAlpha;
    ctx.fillStyle = '#FFFFFF';
    rr(ctx, 30, LIST_TOP, SW - 60, shown * ROW_H, 28);
    ctx.fill();
    ctx.restore();
  }

  o.items.forEach((it, i) => {
    const a = easeOut(o.reveal - i);
    if (a <= 0) return;
    const top = LIST_TOP + i * ROW_H;
    const cy = top + ROW_H / 2;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(0, (1 - a) * 18);

    const isSel = i === sel;
    if (isSel && (o.selectT ?? 0) > 0) {
      ctx.fillStyle = hexA(o.statusColor ?? C.blue, 0.12 * (o.selectT ?? 0));
      rr(ctx, 38, top + 8, SW - 76, ROW_H - 16, 22);
      ctx.fill();
    }
    if (i > 0) {
      ctx.fillStyle = '#ECE8E1';
      ctx.fillRect(64, top, SW - 128, 2);
    }
    const hasStatus = isSel && o.status;
    const nameY = hasStatus ? cy - 18 : cy;
    ctx.font = cf(isSel ? 800 : 600, 34);
    ctx.fillStyle = isSel ? (o.statusColor ?? C.blue) : '#16181D';

    // sorot karakter yang berbeda
    if (it.diffChar !== undefined && (o.markDiff ?? 0) > 0) {
      const pre = ctx.measureText(it.name.slice(0, it.diffChar)).width;
      const cw = ctx.measureText(it.name[it.diffChar]).width;
      ctx.save();
      ctx.globalAlpha = a * (o.markDiff ?? 0);
      ctx.fillStyle = hexA(C.orange, 0.28);
      rr(ctx, 64 + pre - 6, nameY - 26, cw + 12, 52, 10);
      ctx.fill();
      ctx.strokeStyle = C.orange;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillText(it.name, 64, nameY);
    if (hasStatus) {
      ctx.font = cf(600, 24);
      ctx.fillStyle = o.statusColor ?? C.blue;
      ctx.fillText(o.status!, 64, cy + 24);
    }
    if (it.secure) lockGlyph(ctx, SW - 160, cy - 2, 28, '#5B606A');
    wifiGlyph(ctx, SW - 98, cy + 16, 40, it.level, '#22252B');

    // ripple tap
    if (isSel && o.tap !== undefined && o.tap > 0 && o.tap < 1) {
      ctx.fillStyle = hexA(o.statusColor ?? C.blue, 0.3 * (1 - o.tap));
      ctx.beginPath();
      ctx.arc(o.tapX ?? 250, cy, 30 + o.tap * 200, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  if (o.banner && o.banner.t > 0) drawBanner(ctx, o.banner);
  endScreen(ctx);
};

const drawBanner = (ctx: Ctx, b: NonNullable<WifiListOpts['banner']>) => {
  const t = easeOut(b.t);
  ctx.save();
  ctx.globalAlpha = t;
  ctx.translate(0, (1 - t) * 60);
  const y = 1180;
  ctx.shadowColor = 'rgba(0,0,0,0.14)';
  ctx.shadowBlur = 28;
  ctx.fillStyle = '#FFFFFF';
  rr(ctx, 30, y, SW - 60, 210, 34);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = b.color;
  ctx.beginPath();
  ctx.arc(108, y + 105, 44, 0, Math.PI * 2);
  ctx.fill();
  if (b.icon === 'ok') checkGlyph(ctx, 108, y + 105, 56, '#fff');
  else {
    ctx.fillStyle = '#fff';
    ctx.font = cf(800, 54);
    ctx.textAlign = 'center';
    ctx.fillText('!', 108, y + 108);
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = '#16181D';
  ctx.font = cf(800, 31);
  ctx.fillText(b.title, 172, y + 76);
  ctx.font = cf(500, 25);
  ctx.fillStyle = '#4A4E57';
  wrap(ctx, b.body, 172, y + 120, SW - 230, 34);
  ctx.restore();
};

const wrap = (ctx: Ctx, text: string, x: number, y: number, maxW: number, lh: number) => {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else line = test;
  }
  ctx.fillText(line, x, yy);
};

export const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

/* ------------------------------------------------------------------ */
/* Layar 3: Terhubung (scene 2)                                         */
/* ------------------------------------------------------------------ */

export const drawConnected = (ctx: Ctx, o: {frame: number; activity: number; question: number}) => {
  const g = ctx.createLinearGradient(0, 0, 0, SH);
  g.addColorStop(0, '#EEF3FD');
  g.addColorStop(1, '#F4ECDF');
  beginScreen(ctx, g);
  statusBar(ctx, {wifi: 3, wifiColor: '#16181D'});
  // lingkaran wifi besar
  const pulse = 0.5 + 0.5 * Math.sin(o.frame * 0.15);
  ctx.fillStyle = hexA(C.blue, 0.08 + 0.05 * pulse);
  ctx.beginPath();
  ctx.arc(SW / 2, 470, 210, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(SW / 2, 470, 150, 0, Math.PI * 2);
  ctx.fill();
  wifiGlyph(ctx, SW / 2, 540, 150, 3, C.blue);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#16181D';
  ctx.font = cf(800, 46);
  ctx.fillText('Terhubung', SW / 2, 780);
  ctx.font = cf(600, 32);
  ctx.fillStyle = '#5B606A';
  ctx.fillText('KafeKopi_Free', SW / 2, 836);

  // aktivitas data
  ctx.fillStyle = '#FFFFFF';
  rr(ctx, 60, 930, SW - 120, 200, 32);
  ctx.fill();
  ctx.textAlign = 'left';
  ctx.font = cf(700, 26);
  ctx.fillStyle = '#8B9099';
  ctx.fillText('AKTIVITAS DATA', 100, 980);
  for (let i = 0; i < 14; i++) {
    const h = 20 + 60 * Math.abs(Math.sin(o.frame * 0.12 + i * 0.7)) * o.activity;
    ctx.fillStyle = i % 2 ? C.blueSoft : C.blue;
    rr(ctx, 100 + i * 37, 1100 - h, 22, h, 8);
    ctx.fill();
  }
  // tanda tanya
  if (o.question > 0) {
    const q = easeOut(o.question);
    ctx.save();
    ctx.globalAlpha = q;
    ctx.fillStyle = C.yellow;
    ctx.beginPath();
    ctx.arc(SW / 2 + 135, 350, 62 * q, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#16181D';
    ctx.textAlign = 'center';
    ctx.font = cf(800, 78);
    ctx.fillText('?', SW / 2 + 135, 354);
    ctx.restore();
  }
  endScreen(ctx);
};

/* ------------------------------------------------------------------ */
/* Layar 4: Browser HTTPS (scene 4)                                     */
/* ------------------------------------------------------------------ */

export const drawBrowser = (ctx: Ctx, o: {frame: number; press: number; sending: number; secure: number}) => {
  beginScreen(ctx, '#F7F4EE');
  statusBar(ctx, {wifi: 3});
  // URL bar
  ctx.fillStyle = '#E9E4DA';
  rr(ctx, 30, 108, SW - 60, 84, 42);
  ctx.fill();
  const lockCol = o.secure > 0.5 ? C.blue : '#8B9099';
  lockGlyph(ctx, 82, 150, 30, lockCol);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.font = cf(800, 30);
  ctx.fillStyle = lockCol;
  ctx.fillText('https://', 112, 152);
  const w = ctx.measureText('https://').width;
  ctx.fillStyle = '#16181D';
  ctx.font = cf(600, 30);
  ctx.fillText('tokoku.id/masuk', 112 + w, 152);

  // logo
  ctx.fillStyle = C.blue;
  rr(ctx, SW / 2 - 56, 270, 112, 112, 32);
  ctx.fill();
  ctx.fillStyle = C.yellow;
  ctx.beginPath();
  ctx.arc(SW / 2, 326, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#16181D';
  ctx.font = cf(800, 50);
  ctx.fillText('Masuk ke Akun', SW / 2, 450);
  ctx.font = cf(500, 27);
  ctx.fillStyle = '#6B707A';
  ctx.fillText('Belanja aman, data terlindungi', SW / 2, 500);

  const field = (label: string, value: string, y: number, mono = false) => {
    ctx.textAlign = 'left';
    ctx.font = cf(700, 24);
    ctx.fillStyle = '#6B707A';
    ctx.fillText(label, 70, y);
    ctx.fillStyle = '#FFFFFF';
    rr(ctx, 50, y + 24, SW - 100, 92, 24);
    ctx.fill();
    ctx.strokeStyle = '#E2DCD0';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#16181D';
    ctx.font = mono ? cf(700, 34, MONO) : cf(600, 30);
    ctx.fillText(value, 82, y + 72);
  };
  field('Email', 'kamu@email.com', 590);
  field('Kata sandi', '••••••••••', 740, true);

  // tombol
  const s = 1 - 0.05 * Math.sin(Math.PI * clamp01(o.press));
  ctx.save();
  ctx.translate(SW / 2, 960);
  ctx.scale(s, s);
  ctx.fillStyle = C.blue;
  rr(ctx, -(SW - 100) / 2, -48, SW - 100, 96, 48);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.font = cf(800, 34);
  ctx.fillText('Masuk', 0, 2);
  ctx.restore();

  if (o.sending > 0) {
    ctx.save();
    ctx.globalAlpha = clamp01(o.sending * 3);
    ctx.textAlign = 'left';
    const enc = o.secure > 0.5;
    ctx.fillStyle = '#FFFFFF';
    rr(ctx, 50, 1080, SW - 100, 150, 30);
    ctx.fill();
    if (enc) lockGlyph(ctx, 104, 1132, 34, C.blue);
    else spinner(ctx, 104, 1132, 16, o.frame, '#8B9099');
    ctx.fillStyle = '#16181D';
    ctx.font = cf(700, 28);
    ctx.fillText(enc ? 'Data dikirim terenkripsi' : 'Mengirim data…', 140, 1134);
    ctx.fillStyle = '#ECE8E1';
    rr(ctx, 84, 1180, SW - 168, 14, 7);
    ctx.fill();
    ctx.fillStyle = enc ? C.blue : '#8B9099';
    rr(ctx, 84, 1180, (SW - 168) * clamp01(o.sending), 14, 7);
    ctx.fill();
    ctx.restore();
  }
  endScreen(ctx);
};

/* ------------------------------------------------------------------ */
/* Layar 5: Koneksi aman + checklist (scene 5)                         */
/* ------------------------------------------------------------------ */

export const drawSecure = (ctx: Ctx, o: {frame: number; shield: number; checks: number[]}) => {
  const g = ctx.createLinearGradient(0, 0, 0, SH);
  g.addColorStop(0, '#E6EEFD');
  g.addColorStop(1, '#F5EEE2');
  beginScreen(ctx, g);
  statusBar(ctx, {wifi: 3});
  const s = easeOut(o.shield);
  // perisai
  ctx.save();
  ctx.translate(SW / 2, 400);
  ctx.scale(0.6 + 0.4 * s, 0.6 + 0.4 * s);
  ctx.globalAlpha = s;
  ctx.fillStyle = hexA(C.blue, 0.12);
  ctx.beginPath();
  ctx.arc(0, 0, 190 + 8 * Math.sin(o.frame * 0.12), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.blue;
  shieldPath(ctx, 0, 0, 260);
  ctx.fill();
  checkGlyph(ctx, 0, 4, 140, '#FFFFFF', clamp01(o.shield * 1.4 - 0.3));
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#16181D';
  ctx.font = cf(800, 52);
  ctx.fillText('Tetap Aman', SW / 2, 680);
  ctx.font = cf(500, 28);
  ctx.fillStyle = '#5B606A';
  ctx.fillText('Checklist sebelum pakai Wi-Fi publik', SW / 2, 732);

  const rows = ['Nama Wi-Fi sudah benar', 'Tidak isi data pribadi', 'Situs pakai HTTPS'];
  rows.forEach((label, i) => {
    const t = easeOut(o.checks[i] ?? 0);
    if (t <= 0) return;
    const y = 820 + i * 140;
    ctx.save();
    ctx.globalAlpha = t;
    ctx.translate((1 - t) * 50, 0);
    ctx.fillStyle = '#FFFFFF';
    rr(ctx, 50, y, SW - 100, 116, 30);
    ctx.fill();
    ctx.fillStyle = i === 2 ? C.yellow : C.blue;
    ctx.beginPath();
    ctx.arc(116, y + 58, 34, 0, Math.PI * 2);
    ctx.fill();
    checkGlyph(ctx, 116, y + 58, 46, i === 2 ? '#16181D' : '#FFFFFF', clamp01((o.checks[i] ?? 0) * 1.5 - 0.3));
    ctx.textAlign = 'left';
    ctx.fillStyle = '#16181D';
    ctx.font = cf(700, 31);
    ctx.fillText(label, 172, y + 60);
    ctx.restore();
  });
  endScreen(ctx);
};

/* ------------------------------------------------------------------ */
/* Layar laptop penyerang                                               */
/* ------------------------------------------------------------------ */

export const drawAttackerScreen = (ctx: Ctx, w: number, h: number, frame: number, active: number) => {
  ctx.fillStyle = '#1B1D22';
  ctx.fillRect(0, 0, w, h);
  ctx.font = cf(700, 26, MONO);
  ctx.textBaseline = 'middle';
  const lines = ['> evil_twin --ssid', '  "KafeKop1_Free"', '> clients: 1', '> capture: ON'];
  lines.forEach((l, i) => {
    const vis = clamp01(active * 5 - i);
    ctx.globalAlpha = vis;
    ctx.fillStyle = i % 2 ? '#FFB07A' : C.orange;
    ctx.fillText(l.slice(0, Math.ceil(l.length * vis)), 26, 50 + i * 52);
  });
  ctx.globalAlpha = 1;
  if (Math.floor(frame / 8) % 2 === 0) {
    ctx.fillStyle = C.orange;
    ctx.fillRect(26, 50 + lines.length * 52 - 14, 16, 30);
  }
};
