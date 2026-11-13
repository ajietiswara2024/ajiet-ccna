// Render beberapa frame menjadi PNG untuk pengecekan cepat.
// Pakai: node scripts/preview-stills.mjs 30 240 600   (nomor frame)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const frames = process.argv.slice(2).map(Number);
const outDir = path.resolve('out/stills');
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER || null;
const chromiumOptions = {gl: 'swangle'};
const composition = await selectComposition({serveUrl, id: process.env.COMP || 'WifiSecurity', browserExecutable, chromiumOptions, logLevel: 'error'});
for (const frame of frames) {
  const output = path.join(outDir, `f${String(frame).padStart(4, '0')}.png`);
  await renderStill({composition, serveUrl, frame, output, scale: 0.4, browserExecutable, chromiumOptions, logLevel: 'error'});
  console.log('ok', output);
}
