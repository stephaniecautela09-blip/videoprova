import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowDown, Banknote, Briefcase, Building2, Check, Cog, Landmark, X} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {Appear, At, Card, IconBadge, Pegadinha, Pill, SceneHeader, Txt} from '../components/ui';
import {ease, fadeOut, move, pop} from '../lib/anim';
import {useCues} from '../lib/timeline';
import {C, FONT, MONO} from '../theme';

type Row = {line: string; color: string; icon: LucideIcon; name: string; sub: string; chips: {w: string; t: string; s: '+' | '−'}[]};

export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = useCues();
  const c9 = c.s('c9');
  const phase1 = fadeOut(f, c9 - 4, 14);

  const rows: (Row & {chipLine: string})[] = [
    {
      line: 'c3', chipLine: 'c4', color: C.op, icon: Briefcase, name: 'Operacional', sub: 'o dia a dia do negócio',
      chips: [{w: 'Receber', t: 'Receber de clientes', s: '+'}, {w: 'fornecedores', t: 'Pagar fornecedores', s: '−'}, {w: 'salarios', t: 'Pagar salários', s: '−'}],
    },
    {
      line: 'c5', chipLine: 'c6', color: C.inv, icon: Building2, name: 'Investimento', sub: 'ativos de longo prazo',
      chips: [{w: 'maquina', t: 'Comprar máquina', s: '−'}, {w: 'imovel', t: 'Vender imóvel', s: '+'}, {w: 'participacao', t: 'Comprar participação', s: '−'}],
    },
    {
      line: 'c7', chipLine: 'c8', color: C.fin, icon: Landmark, name: 'Financiamento', sub: 'sócios e credores',
      chips: [{w: 'Aporte', t: 'Aporte dos sócios', s: '+'}, {w: 'Emprestimo', t: 'Empréstimo recebido', s: '+'}, {w: 'Pagamento', t: 'Pagar o principal', s: '−'}],
    },
  ];
  const Y = [300, 490, 680];
  const pipesIn = ease(f, c.s('c2'), 20);
  const water = interpolate(f, [c.s('c2'), c9], [0.25, 0.7], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // fase 2
  const c10 = c.s('c10');
  const split = move(f, c.at('c11', 'juros'), 24);
  const c12 = c.s('c12');

  return (
    <AbsoluteFill>
      <SceneHeader num={3} title="Os 3 canos do caixa" color={C.dfc} sub="Operacional · Investimento · Financiamento" />

      {phase1 > 0 ? (
        <AbsoluteFill style={{opacity: phase1}}>
          {/* tanque */}
          <At x={1500} y={210} w={300} h={560}>
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 34,
                border: `4px solid ${C.dfcL}`,
                background: 'rgba(255,255,255,0.04)',
                overflow: 'hidden',
                position: 'relative',
                opacity: pipesIn,
              }}
            >
              <svg width={300} height={560} style={{position: 'absolute', left: 0, top: 0}}>
                <path
                  d={`M 0 ${560 * (1 - water)} ${Array.from({length: 16})
                    .map((_, i) => `L ${i * 20} ${560 * (1 - water) + Math.sin(i / 2 + f / 8) * 8}`)
                    .join(' ')} L 300 ${560 * (1 - water)} L 300 560 L 0 560 Z`}
                  fill={`${C.dfc}88`}
                />
              </svg>
              <div style={{position: 'absolute', top: 24, width: '100%', textAlign: 'center'}}>
                <Banknote size={60} color={C.text} />
                <Txt size={38} weight={900}>
                  Caixa
                </Txt>
              </div>
            </div>
          </At>

          {rows.map((r, i) => {
            const on = ease(f, c.s(r.line), 14);
            const y = Y[i];
            return (
              <React.Fragment key={r.name}>
                {/* cano */}
                <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: pipesIn}}>
                  <rect x={455} y={y - 28} width={1055} height={56} rx={28} fill="rgba(255,255,255,0.05)" stroke={on > 0 ? r.color : C.line} strokeWidth={3} />
                  {on > 0 ? (
                    <line x1={490} y1={y} x2={1500} y2={y} stroke={r.color} strokeWidth={10} strokeLinecap="round" strokeDasharray="26 22" strokeDashoffset={-(f - c.s(r.line)) * 4} opacity={0.85 * on} />
                  ) : null}
                </svg>
                {/* rótulo */}
                <At x={120} y={y - 62} w={340}>
                  <div style={{opacity: 0.3 + 0.7 * on, transform: `scale(${0.95 + 0.05 * on})`, transformOrigin: 'left center'}}>
                    <Card color={on > 0 ? r.color : C.cardBorder} glow={on * 0.5} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px'}}>
                      <IconBadge icon={r.icon} color={r.color} size={58} />
                      <div>
                        <Txt size={28} weight={800} color={r.color}>
                          {r.name}
                        </Txt>
                        <Txt size={21} color={C.muted} weight={500}>
                          {r.sub}
                        </Txt>
                      </div>
                    </Card>
                  </div>
                </At>
                {/* exemplos */}
                {r.chips.map((ch, j) => {
                  const at = c.at(r.chipLine, ch.w);
                  const p = pop(f, fps, at, 12);
                  if (f < at) return null;
                  return (
                    <At key={ch.t} x={630 + j * 330} y={y} center>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 18px',
                          borderRadius: 16,
                          background: '#0B1226',
                          border: `2px solid ${r.color}`,
                          fontFamily: FONT,
                          fontWeight: 700,
                          fontSize: 23,
                          color: C.text,
                          whiteSpace: 'nowrap',
                          transform: `scale(${p}) translateY(${Math.sin((f - at) / 15 + j) * 3}px)`,
                          boxShadow: `0 6px 20px rgba(0,0,0,0.4)`,
                        }}
                      >
                        <span style={{fontFamily: MONO, fontWeight: 800, color: ch.s === '+' ? r.color : C.muted, fontSize: 30}}>{ch.s}</span>
                        {ch.t}
                      </div>
                    </At>
                  );
                })}
              </React.Fragment>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* ---------- FASE 2 ---------- */}
      {f >= c9 ? (
        <AbsoluteFill style={{opacity: ease(f, c9, 12)}}>
          <At x={960} y={215} center>
            <Pegadinha at={c9} label="PEGADINHA · ITEM 12" />
          </At>

          {/* Parcela do empréstimo */}
          <At x={120} y={280} w={800} h={500}>
            <Appear at={c10 - 4} dir="up">
              <Card color={`${C.dfc}88`} style={{height: 500, position: 'relative'}}>
                <Txt size={36} weight={800}>
                  Parcela do empréstimo
                </Txt>
                {(() => {
                  const gap = split * 170;
                  const drop = split * 140;
                  const halves = [
                    {t: 'Juros', col: C.op, dx: -gap, side: 'l'},
                    {t: 'Principal', col: C.fin, dx: gap, side: 'r'},
                  ];
                  return [
                    <div
                      key="whole"
                      style={{
                        position: 'absolute',
                        left: 210,
                        top: 110,
                        width: 300,
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: FONT,
                        fontWeight: 800,
                        fontSize: 32,
                        color: C.text,
                        zIndex: 2,
                        opacity: ease(f, c10, 10) * (1 - Math.min(1, split * 4)),
                      }}
                    >
                      Parcela
                    </div>,
                    ...halves.map((h, i) => (
                    <div
                      key={h.t}
                      style={{
                        position: 'absolute',
                        left: 360 + (i === 0 ? -150 : 0) + h.dx,
                        top: 110 + drop,
                        width: 150,
                        height: 100,
                        background: split > 0.05 ? `${h.col}33` : `${C.dfc}33`,
                        border: `3px solid ${split > 0.05 ? h.col : C.dfcL}`,
                        borderRadius: i === 0 ? '24px 0 0 24px' : '0 24px 24px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: FONT,
                        fontWeight: 800,
                        fontSize: 28,
                        color: C.text,
                        transform: `rotate(${(i === 0 ? -1 : 1) * split * 6}deg)`,
                        opacity: ease(f, c10, 10),
                      }}
                    >
                      {split > 0.3 ? h.t : ''}
                    </div>
                  )),
                  ];
                })()}
                <div style={{position: 'absolute', left: 40, top: 380}}>
                  <Appear at={c.at('c11', 'operacional')} dir="scale">
                    <Pill color={C.op} size={28}>
                      pode ir p/ Operacional
                    </Pill>
                  </Appear>
                </div>
                <div style={{position: 'absolute', right: 40, top: 380}}>
                  <Appear at={c.at('c11', 'principal')} dir="scale">
                    <Pill color={C.fin} solid size={28}>
                      vai p/ Financiamento
                    </Pill>
                  </Appear>
                </div>
              </Card>
            </Appear>
          </At>

          {/* Compra financiada */}
          <At x={1000} y={280} w={800} h={500}>
            <Appear at={c12 - 4} dir="up">
              <Card color={`${C.dfc}88`} style={{height: 500, position: 'relative'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <Cog size={44} color={C.dfcL} style={{transform: `rotate(${f * 2}deg)`}} />
                  <Txt size={36} weight={800}>
                    Compra financiada
                  </Txt>
                </div>
                <div style={{position: 'absolute', left: 40, right: 40, top: 130, height: 96, display: 'flex', borderRadius: 20, overflow: 'hidden', border: `3px solid ${C.dfcL}`}}>
                  <div style={{width: '36%', background: C.dfc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 25, color: 'white', textAlign: 'center'}}>
                    Pago em dinheiro
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: `repeating-linear-gradient(45deg, rgba(148,163,184,0.25) 0 14px, rgba(148,163,184,0.08) 14px 28px)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: 28,
                      color: C.muted,
                      opacity: 1 - 0.5 * ease(f, c.s('c13'), 14),
                    }}
                  >
                    Financiado
                  </div>
                </div>
                <div style={{position: 'absolute', left: 90, top: 250}}>
                  <Appear at={c.at('c12', 'So')} dir="down">
                    <ArrowDown size={60} color={C.dfcL} strokeWidth={3} />
                  </Appear>
                </div>
                <div style={{position: 'absolute', left: 40, top: 330}}>
                  <Appear at={c.at('c12', 'So') + 6} dir="scale">
                    <Pill color={C.dfc} solid icon={Check} size={28}>
                      Entra na DFC
                    </Pill>
                  </Appear>
                </div>
                <div style={{position: 'absolute', right: 40, top: 330}}>
                  <Appear at={c.s('c13')} dir="scale">
                    <Pill color={C.red} icon={X} size={28}>
                      Fora da DFC
                    </Pill>
                  </Appear>
                </div>
                <div style={{position: 'absolute', right: 44, top: 412}}>
                  <Appear at={c.s('c13') + 8} dir="up">
                    <Txt size={24} color={C.muted} weight={500}>
                      não passou pelo caixa
                    </Txt>
                  </Appear>
                </div>
              </Card>
            </Appear>
          </At>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
