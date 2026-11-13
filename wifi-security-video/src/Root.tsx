import React from 'react';
import {Composition, staticFile} from 'remotion';
import {AUDIO} from './config/audio';
import {DURATION, FPS, HEIGHT, WIDTH} from './config/timeline';
import {HandLab} from './HandLab';
import {VideoProps, WifiSecurityVideo} from './Video';

/** Cek apakah file audio ada di folder public/ */
const fileExists = async (path: string) => {
  try {
    const res = await fetch(staticFile(path), {method: 'HEAD'});
    return res.ok;
  } catch {
    return false;
  }
};

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="HandLab" component={HandLab} durationInFrames={60} fps={FPS} width={720} height={720} />
  <Composition
    id="WifiSecurity"
    component={WifiSecurityVideo}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{hasVoiceover: false, hasMusic: false, showSubtitles: true} satisfies VideoProps}
    calculateMetadata={async ({props}) => {
      const [hasVoiceover, hasMusic] = await Promise.all([fileExists(AUDIO.voiceover.file), fileExists(AUDIO.music.file)]);
      return {props: {...props, hasVoiceover, hasMusic}};
    }}
  />
  </>
);
