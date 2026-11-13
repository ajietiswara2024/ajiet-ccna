import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {AudioLayer} from './audio/AudioLayer';
import {SCENES, SceneId, sec, TRANSITION} from './config/timeline';
import {C} from './config/theme';
import {Scene1Opening} from './scenes/Scene1Opening';
import {Scene2Network} from './scenes/Scene2Network';
import {Scene3EvilTwin} from './scenes/Scene3EvilTwin';
import {Scene4Https} from './scenes/Scene4Https';
import {Scene5Closing} from './scenes/Scene5Closing';
import {SceneFrame} from './ui/Overlay';
import {Subtitles} from './ui/Subtitles';

export type VideoProps = {
  hasVoiceover: boolean;
  hasMusic: boolean;
  showSubtitles: boolean;
};

const ORDER: {id: SceneId; Component: React.FC}[] = [
  {id: 'opening', Component: Scene1Opening},
  {id: 'network', Component: Scene2Network},
  {id: 'evilTwin', Component: Scene3EvilTwin},
  {id: 'https', Component: Scene4Https},
  {id: 'closing', Component: Scene5Closing},
];

/**
 * Komposisi utama. Setiap scene adalah <Sequence> terpisah.
 * Scene berikutnya dimulai tepat di batas waktunya dan melakukan crossfade
 * di atas scene sebelumnya (scene sebelumnya diperpanjang TRANSITION frame).
 */
export const WifiSecurityVideo: React.FC<VideoProps> = ({hasVoiceover, hasMusic, showSubtitles}) => (
  <AbsoluteFill style={{background: C.bg}}>
    {ORDER.map(({id, Component}, i) => {
      const sc = SCENES[id];
      const isLast = i === ORDER.length - 1;
      return (
        <Sequence
          key={id}
          name={`Scene ${sc.index} — ${sc.tag}`}
          from={sec(sc.start)}
          durationInFrames={sec(sc.end - sc.start) + (isLast ? 0 : TRANSITION)}
          premountFor={20}
        >
          <SceneFrame fadeIn={i > 0} duration={TRANSITION}>
            <Component />
          </SceneFrame>
        </Sequence>
      );
    })}
    {showSubtitles ? <Subtitles /> : null}
    <AudioLayer hasVoiceover={hasVoiceover} hasMusic={hasMusic} />
  </AbsoluteFill>
);
