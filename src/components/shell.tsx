import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Check, Pause} from 'lucide-react';
import {CLAMP, ease, fadeOut, pop} from '../lib/anim';
import {SCENE_STARTS, TL, TOTAL_FRAMES, useCues} from '../lib/timeline';
import {C, FONT, MONO, blockColor, blockLabel} from '../theme';

/** Fundo global: gradiente escuro, grade de pontos e brilho na cor do bloco. */
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const inputs: number[] = [];
  const colors: string[] = [];
  TL.scenes.forEach((s, i) => {
    const st = SCENE_STARTS[i];
    inputs.push(st + (i === 0 ? 0 : 8), st + s.durationInFrames - 8);
    colors.push(blockColor[s.block], blockColor[s.block]);
  });
  const col = interpolateColors(f, inputs, colors);
  const gx = 50 + 18 * Math.sin(f / 240);
  const gy = 30 + 12 * Math.cos(f / 300);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 800px at ${gx}% ${gy}%, ${col}2E, transparent 70%), radial-gradient(900px 700px at ${100 - gx}% ${100 - gy * 0.5}%, ${col}18, transparent 70%), linear-gradient(180deg, ${C.bg2}, ${C.bg})`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(148,163,184,0.16) 1.6px, transparent 1.6px)',
          backgroundSize: '44px 44px',
          backgroundPosition: `${(f * 0.25) % 44}px ${(f * 0.15) % 44}px`,
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 85%)',
        }}
      />
      {Array.from({length: 14}).map((_, i) => {
        const x = random(`x${i}`) * 1920;
        const sp = 0.15 + random(`s${i}`) * 0.35;
        const y = 1080 - ((f * sp + random(`y${i}`) * 1080) % 1180);
        const r = 2 + random(`r${i}`) * 4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: col,
              opacity: 0.18 + 0.2 * random(`o${i}`),
              filter: 'blur(1px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Barra superior: bloco atual + progresso segmentado por cena. */
export const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  let idx = 0;
  for (let i = 0; i < SCENE_STARTS.length; i++) if (f >= SCENE_STARTS[i]) idx = i;
  const sc = TL.scenes[idx];
  const col = blockColor[sc.block];
  const local = f - SCENE_STARTS[idx];
  const chipIn = Math.min(ease(local, 0, 14), fadeOut(local, sc.durationInFrames - 10, 10));
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 120, right: 120, top: 30, display: 'flex', gap: 8}}>
        {TL.scenes.map((s, i) => {
          const st = SCENE_STARTS[i];
          const p = interpolate(f, [st, st + s.durationInFrames], [0, 1], CLAMP);
          return (
            <div key={s.id} style={{flex: s.durationInFrames, height: 8, borderRadius: 8, background: 'rgba(148,163,184,0.18)', overflow: 'hidden'}}>
              <div style={{width: `${p * 100}%`, height: '100%', background: blockColor[s.block], boxShadow: `0 0 12px ${blockColor[s.block]}`}} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 54,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontFamily: FONT,
          fontSize: 22,
          color: C.muted,
          fontWeight: 600,
        }}
      >
        <span style={{opacity: chipIn, padding: '6px 18px', borderRadius: 999, border: `2px solid ${col}`, color: col, fontWeight: 800, letterSpacing: 1}}>
          {blockLabel[sc.block].toUpperCase()}
        </span>
        <span>Tópicos em Contabilidade II · Revisão</span>
        <span style={{fontFamily: MONO, color: C.dim}}>{formatClock((TOTAL_FRAMES - f) / 30)}</span>
      </div>
    </AbsoluteFill>
  );
};

const formatClock = (sec: number) => {
  const s = Math.max(0, Math.round(sec));
  return `−${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** Destaca números da legenda com a cor do bloco. */
const highlight = (text: string, color: string) => {
  const parts = text.split(/([−+]?\d[\d.]*(?:\s?%)?|=)/g);
  return parts.map((p, i) =>
    /^[−+]?\d/.test(p) || p === '=' ? (
      <span key={i} style={{color, fontFamily: MONO, fontWeight: 700}}>
        {p}
      </span>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
};

/** Legenda: sempre a frase em fala (ou a última dita, durante as pausas). */
export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const {scene} = useCues();
  const col = blockColor[scene.block];
  let cur = -1;
  for (let i = 0; i < scene.lines.length; i++) if (f >= scene.lines[i].start - 2) cur = i;
  if (cur < 0) return null;
  const l = scene.lines[cur];
  const o = Math.min(ease(f, l.start - 2, 6), fadeOut(f, scene.durationInFrames - 8, 8));
  const isQuiz = l.kind !== 'line';
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          maxWidth: 1560,
          padding: '18px 40px',
          borderRadius: 22,
          background: 'rgba(3,6,16,0.80)',
          border: `2px solid ${isQuiz ? col : 'rgba(255,255,255,0.10)'}`,
          boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
          fontFamily: FONT,
          fontSize: 40,
          fontWeight: 600,
          lineHeight: 1.3,
          color: C.text,
          textAlign: 'center',
          opacity: o,
        }}
      >
        {highlight(l.cap, blockColor[scene.block] === C.intro ? C.dfcL : col)}
      </div>
    </div>
  );
};

