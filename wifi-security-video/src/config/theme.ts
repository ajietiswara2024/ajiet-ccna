import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * Font dibundel lokal di public/fonts (variable font, berlisensi SIL OFL),
 * sehingga render tidak bergantung pada koneksi internet.
 */
export const FONT = 'Plus Jakarta Sans';
export const MONO = 'JetBrains Mono';

loadFont({family: FONT, url: staticFile('fonts/PlusJakartaSans.woff2'), weight: '200 800', format: 'woff2'});
loadFont({family: MONO, url: staticFile('fonts/JetBrainsMono.woff2'), weight: '100 800', format: 'woff2'});

/** Palet warna: beige / cream / off-white + aksen biru, kuning, oranye, abu-abu */
export const C = {
  bg: '#ECE8E1', // off-white hangat (high-key studio)
  cream: '#F5EEE2',
  offWhite: '#FBF8F2',
  paper: '#FFFDF9',
  ink: '#22252B',
  inkSoft: '#4A4E57',
  gray: '#8B9099',
  grayLight: '#C9C3B8',
  blue: '#2F6BEA',
  blueSoft: '#7FA6F5',
  yellow: '#F6C343',
  orange: '#F07A2E',
  orangeDeep: '#D9581C',
  wood: '#D6B48C',
  skin: '#E7BE9C',
  graphite: '#2B2E35',
};

/** Font string untuk canvas 2D */
export const cf = (weight: number, size: number, family: string = FONT) =>
  `${weight} ${size}px "${family}", Inter, "DejaVu Sans", sans-serif`;
