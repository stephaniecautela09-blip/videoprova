import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {LucideIcon} from 'lucide-react';
import {TriangleAlert} from 'lucide-react';
import {CLAMP, ease, fadeOut, fmt, pop} from '../lib/anim';
import {C, FONT, MONO} from '../theme';

type Dir = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';

/** Entrada animada (mola) + saída opcional. */
export const Appear: React.FC<{
  at: number;
  until?: number;
  dir?: Dir;
  dist?: number;
  damping?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, until, dir = 'up', dist = 40, damping = 14, style, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(f, fps, at, damping);
  const o = Math.min(ease(f, at, 10), until === undefined ? 1 : fadeOut(f, until, 10));
  let t = '';
  if (dir === 'up') t = `translateY(${(1 - p) * dist}px)`;
  if (dir === 'down') t = `translateY(${-(1 - p) * dist}px)`;
  if (dir === 'left') t = `translateX(${(1 - p) * dist}px)`;
  if (dir === 'right') t = `translateX(${-(1 - p) * dist}px)`;
  if (dir === 'scale') t = `scale(${0.6 + 0.4 * p})`;
  if (f < at - 1) return null;
  return <div style={{opacity: o, transform: t, ...style}}>{children}</div>;
};

export const Card: React.FC<{
  color?: string;
  glow?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({color = C.cardBorder, glow = 0, style, children}) => (
  <div
    style={{
      background: `linear-gradient(160deg, rgba(255,255,255,0.065), rgba(255,255,255,0.025))`,
      border: `2px solid ${color}`,
      borderRadius: 28,
      padding: '26px 32px',
      boxShadow: glow > 0 ? `0 0 ${50 * glow}px ${color}55, inset 0 0 ${30 * glow}px ${color}22` : '0 20px 50px rgba(0,0,0,0.35)',
      fontFamily: FONT,
      color: C.text,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{
  color: string;
  solid?: boolean;
  size?: number;
  icon?: LucideIcon;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({color, solid, size = 30, icon: Icon, style, children}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.4,
      padding: `${size * 0.32}px ${size * 0.75}px`,
      borderRadius: 999,
      background: solid ? color : `${color}22`,
      border: `2px solid ${color}`,
      color: solid ? '#0B1020' : C.text,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {Icon ? <Icon size={size * 1.05} strokeWidth={2.4} color={solid ? '#0B1020' : color} /> : null}
    {children}
  </div>
);

export const IconBadge: React.FC<{icon: LucideIcon; color: string; size?: number; style?: React.CSSProperties}> = ({
  icon: Icon,
  color,
  size = 96,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: `linear-gradient(145deg, ${color}40, ${color}14)`,
      border: `2px solid ${color}88`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...style,
    }}
  >
    <Icon size={size * 0.52} color={color} strokeWidth={2.2} />
  </div>
);

/** Número animado em formato brasileiro. */
export const Counter: React.FC<{
  at: number;
  to: number;
  from?: number;
  dur?: number;
  sign?: boolean;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({at, to, from = 0, dur = 24, sign = false, color = C.text, size = 80, style}) => {
  const f = useCurrentFrame();
  const v = interpolate(ease(f, at, dur), [0, 1], [from, to]);
  return (
    <span style={{fontFamily: MONO, fontWeight: 700, fontSize: size, color, letterSpacing: -1, ...style}}>
      {fmt(v, sign)}
    </span>
  );
};

/** Selo vermelho “PEGADINHA”, com pulso. */
export const Pegadinha: React.FC<{at: number; label?: string; size?: number; style?: React.CSSProperties}> = ({
  at,
  label = 'PEGADINHA',
  size = 30,
  style,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(f, fps, at, 9);
  const pulse = 0.5 + 0.5 * Math.sin((f - at) / 6);
  if (f < at) return null;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: `${size * 0.35}px ${size * 0.8}px`,
        borderRadius: 999,
        background: `linear-gradient(90deg, ${C.red}, #DC2626)`,
        color: 'white',
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 2,
        transform: `scale(${0.4 + 0.6 * p})`,
        boxShadow: `0 0 ${20 + 30 * pulse}px ${C.red}AA`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <TriangleAlert size={size * 1.1} strokeWidth={2.6} />
      {label}
    </div>
  );
};

/** Carimbo que “bate” na tela. */
export const Stamp: React.FC<{at: number; color?: string; size?: number; rotate?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  at,
  color = C.red,
  size = 64,
  rotate = -8,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [at, at + 8], [0, 1], CLAMP);
  if (f < at) return null;
  return (
    <div
      style={{
        display: 'inline-block',
        border: `6px solid ${color}`,
        color,
        borderRadius: 18,
        padding: '10px 34px',
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 3,
        background: 'rgba(7,11,24,0.85)',
        opacity: t,
        transform: `rotate(${rotate}deg) scale(${2.2 - 1.2 * t})`,
        boxShadow: `0 0 40px ${color}66`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Linha SVG que se desenha. Use dentro de <svg>. */
export const DrawPath: React.FC<{
  d: string;
  at: number;
  dur?: number;
  color: string;
  width?: number;
  dash?: string;
  arrow?: boolean;
  opacity?: number;
}> = ({d, at, dur = 20, color, width = 5, dash, arrow, opacity = 1}) => {
  const f = useCurrentFrame();
  const p = ease(f, at, dur);
  const id = `ah-${color.replace('#', '')}`;
  if (f < at) return null;
  return (
    <g opacity={opacity}>
      {arrow ? (
        <defs>
          <marker id={id} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        </defs>
      ) : null}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={dash ? undefined : '1 1'}
        strokeDashoffset={dash ? undefined : 1 - p}
        style={dash ? {strokeDasharray: dash, opacity: p} : undefined}
        markerEnd={arrow && p > 0.95 ? `url(#${id})` : undefined}
      />
    </g>
  );
};

/** Risco animado sobre um texto (posicione o pai como relative). */
export const Strike: React.FC<{at: number; color?: string; width?: number}> = ({at, color = C.red, width = 6}) => {
  const f = useCurrentFrame();
  const p = ease(f, at, 12);
  if (f < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: -8,
        top: '50%',
        height: width,
        width: `calc(${p * 100}% + ${p * 16}px)`,
        background: color,
        borderRadius: width,
        transform: 'rotate(-4deg)',
        boxShadow: `0 0 16px ${color}`,
      }}
    />
  );
};

export const Title: React.FC<{size?: number; color?: string; weight?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  size = 64,
  color = C.text,
  weight = 800,
  style,
  children,
}) => (
  <div style={{fontFamily: FONT, fontSize: size, fontWeight: weight, color, letterSpacing: -1, lineHeight: 1.1, ...style}}>{children}</div>
);

export const Txt: React.FC<{size?: number; color?: string; weight?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  size = 34,
  color = C.text,
  weight = 600,
  style,
  children,
}) => <div style={{fontFamily: FONT, fontSize: size, fontWeight: weight, color, lineHeight: 1.25, ...style}}>{children}</div>;

/** Posiciona algo em coordenadas absolutas do quadro 1920×1080. */
export const At: React.FC<{x: number; y: number; w?: number; h?: number; center?: boolean; style?: React.CSSProperties; children: React.ReactNode}> = ({
  x,
  y,
  w,
  h,
  center,
  style,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      transform: center ? 'translate(-50%, -50%)' : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Cabeçalho da cena (número + título) no topo da área de conteúdo. */
export const SceneHeader: React.FC<{num: number; title: string; color: string; sub?: string}> = ({num, title, color, sub}) => {
  const f = useCurrentFrame();
  const p = ease(f, 2, 20);
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 108,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: color,
          color: '#0B1020',
          fontFamily: MONO,
          fontWeight: 800,
          fontSize: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {num}
      </div>
      <div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.text, letterSpacing: -0.5}}>{title}</div>
        {sub ? <div style={{fontFamily: FONT, fontWeight: 500, fontSize: 24, color: C.muted, marginTop: 2}}>{sub}</div> : null}
      </div>
    </div>
  );
};