/** Sobreposição “Pause e responda”: pergunta, contagem regressiva e resposta. */
export const QuizOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {scene} = useCues();
  const q = scene.lines.find((l) => l.kind === 'quiz-q');
  if (!q || q.thinkEnd === null) return null;
  const answers = scene.lines.filter((l) => l.kind === 'quiz-a');
  const col = blockColor[scene.block];
  const start = q.start - 10;
  if (f < start) return null;
  const o = Math.min(ease(f, start, 8), fadeOut(f, scene.durationInFrames - 12, 12));
  const p = pop(f, fps, start + 5, 15);
  const cardO = ease(f, start + 5, 8);
  const question = q.cap.replace(/^Pause e responda:\s*/i, '');
  const think = interpolate(f, [q.end, q.thinkEnd], [0, 1], CLAMP);
  const remaining = Math.ceil((q.thinkEnd - Math.max(f, q.end)) / fps);
  const answered = answers.length > 0 && f >= answers[0].start - 4;
  const R = 46;
  const circ = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{background: 'rgba(4,7,18,0.86)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 120}}>
        <div
          style={{
            width: 1380,
            borderRadius: 36,
            padding: '44px 60px 48px',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
            border: `3px solid ${col}`,
            boxShadow: `0 0 80px ${col}44`,
            transform: `scale(${0.85 + 0.15 * p})`,
            opacity: cardO,
            fontFamily: FONT,
            color: C.text,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 28px',
                borderRadius: 999,
                background: col,
                color: '#0B1020',
                fontWeight: 900,
                fontSize: 30,
                letterSpacing: 2,
              }}
            >
              <Pause size={30} strokeWidth={3} fill="#0B1020" />
              PAUSE E RESPONDA
            </div>
            <svg width={120} height={120} style={{opacity: answered ? 0.25 : 1}}>
              <circle cx={60} cy={60} r={R} stroke="rgba(148,163,184,0.25)" strokeWidth={10} fill="none" />
              <circle
                cx={60}
                cy={60}
                r={R}
                stroke={col}
                strokeWidth={10}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * think}
                transform="rotate(-90 60 60)"
              />
              <text x={60} y={74} textAnchor="middle" fill={C.text} fontFamily={MONO} fontWeight={800} fontSize={40}>
                {answered ? '✓' : f < q.end ? '?' : Math.max(0, remaining)}
              </text>
            </svg>
          </div>
          <div style={{fontSize: 58, fontWeight: 800, lineHeight: 1.2, marginTop: 28, letterSpacing: -0.5}}>{question}</div>
          {answers.map((a, i) => {
            const ap = pop(f, fps, a.start - 4, 14);
            if (f < a.start - 4) return null;
            return (
              <div
                key={a.id}
                style={{
                  marginTop: i === 0 ? 34 : 16,
                  display: 'flex',
                  gap: 22,
                  alignItems: 'flex-start',
                  padding: '22px 28px',
                  borderRadius: 22,
                  background: `${col}1F`,
                  border: `2px solid ${col}88`,
                  opacity: ease(f, a.start - 4, 10),
                  transform: `translateY(${(1 - ap) * 30}px)`,
                }}
              >
                {i === 0 ? (
                  <div style={{width: 54, height: 54, borderRadius: 16, background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <Check size={36} color="#0B1020" strokeWidth={3.4} />
                  </div>
                ) : (
                  <div style={{width: 54, flexShrink: 0}} />
                )}
                <div style={{fontSize: 42, fontWeight: 600, lineHeight: 1.3}}>{a.cap}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
