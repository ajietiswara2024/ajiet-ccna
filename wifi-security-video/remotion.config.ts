import {Config} from '@remotion/cli/config';

// Output video: MP4 H.264
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);

// WebGL (Three.js) di server/headless tanpa GPU: gunakan "swangle".
// Di komputer dengan GPU, ganti ke "angle" agar render lebih cepat.
Config.setChromiumOpenGlRenderer('swangle');

// Atur sesuai jumlah core CPU. null = otomatis.
Config.setConcurrency(null);

// Opsional: pakai browser Chrome/Chromium lokal (mis. bila unduhan otomatis diblokir).
// Contoh: REMOTION_BROWSER=/path/ke/chrome-headless-shell npm run render
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
