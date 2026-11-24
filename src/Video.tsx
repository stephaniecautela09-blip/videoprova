import React from 'react';
import {AbsoluteFill, Audio, Series, staticFile, useCurrentFrame} from 'remotion';
import {Background, Captions, QuizOverlay, TopBar} from './components/shell';
import {ease, fadeOut} from './lib/anim';
import {SceneCtx, TL, type SceneT} from './lib/timeline';
import {S1} from './scenes/S1';
import {S2} from './scenes/S2';
import {S3} from './scenes/S3';
import {S4} from './scenes/S4';
import {S5} from './scenes/S5';
import {S6} from './scenes/S6';
import {S7} from './scenes/S7';
import {S8} from './scenes/S8';
import {S9} from './scenes/S9';

const SCENES: Record<string, React.FC> = {s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9};

const SceneShell: React.FC<{sc: SceneT}> = ({sc}) => {
  const f = useCurrentFrame();
  const Comp = SCENES[sc.id];
  const o = Math.min(ease(f, 0, 14), fadeOut(f, sc.durationInFrames - 12, 12));
  const s = 0.985 + 0.015 * ease(f, 0, 20);
  return (
    <SceneCtx.Provider value={sc}>
      <Audio src={staticFile(sc.audio)} />
      <AbsoluteFill style={{opacity: o, transform: `scale(${s})`}}>
        <Comp />
      </AbsoluteFill>
      <QuizOverlay />
      <Captions />
    </SceneCtx.Provider>
  );
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: '#070B18'}}>
    <Background />
    <Series>
      {TL.scenes.map((sc) => (
        <Series.Sequence key={sc.id} durationInFrames={sc.durationInFrames} name={`${sc.num}. ${sc.title}`}>
          <SceneShell sc={sc} />
        </Series.Sequence>
      ))}
    </Series>
    <TopBar />
  </AbsoluteFill>
);
