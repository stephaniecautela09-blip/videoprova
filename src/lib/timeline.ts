import {createContext, useContext} from 'react';
import data from '../data/timeline.json';
import type {Block} from '../theme';

export type LineT = {
  id: string;
  kind: 'line' | 'quiz-q' | 'quiz-a';
  cap: string;
  say: string;
  start: number;
  end: number;
  thinkEnd: number | null;
};

export type SceneT = {
  id: string;
  num: number;
  title: string;
  block: Block;
  audio: string;
  durationInFrames: number;
  lines: LineT[];
};

export const TL = data as unknown as {fps: number; engine: string; scenes: SceneT[]};

export const TOTAL_FRAMES = TL.scenes.reduce((a, s) => a + s.durationInFrames, 0);

export const SCENE_STARTS = TL.scenes.reduce<number[]>((acc, s, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + TL.scenes[i - 1].durationInFrames);
  return acc;
}, []);

export const SceneCtx = createContext<SceneT | null>(null);

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export const useCues = () => {
  const sc = useContext(SceneCtx);
  if (!sc) throw new Error('useCues fora de uma cena');
  const map: Record<string, LineT> = {};
  for (const l of sc.lines) map[l.id] = l;
  const get = (id: string) => {
    const l = map[id];
    if (!l) throw new Error(`Frase ${id} não existe na cena ${sc.id}`);
    return l;
  };
  return {
    scene: sc,
    dur: sc.durationInFrames,
    line: get,
    /** frame em que a frase começa */
    s: (id: string) => get(id).start,
    /** frame em que a frase termina */
    e: (id: string) => get(id).end,
    /** frame estimado em que `word` é falada dentro da frase (proporcional à posição no texto) */
    at: (id: string, word: string, nth = 0) => {
      const l = get(id);
      const t = norm(l.say);
      const w = norm(word);
      let idx = -1;
      let from = 0;
      for (let i = 0; i <= nth; i++) {
        idx = t.indexOf(w, from);
        if (idx < 0) break;
        from = idx + 1;
      }
      if (idx < 0) return l.start;
      return Math.round(l.start + (idx / t.length) * (l.end - l.start));
    },
  };
};
