import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowBigDown, ArrowBigUp, ArrowRight, Banknote, Flag, MapPin, Plus, Truck, Users} from 'lucide-react';
import {Appear, At, Card, DrawPath, IconBadge, Pegadinha, Pill, SceneHeader, Txt} from '../components/ui';
import {ease, pop, vis} from '../lib/anim';
import {useCues} from '../lib/timeline';
import {C, FONT, MONO} from '../theme';

const Up: React.FC<{color: string; size?: number}> = ({color, size = 56}) => <ArrowBigUp size={size} color={color} fill={`${color}55`} strokeWidth={2.2} />;
const Down: React.FC<{color: string; size?: number}> = ({color, size = 56}) => <ArrowBigDown size={size} color={color} fill={`${color}55`} strokeWidth={2.2} />;

export const S5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = useCues();
  const e10 = c.s('e10');
  const e16 = c.s('e16');
  const p1 = vis(f, 0, e10 + 4, 1, 14);
  const p2 = vis(f, e10, e16 + 4, 12, 14);
  const p3 = ease(f, e16, 14);
  const same = f >= c.s('e9');

  const steps = [
    {line: 'e6', w: 'lucro', t: 'Lucro líquido', sign: ''},
    {line: 'e7', w: 'soma', t: 'Itens sem efeito caixa', sub: 'ex.: depreciação', sign: '+'},
    {line: 'e8', w: 'Ajusta', t: 'Variações do capital de giro', sign: '±'},
    {line: 'e9', w: 'caixa', t: 'Caixa operacional', sign: '='},
  ];

  return (
    <AbsoluteFill>
      <SceneHeader num={5} title="Método direto x indireto" color={C.dfc} sub="Mesmo destino, dois caminhos" />

      {/* ---------- FASE 1 ---------- */}
      {p1 > 0 ? (
        <AbsoluteFill style={{opacity: p1}}>
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            <DrawPath d="M 500 640 C 500 700, 760 690, 860 708" at={c.at('e2', 'dois')} dur={22} color={C.dfcL} width={6} arrow />
            <DrawPath d="M 1420 640 C 1420 700, 1160 690, 1060 708" at={c.at('e2', 'dois') + 6} dur={22} color={C.dfcL} width={6} arrow />
          </svg>
          {/* destino */}
          <At x={960} y={755} center>
            <Appear at={c.s('e1') + 4} dir="scale">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '18px 34px',
                  borderRadius: 22,
                  background: same ? C.dfc : '#12204A',
                  border: `3px solid ${C.dfcL}`,
                  boxShadow: same ? `0 0 ${40 + 18 * Math.sin(f / 6)}px ${C.dfc}` : 'none',
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 34,
                  color: 'white',
                  whiteSpace: 'nowrap',
                }}
              >
                <Banknote size={40} />
                Caixa líquido operacional
                {same ? (
                  <span style={{marginLeft: 10, fontSize: 26, padding: '4px 14px', borderRadius: 999, background: 'white', color: C.dfcD, opacity: ease(f, c.s('e9') + 10, 10)}}>
                    mesmo número
                  </span>
                ) : null}
              </div>
            </Appear>
          </At>

          {/* direto */}
          <At x={140} y={210} w={720} h={430}>
            <Appear at={c.at('e2', 'dois')} dir="up">
              <Card color={`${C.dfc}99`} style={{height: 430}}>
                <Txt size={40} weight={900} color={C.dfcL}>
                  Método direto
                </Txt>
                <Appear at={c.s('e3')} dir="none">
                  <Txt size={26} color={C.muted} weight={500} style={{marginTop: 4}}>
                    recebimentos e pagamentos brutos
                  </Txt>
                </Appear>
                <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 18}}>
                  {[
                    {w: 'clientes', s: '+', t: 'Recebimentos de clientes', icon: Users},
                    {w: 'fornecedores', s: '−', t: 'Pagamentos a fornecedores', icon: Truck},
                    {w: 'empregados', s: '−', t: 'Pagamentos a empregados', icon: Users},
                  ].map((r) => (
                    <Appear key={r.t} at={c.at('e4', r.w) - 4} dir="left" dist={40}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.05)'}}>
                        <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 40, color: r.s === '+' ? C.dfcL : C.muted, width: 30}}>{r.s}</span>
                        <r.icon size={34} color={C.dfcL} />
                        <Txt size={32} weight={700}>
                          {r.t}
                        </Txt>
                      </div>
                    </Appear>
                  ))}
                </div>
              </Card>
            </Appear>
          </At>

          {/* indireto */}
          <At x={1060} y={210} w={720} h={430}>
            <Appear at={c.at('e2', 'dois') + 6} dir="up">
              <Card color={`${C.dfc}99`} style={{height: 430, position: 'relative'}}>
                <Txt size={40} weight={900} color={C.dfcL}>
                  Método indireto
                </Txt>
                <Appear at={c.s('e5')} dir="none">
                  <Txt size={26} color={C.muted} weight={500} style={{marginTop: 4}}>
                    uma cascata, a partir do lucro
                  </Txt>
                </Appear>
                {steps.map((s, i) => {
                  const at = s.line === 'e9' ? c.s('e9') : c.at(s.line, s.w) - 4;
                  const p = pop(f, fps, at, 13);
                  if (f < at) return null;
                  return (
                    <div
                      key={s.t}
                      style={{
                        position: 'absolute',
                        left: 30 + i * 34,
                        top: 130 + i * 70,
                        width: 560,
                        height: 60,
                        borderRadius: 14,
                        background: i === 3 ? C.dfc : 'rgba(59,130,246,0.16)',
                        border: `2px solid ${C.dfcL}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        paddingLeft: 16,
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: 24,
                        color: 'white',
                        whiteSpace: 'nowrap',
                        transform: `translateY(${(1 - p) * -30}px)`,
                        opacity: Math.min(1, p * 1.5),
                      }}
                    >
                      <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 30, width: 24, color: i === 3 ? 'white' : C.dfcL}}>{s.sign}</span>
                      {s.t}
                      {s.sub ? <span style={{fontSize: 21, color: C.muted, fontWeight: 500}}>{s.sub}</span> : null}
                    </div>
                  );
                })}
              </Card>
            </Appear>
          </At>
        </AbsoluteFill>
      ) : null}

      {/* ---------- FASE 2: REGRA ---------- */}
      {p2 > 0 ? (
        <AbsoluteFill style={{opacity: p2}}>
          <At x={960} y={215} center>
            <Pegadinha at={e10} label="A REGRA QUE MAIS CAI" />
          </At>
          {[
            {x: 150, line: 'e11', ex: 'e12', what: 'Ativo', cash: 'down' as const, exT: 'Clientes a receber', exS: 'vendeu, mas não recebeu', icon: Users},
            {x: 1000, line: 'e13', ex: 'e14', what: 'Passivo', cash: 'up' as const, exT: 'Fornecedores a pagar', exS: 'comprou, mas ainda não pagou', icon: Truck},
          ].map((k) => (
            <At key={k.what} x={k.x} y={285} w={770} h={380}>
              <Appear at={c.s(k.line) - 2} dir="up">
                <Card color={k.cash === 'down' ? `${C.red}AA` : `${C.dfcL}AA`} glow={0.35} style={{height: 380}}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, marginTop: 10}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                      <Txt size={56} weight={900}>
                        {k.what}
                      </Txt>
                      <Up color={C.dfcL} size={70} />
                    </div>
                    <Appear at={c.at(k.line, k.cash === 'down' ? 'tira' : 'poe')} dir="right" dist={30}>
                      <ArrowRight size={60} color={C.muted} strokeWidth={3} />
                    </Appear>
                    <Appear at={c.at(k.line, k.cash === 'down' ? 'tira' : 'poe') + 4} dir="scale">
                      <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                        <Txt size={56} weight={900} color={k.cash === 'down' ? C.redL : C.dfcL}>
                          Caixa
                        </Txt>
                        {k.cash === 'down' ? <Down color={C.red} size={70} /> : <Up color={C.dfcL} size={70} />}
                      </div>
                    </Appear>
                  </div>
                  <Appear at={c.s(k.ex)} dir="up">
                    <div style={{marginTop: 46, display: 'flex', alignItems: 'center', gap: 22, padding: '20px 24px', borderRadius: 20, background: 'rgba(255,255,255,0.05)'}}>
                      <IconBadge icon={k.icon} color={C.dfcL} size={78} />
                      <div>
                        <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                          <Txt size={34} weight={800}>
                            {k.exT}
                          </Txt>
                          <Up color={C.dfcL} size={40} />
                        </div>
                        <Txt size={28} color={C.muted} weight={500}>
                          {k.exS}
                        </Txt>
                      </div>
                    </div>
                  </Appear>
                </Card>
              </Appear>
            </At>
          ))}
          <At x={960} y={730} center>
            <Appear at={c.s('e15')} dir="up">
              <div style={{display: 'flex', alignItems: 'center', gap: 26, padding: '16px 34px', borderRadius: 999, border: `2px solid ${C.line}`, background: 'rgba(255,255,255,0.04)', whiteSpace: 'nowrap'}}>
                <Txt size={30} color={C.muted} weight={700}>
                  Inverso:
                </Txt>
                <Txt size={32} weight={800} style={{display: 'flex', alignItems: 'center', gap: 4}}>
                  Ativo <Down color={C.muted} size={34} /> põe caixa
                </Txt>
                <Txt size={32} color={C.dim}>
                  ·
                </Txt>
                <Txt size={32} weight={800} style={{display: 'flex', alignItems: 'center', gap: 4}}>
                  Passivo <Down color={C.muted} size={34} /> tira caixa
                </Txt>
              </div>
            </Appear>
          </At>
        </AbsoluteFill>
      ) : null}

      {/* ---------- FASE 3: BRASIL / ITEM 20A ---------- */}
      {p3 > 0 ? (
        <AbsoluteFill style={{opacity: p3}}>
          <At x={960} y={250} center>
            <Appear at={e16} dir="down">
              <Pill color={C.dfcL} icon={MapPin} size={34}>
                No Brasil
              </Pill>
            </Appear>
          </At>
          <At x={960} y={470} center>
            <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
              <Appear at={c.at('e16', 'direto')} dir="left" dist={60}>
                <Card color={C.dfc} glow={0.5} style={{width: 440, textAlign: 'center', padding: '34px 28px'}}>
                  <Txt size={44} weight={900} color={C.dfcL}>
                    Método direto
                  </Txt>
                  <Txt size={26} color={C.muted} weight={500} style={{marginTop: 8}}>
                    recebimentos e pagamentos brutos
                  </Txt>
                </Card>
              </Appear>
              <Appear at={c.at('e16', 'tambem')} dir="scale">
                <Plus size={70} color={C.text} strokeWidth={3} />
              </Appear>
              <Appear at={c.at('e16', 'conciliacao')} dir="right" dist={60}>
                <Card color={C.dfc} glow={0.5} style={{width: 640, padding: '30px 30px'}}>
                  <Txt size={44} weight={900} color={C.dfcL} style={{textAlign: 'center'}}>
                    Conciliação
                  </Txt>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 14}}>
                    <Txt size={30} weight={700}>
                      Lucro líquido
                    </Txt>
                    <ArrowRight size={40} color={C.dfcL} style={{transform: `translateX(${Math.sin(f / 6) * 6}px)`}} />
                    <Txt size={30} weight={700}>
                      Caixa operacional
                    </Txt>
                  </div>
                </Card>
              </Appear>
            </div>
          </At>
          <At x={960} y={700} center>
            <Appear at={c.s('e17')} dir="scale" damping={9}>
              <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '18px 44px', borderRadius: 24, background: C.dfc, boxShadow: `0 0 50px ${C.dfc}`, whiteSpace: 'nowrap'}}>
                <Flag size={44} color="white" />
                <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: 'white'}}>Item 20A</span>
              </div>
            </Appear>
          </At>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
