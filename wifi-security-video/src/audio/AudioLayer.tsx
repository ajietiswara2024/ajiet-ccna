import React from 'react';
import {Html5Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {AUDIO} from '../config/audio';
import {CLAMP} from '../lib/anim';

/**
 * Lapisan audio: voice-over + musik latar (dengan fade & ducking otomatis).
 * File dideteksi otomatis oleh calculateMetadata di Root.tsx.
 */
export const AudioLayer: React.FC<{hasVoiceover: boolean; hasMusic: boolean}> = ({hasVoiceover, hasMusic}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const m = AUDIO.music;
  const base = hasVoiceover ? m.duckedVolume : m.volume;
  const musicVolume = (f: number) =>
    base *
    interpolate(f, [0, m.fadeInSeconds * fps], [0, 1], CLAMP) *
    interpolate(f, [durationInFrames - m.fadeOutSeconds * fps, durationInFrames - 1], [1, 0], CLAMP);

  return (
    <>
      {hasMusic ? <Html5Audio src={staticFile(m.file)} volume={musicVolume} loop={m.loop} /> : null}
      {hasVoiceover ? (
        <Sequence from={Math.round(AUDIO.voiceover.startAtSeconds * fps)} name="Voice-over">
          <Html5Audio src={staticFile(AUDIO.voiceover.file)} volume={AUDIO.voiceover.volume} />
        </Sequence>
      ) : null}
    </>
  );
};
