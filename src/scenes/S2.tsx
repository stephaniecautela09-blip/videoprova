import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Activity, CalendarClock, Check, CircleDollarSign, Droplets, Equal, Landmark, PiggyBank, ShieldCheck, X} from 'lucide-react';
import {Appear, At, Card, IconBadge, Pegadinha, SceneHeader, Stamp, Txt} from '../components/ui';
import {CLAMP, ease, fadeOut, move, pop} from '../lib/anim';
import {useCues} from '../lib/timeline';
import {C, FONT} from '../theme';

const OX = 100; // origem do SVG do funil na tela
const OY = 150;
const leftX = (y: number) => 60 + (y - 40) * 0.5833;
const rightX = (y: number) => 840 - (y - 40) * 0.5833;
const BANDS = [200, 330, 460];

export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = useCues();
  const b9 = c.s('b9');
  const phase1 = fadeOut(f, b9 - 4, 14);
  const phase2 = ease(f, b9, 14);

  const filters = [
    {id: 'b3', icon: ShieldCheck, title: 'Sem variação relevante de valor', sub: 'risco insignificante de mudar de valor'},
    {id: 'b4', icon: Droplets, title: 'Alta liquidez', sub: 'vira dinheiro rápido'},
    {id: 'b5', icon: CalendarClock, title: 'Prazo inferior a 3 meses', sub: 'vencimento curto'},
  ];
  const funnelIn = ease(f, c.s('b2'), 20);
  const passOk = f >= c.s('b6');

  const rejected = [
    {label: 'Fundo de ações', t0: c.at('b7', 'acoes'), dx: -70, land: 1180},
    {label: 'Fundo cambial', t0: c.at('b7', 'cambiais'), dx: 70, land: 1520},
  ];

  return (
    <AbsoluteFill>
      <SceneHeader num={2} title="O funil do caixa" color={C.dfc} sub="Caixa e equivalentes de caixa" />

      {/* ---------- FASE 1: FUNIL ---------- */}
      {phase1 > 0 ? (
        <AbsoluteFill style={{opacity: phase1}}>
          <svg width={900} height={700} style={{position: 'absolute', left: OX, top: OY, overflow: 'visible', opacity: funnelIn}}>
            <defs>
              <linearGradient id="fun" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.dfc} stopOpacity={0.22} />
                <stop offset="100%" stopColor={C.dfc} stopOpacity={0.05} />
              </linearGradient>
              <clipPath id="funclip">
                <path d="M 60 40 L 840 40 L 560 520 L 560 600 L 340 600 L 340 520 Z" />
              </clipPath>
            </defs>
            <path d="M 60 40 L 840 40 L 560 520 L 560 600 L 340 600 L 340 520 Z" fill="url(#fun)" stroke={C.dfc} strokeWidth={5} strokeLinejoin="round" />
            {/* partículas caindo */}
            <g clipPath="url(#funclip)">
              {Array.from({length: 18}).map((_, i) => {
                const sp = 2.2 + random(`sp${i}`) * 1.4;
                const y = ((f - c.s('b2')) * sp + random(`py${i}`) * 600) % 620;
                const half = (rightX(Math.min(y, 520)) - leftX(Math.min(y, 520))) / 2;
                const x = 450 + (random(`px${i}`) - 0.5) * 2 * half * 0.75;
                if (f < c.s('b2')) return null;
                return <circle key={i} cx={x} cy={y} r={7} fill={C.dfcL} opacity={0.75} />;
              })}
            </g>
            {/* filtros */}
            {BANDS.map((y, i) => {
              const on = ease(f, c.s(filters[i].id), 12);
              return (
                <g key={y}>
                  <line x1={leftX(y)} y1={y} x2={rightX(y)} y2={y} stroke={on > 0 ? C.dfcL : C.line} strokeWidth={6 + 4 * on} strokeDasharray="18 12" strokeDashoffset={-f * 1.5} opacity={0.4 + 0.6 * on} />
                  <circle cx={leftX(y) - 4} cy={y} r={26} fill={on > 0 ? C.dfc : '#1E293B'} stroke={C.dfcL} strokeWidth={3} />
                  <text x={leftX(y) - 4} y={y + 10} textAnchor="middle" fill="white" fontFamily={FONT} fontWeight={800} fontSize={28}>
                    {i + 1}
                  </text>
                  {on > 0 ? <line x1={rightX(y) + 10} y1={y} x2={rightX(y) + 10 + (960 - OX - rightX(y) - 10) * on} y2={y} stroke={C.dfcL} strokeWidth={3} opacity={0.6} /> : null}
                </g>
              );
            })}
          </svg>

          {/* cartões dos filtros */}
          {filters.map((fl, i) => (
            <At key={fl.id} x={1060} y={OY + BANDS[i] - 52} w={740}>
              <Appear at={c.s(fl.id)} dir="left" dist={60}>
                <Card color={`${C.dfc}AA`} glow={0.4} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '16px 26px'}}>
                  <IconBadge icon={fl.icon} color={C.dfcL} size={70} />
                  <div>
                    <Txt size={34} weight={800}>
                      {fl.title}
                    </Txt>
                    <Txt size={24} color={C.muted} weight={500}>
                      {fl.sub}
                    </Txt>
                  </div>
                </Card>
              </Appear>
            </At>
          ))}

          {/* saída do funil */}
          <At x={OX + 450} y={OY + 640} center>
            <Appear at={c.s('b2') + 10} dir="scale">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 30px',
                  borderRadius: 20,
                  background: passOk ? C.dfc : '#1E293B',
                  border: `3px solid ${C.dfcL}`,
                  boxShadow: passOk ? `0 0 ${40 + 20 * Math.sin(f / 6)}px ${C.dfc}` : 'none',
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 32,
                  color: 'white',
                  whiteSpace: 'nowrap',
                }}
              >
                {passOk ? <Check size={36} strokeWidth={3.4} /> : null}
                Equivalente de caixa
              </div>
            </Appear>
          </At>

          {/* zona “fica de fora” */}
          <At x={1060} y={128} w={740}>
            <Appear at={c.s('b7')} dir="down">
              <Txt size={26} color={C.redL} weight={800} style={{letterSpacing: 3, display: 'flex', alignItems: 'center', gap: 12}}>
                FICA DE FORA
                <span style={{opacity: ease(f, c.s('b8'), 10), display: 'inline-flex', alignItems: 'center', gap: 8, letterSpacing: 1}}>
                  <Activity size={30} color={C.red} /> o valor oscila
                </span>
              </Txt>
            </Appear>
          </At>

          {/* fundos rejeitados */}
          {rejected.map((r, k) => {
            if (f < r.t0) return null;
            const fall = move(f, r.t0, 14);
            const out = move(f, r.t0 + 14, 22);
            const startX = OX + 450 + r.dx;
            const hitY = OY + BANDS[0] - 40;
            const x = interpolate(out, [0, 1], [startX, r.land]);
            const yFall = interpolate(fall, [0, 1], [OY - 120, hitY]);
            const arc = -Math.sin(out * Math.PI) * 120;
            const y = out > 0 ? interpolate(out, [0, 1], [hitY, 222]) + arc : yFall;
            const rot = out * (k ? 14 : -14) * (1 - out) * 3;
            const wig = f >= c.s('b8') ? Math.sin((f - c.s('b8')) / 2.2) * 4 : 0;
            return (
              <div
                key={r.label}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: `translate(-50%,-50%) rotate(${rot + wig}deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 24px',
                  borderRadius: 18,
                  background: '#2A0F14',
                  border: `3px solid ${C.red}`,
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 30,
                  color: C.redL,
                  whiteSpace: 'nowrap',
                  boxShadow: `0 0 30px ${C.red}55`,
                }}
              >
                {out > 0.98 ? <X size={32} strokeWidth={3.4} color={C.red} /> : <Activity size={30} color={C.redL} />}
                {r.label}
              </div>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* ---------- FASE 2: TROCA DE GAVETA ---------- */}
      {phase2 > 0 ? (
        <AbsoluteFill style={{opacity: phase2}}>
          <At x={960} y={215} center>
            <Pegadinha at={b9} />
          </At>
          <At x={260} y={290} w={1400} h={480}>
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 36,
                border: `4px solid ${C.dfc}`,
                background: `${C.dfc}12`,
                boxShadow: `0 0 60px ${C.dfc}33`,
                position: 'relative',
              }}
            >
              <div style={{position: 'absolute', top: 22, left: 0, right: 0, textAlign: 'center'}}>
                <Txt size={36} weight={800} color={C.dfcL}>
                  Caixa e equivalentes de caixa
                </Txt>
              </div>
              {[
                {x: 70, icon: Landmark, label: 'Conta no banco'},
                {x: 750, icon: PiggyBank, label: 'Aplicação (equivalente de caixa)'},
              ].map((d, i) => (
                <div
                  key={d.label}
                  style={{
                    position: 'absolute',
                    left: d.x,
                    top: 110,
                    width: 580,
                    height: 300,
                    borderRadius: 26,
                    background: 'rgba(255,255,255,0.05)',
                    border: `2px dashed ${C.dfcL}88`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingBottom: 30,
                    opacity: ease(f, b9 + 6 + i * 8, 12),
                  }}
                >
                  <d.icon size={64} color={C.dfcL} />
                  <Txt size={32} weight={700} style={{marginTop: 12}}>
                    {d.label}
                  </Txt>
                </div>
              ))}
            </div>
          </At>
          {/* moeda que troca de gaveta */}
          {(() => {
            const t0 = c.at('b10', 'apliquei');
            const p = move(f, t0, 34);
            const x = interpolate(p, [0, 1], [620, 1300]);
            const y = 520 - Math.sin(p * Math.PI) * 150;
            const sc = 1 + 0.15 * Math.sin(p * Math.PI);
            return (
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  transform: `translate(-50%,-50%) scale(${sc * ease(f, b9 + 14, 10)})`,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 30%, #FDE68A, ${C.dva})`,
                  border: '5px solid #FEF3C7',
                  boxShadow: `0 0 40px ${C.dva}88`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircleDollarSign size={70} color="#78350F" strokeWidth={2.2} />
              </div>
            );
          })()}
          {/* total não muda */}
          <At x={960} y={815} center>
            <Appear at={c.at('b11', 'gaveta')} dir="up">
              <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.dfcL, whiteSpace: 'nowrap'}}>
                <Equal size={36} />O total do grupo não muda
              </div>
            </Appear>
          </At>
          <At x={960} y={545} center>
            <Stamp at={c.s('b11')} size={78}>
              NÃO É FLUXO
            </Stamp>
          </At>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
