import React from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import '@fontsource/jetbrains-mono/600.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/800.css';
import {Video} from './Video';
import {TOTAL_FRAMES, TL} from './lib/timeline';

if (typeof document !== 'undefined') {
  const handle = delayRender('Carregando fontes');
  const specs = ['400', '500', '600', '700', '800', '900'].map((w) => `${w} 40px Inter`);
  specs.push('600 40px "JetBrains Mono"', '700 40px "JetBrains Mono"', '800 40px "JetBrains Mono"');
  Promise.all(specs.map((s) => document.fonts.load(s, 'Açãó 0123456789−')))
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}

export const Root: React.FC = () => (
  <Composition id="VideoRevisao" component={Video} durationInFrames={TOTAL_FRAMES} fps={TL.fps} width={1920} height={1080} />
);
