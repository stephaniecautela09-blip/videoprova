import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {CalendarDays, Check, FastForward, FileStack, FileText, Filter, History, Sparkles, Undo2, X} from 'lucide-react';
import {Appear, At, Card, DrawPath, IconBadge, Pill, SceneHeader, Txt} from '../components/ui';
import {ease, fadeOut, move, pop} from '../lib/anim';
import {useCues} from '../lib/timeline';
import {C, FONT, MONO} from '../theme';

const G = C.notas;
const GL = C.notasL;

const SectionTitle: React.FC<{at: number; n: number; title: string; tag?: string}> = ({at, n, title, tag}) => (
  <At x={120} y={215}>
    <Appear at={at} dir="right" dist={40}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 30, color: G}}>{n}/6</div>
        <Txt size={46} weight={900}>
          {title}
        </Txt>
        {tag ? (
          <Pill color={G} solid size={26}>
            {tag}
          </Pill>
        ) : null}
      </div>
    </Appear>
  </At>
);

export const S8: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = useCues();
  const starts = [c.s('h2'), c.s('h7'), c.s('h9'), c.s('h13'), c.s('h17'), c.s('h18')];
  const end = c.s('q8');
  const sec = (i: number) => {
    const a = starts[i];
    const b = i < 5 ? starts[i + 1] : end + 30;
    const inn = ease(f, a - 2, 14);
    const out = i < 5 ? move(f, b - 6, 14) : 0;
    return {o: Math.min(inn, 1 - out), x: (1 - inn) * 80 - out * 120, show: f >= a - 2 && f < b + 10};
  };
  const cur = starts.reduce((acc, s, i) => (f >= s - 2 ? i : acc), -1);
  const intro = fadeOut(f, starts[0] - 8, 10);

  return (
    <AbsoluteFill>
      <SceneHeader num={8} title="Notas Explicativas" color={G} sub="Ritmo rápido" />

      {/* índice das 6 seções */}
      <At x={1800} y={150}>
        <div style={{display: 'flex', gap: 12, transform: 'translateX(-100%)', opacity: ease(f, 4, 14)}}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{width: i === cur ? 46 : 16, height: 16, borderRadius: 10, background: i <= cur ? G : 'rgba(148,163,184,0.3)', boxShadow: i === cur ? `0 0 14px ${G}` : 'none'}} />
          ))}
        </div>
      </At>

      {/* intro h1 */}
      {intro > 0 ? (
        <AbsoluteFill style={{opacity: intro, alignItems: 'center', justifyContent: 'center', paddingBottom: 140}}>
          <Appear at={2} dir="scale">
            <IconBadge icon={FileText} color={G} size={150} />
          </Appear>
          <Appear at={8} style={{marginTop: 30}}>
            <Txt size={84} weight={900} style={{textAlign: 'center', letterSpacing: -2}}>
              Notas Explicativas
            </Txt>
          </Appear>
          <Appear at={c.at('h1', 'Ritmo')} dir="up" style={{marginTop: 14}}>
            <Txt size={40} color={GL} weight={700} style={{textAlign: 'center'}}>
              6 pontos em ritmo rápido
            </Txt>
          </Appear>
        </AbsoluteFill>
      ) : null}

      {/* A — Sinal x ruído */}
      {sec(0).show ? (
        <AbsoluteFill style={{opacity: sec(0).o, transform: `translateX(${sec(0).x}px)`}}>
          <SectionTitle at={starts[0]} n={1} title="Sinal x ruído" />
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            {/* ruído */}
            {f >= c.s('h4') ? (
              <polyline
                points={Array.from({length: 62})
                  .map((_, i) => {
                    const x = 140 + i * 10;
                    const y = 450 + (random(`n${i}-${Math.floor(f / 3)}`) - 0.5) * 150 * ease(f, c.s('h4'), 12);
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke={C.muted}
                strokeWidth={4}
                opacity={0.85}
              />
            ) : null}
            {/* sinal */}
            {f >= c.s('h3') ? (
              <polyline
                points={Array.from({length: 120})
                  .map((_, i) => {
                    const x = 1200 + i * 5;
                    const y = 450 + Math.sin(i / 9 - f / 8) * 70 * ease(f, c.s('h3'), 14);
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke={G}
                strokeWidth={7}
                strokeLinecap="round"
              />
            ) : null}
          </svg>
          <At x={420} y={590} center>
            <Appear at={c.s('h4')} dir="up">
              <Txt size={40} weight={800} color={C.muted}>
                Ruído
              </Txt>
            </Appear>
          </At>
          <At x={420} y={640} center>
            <Appear at={c.s('h4') + 6} dir="up">
              <Txt size={26} weight={500} color={C.dim} style={{whiteSpace: 'nowrap'}}>
                informação demais, sem relevância
              </Txt>
            </Appear>
          </At>
          <At x={1500} y={590} center>
            <Appear at={c.s('h3')} dir="up">
              <Txt size={40} weight={800} color={G}>
                Sinal
              </Txt>
            </Appear>
          </At>
          <At x={1500} y={640} center>
            <Appear at={c.s('h3') + 6} dir="up">
              <Txt size={26} weight={500} color={GL} style={{whiteSpace: 'nowrap'}}>
                o que importa para decidir
              </Txt>
            </Appear>
          </At>
          <At x={960} y={450} center>
            <Appear at={c.s('h5')} dir="scale">
              <div style={{width: 380, height: 200, borderRadius: 30, border: `4px solid ${G}`, background: `${G}22`, boxShadow: `0 0 50px ${G}55`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
                <Filter size={60} color={GL} />
                <Txt size={38} weight={900}>
                  Materialidade
                </Txt>
              </div>
            </Appear>
          </At>
          <At x={960} y={720} center>
            <Appear at={c.at('h5', 'Se omitir')} dir="up">
              <div style={{padding: '14px 30px', borderRadius: 18, background: 'rgba(255,255,255,0.05)', border: `2px solid ${G}88`, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.text, whiteSpace: 'nowrap'}}>
                Material = <span style={{color: GL}}>omitir pode mudar a decisão do usuário</span>
              </div>
            </Appear>
          </At>
          <At x={960} y={800} center>
            <div style={{display: 'flex', gap: 20}}>
              <Appear at={c.at('h6', 'zero sete') - 6} dir="scale">
                <Pill color={G} size={28}>
                  OCPC 07
                </Pill>
              </Appear>
              <Appear at={c.at('h6', 'CPC cinquenta')} dir="scale">
                <Pill color={G} size={28}>
                  CPC 51
                </Pill>
              </Appear>
            </div>
          </At>
        </AbsoluteFill>
      ) : null}

      {/* B — Ordem das notas */}
      {sec(1).show ? (
        <AbsoluteFill style={{opacity: sec(1).o, transform: `translateX(${sec(1).x}px)`}}>
          <SectionTitle at={starts[1]} n={2} title="Ordem das notas" tag="CPC 26 · item 114" />
          {[
            {w: 'Declaracao', t: 'Declaração de conformidade'},
            {w: 'Resumo', t: 'Resumo das políticas contábeis'},
            {w: 'Detalhe', t: 'Detalhe dos itens, na ordem das demonstrações'},
            {w: 'outras', t: 'Outras divulgações', s: 'ex.: passivos contingentes'},
          ].map((k, i) => (
            <At key={k.t} x={300 + i * 50} y={310 + i * 112} w={1220}>
              <Appear at={c.at('h8', k.w) - 4} dir="down" dist={50}>
                <Card color={`${G}AA`} glow={0.25} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '18px 28px'}}>
                  <div style={{width: 58, height: 58, borderRadius: 16, background: G, color: '#03140D', fontFamily: MONO, fontWeight: 800, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
                  <Txt size={36} weight={800}>
                    {k.t}
                  </Txt>
                  {k.s ? (
                    <Txt size={26} color={C.muted} weight={500}>
                      {k.s}
                    </Txt>
                  ) : null}
                </Card>
              </Appear>
            </At>
          ))}
        </AbsoluteFill>
      ) : null}

      {/* C — CPC 23 */}
      {sec(2).show ? (
        <AbsoluteFill style={{opacity: sec(2).o, transform: `translateX(${sec(2).x}px)`}}>
          <SectionTitle at={starts[2]} n={3} title="Políticas, estimativas e erros" tag="CPC 23" />
          {[
            {line: 'h10', q: 'Mudou a política contábil', a: 'Retrospectiva', s: 'como se sempre tivesse sido assim', dir: -1, icon: Undo2, w: 'Retrospectiva'},
            {line: 'h11', q: 'Mudou a estimativa', a: 'Prospectiva', s: 'daqui para a frente', dir: 1, icon: FastForward, w: 'Prospectiva'},
            {line: 'h12', q: 'Achou um erro', a: 'Reapresentação retrospectiva', s: 'corrige o passado', dir: -1, icon: History, w: 'Reapresentacao'},
          ].map((k, i) => {
            const at = c.s(k.line);
            const aAt = c.at(k.line, k.w);
            const p = ease(f, aAt, 18);
            return (
              <At key={k.q} x={130 + i * 565} y={300} w={530}>
                <Appear at={at - 2} dir="up">
                  <Card color={f >= aAt ? G : `${G}66`} glow={f >= aAt ? 0.4 : 0} style={{height: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                    <Txt size={32} weight={700} color={C.muted}>
                      {k.q}?
                    </Txt>
                    <svg width={460} height={120} style={{marginTop: 18}}>
                      <line x1={20} y1={60} x2={440} y2={60} stroke={C.line} strokeWidth={4} />
                      <line x1={230} y1={36} x2={230} y2={84} stroke={C.text} strokeWidth={4} />
                      <text x={230} y={112} textAnchor="middle" fill={C.muted} fontFamily={FONT} fontSize={22} fontWeight={600}>
                        hoje
                      </text>
                      <text x={40} y={30} fill={C.dim} fontFamily={FONT} fontSize={20} fontWeight={600}>
                        passado
                      </text>
                      <text x={420} y={30} textAnchor="end" fill={C.dim} fontFamily={FONT} fontSize={20} fontWeight={600}>
                        futuro
                      </text>
                      {f >= aAt ? (
                        <line x1={230} y1={60} x2={230 + k.dir * 200 * p} y2={60} stroke={G} strokeWidth={12} strokeLinecap="round" />
                      ) : null}
                      {f >= aAt ? <circle cx={230 + k.dir * 200 * p} cy={60} r={14} fill={GL} /> : null}
                    </svg>
                    <Appear at={aAt} dir="scale" style={{marginTop: 20}}>
                      <k.icon size={64} color={GL} strokeWidth={2.4} />
                    </Appear>
                    <Appear at={aAt + 4} dir="up" style={{marginTop: 12}}>
                      <Txt size={k.a.length > 14 ? 34 : 42} weight={900} color={GL}>
                        {k.a}
                      </Txt>
                      <Txt size={26} color={C.muted} weight={500} style={{marginTop: 8}}>
                        {k.s}
                      </Txt>
                    </Appear>
                  </Card>
                </Appear>
              </At>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* D — CPC 24 */}
      {sec(3).show ? (
        <AbsoluteFill style={{opacity: sec(3).o, transform: `translateX(${sec(3).x}px)`}}>
          <SectionTitle at={starts[3]} n={4} title="Eventos subsequentes" tag="CPC 24" />
          {(() => {
            const XA = 420;
            const XB = 1500;
            const Y = 560;
            const win = ease(f, c.s('h14'), 20);
            const e1 = c.s('h15');
            const e2 = c.s('h16');
            return (
              <>
                <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                  <rect x={XA} y={Y - 34} width={(XB - XA) * win} height={68} fill={`${G}22`} rx={12} />
                  <line x1={200} y1={Y} x2={1720} y2={Y} stroke={C.muted} strokeWidth={5} opacity={ease(f, starts[3], 16)} />
                  {[XA, XB].map((x, i) => (
                    <g key={x} opacity={ease(f, i === 0 ? c.at('h14', 'data') : c.at('h14', 'autorizacao'), 12)}>
                      <circle cx={x} cy={Y} r={20} fill={i === 0 ? C.text : G} />
                    </g>
                  ))}
                  {f >= e1 ? <DrawPath d={`M 780 ${Y - 20} C 720 ${Y - 160}, 480 ${Y - 160}, ${XA + 10} ${Y - 26}`} at={c.at('h15', 'existia')} dur={18} color={G} width={5} dash="12 10" /> : null}
                  {f >= e1 ? <circle cx={780} cy={Y} r={16 * pop(f, fps, e1, 10)} fill={G} /> : null}
                  {f >= e2 ? <circle cx={1140} cy={Y} r={16 * pop(f, fps, e2, 10)} fill={C.dvaL} /> : null}
                </svg>
                <At x={XA} y={Y + 64} center>
                  <Appear at={c.at('h14', 'data')} dir="up">
                    <Txt size={30} weight={800} style={{whiteSpace: 'nowrap', textAlign: 'center'}}>
                      Data do balanço
                    </Txt>
                  </Appear>
                </At>
                <At x={XB} y={Y + 64} center>
                  <Appear at={c.at('h14', 'autorizacao')} dir="up">
                    <Txt size={30} weight={800} color={GL} style={{whiteSpace: 'nowrap', textAlign: 'center'}}>
                      Autorização para emissão
                    </Txt>
                  </Appear>
                </At>
                <At x={900} y={330} center>
                  <Appear at={c.at('h15', 'Ajusta') - 2} dir="scale" damping={10}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 30px', borderRadius: 20, background: G, boxShadow: `0 0 40px ${G}`, whiteSpace: 'nowrap'}}>
                      <Check size={40} color="#03140D" strokeWidth={3.4} />
                      <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#03140D'}}>AJUSTA</span>
                    </div>
                  </Appear>
                </At>
                <At x={580} y={395} center>
                  <Appear at={c.at('h15', 'existia')} dir="up">
                    <Txt size={26} weight={700} color={GL} style={{whiteSpace: 'nowrap'}}>
                      condição já existia
                    </Txt>
                  </Appear>
                </At>
                <At x={1140} y={735} center>
                  <Appear at={c.s('h16')} dir="up">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
                      <Txt size={26} weight={700} color={C.dvaL} style={{display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'}}>
                        <Sparkles size={28} /> condição nova, surgiu depois
                      </Txt>
                      <Appear at={c.at('h16', 'Nao ajusta')} dir="scale" damping={10}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 28px', borderRadius: 20, border: `3px solid ${G}`, background: 'rgba(7,11,24,0.9)', whiteSpace: 'nowrap'}}>
                          <X size={36} color={C.redL} strokeWidth={3.2} />
                          <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.text}}>NÃO AJUSTA</span>
                          <span style={{fontFamily: FONT, fontWeight: 700, fontSize: 30, color: GL, opacity: ease(f, c.at('h16', 'divulga'), 10)}}>· só divulga</span>
                        </div>
                      </Appear>
                    </div>
                  </Appear>
                </At>
              </>
            );
          })()}
        </AbsoluteFill>
      ) : null}

      {/* E — CPC 21 */}
      {sec(4).show ? (
        <AbsoluteFill style={{opacity: sec(4).o, transform: `translateX(${sec(4).x}px)`}}>
          <SectionTitle at={starts[4]} n={5} title="Demonstração intermediária" tag="CPC 21" />
          {(() => {
            const sq = move(f, c.at('h17', 'condensado') - 6, 22);
            return (
              <>
                <At x={560} y={520} center>
                  <Appear at={starts[4] + 2} dir="scale">
                    <div style={{position: 'relative', width: 300, height: 380}}>
                      {[0, 1, 2, 3, 4].map((k) => (
                        <div key={k} style={{position: 'absolute', left: k * 12, top: k * 12, width: 260, height: 330, borderRadius: 18, background: '#0F1D2A', border: `3px solid ${G}88`}} />
                      ))}
                      <div style={{position: 'absolute', left: 48, top: 48, width: 260, height: 330, borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
                        <FileStack size={70} color={GL} />
                        <Txt size={28} weight={800} style={{textAlign: 'center'}}>
                          Demonstrações completas
                        </Txt>
                      </div>
                    </div>
                  </Appear>
                </At>
                <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                  <DrawPath d="M 790 520 L 1110 520" at={c.at('h17', 'ITR') - 4} dur={16} color={GL} width={8} arrow />
                </svg>
                <At x={1360} y={520} center>
                  <Appear at={c.at('h17', 'ITR')} dir="scale">
                    <div
                      style={{
                        width: 300,
                        height: interpolate(sq, [0, 1], [330, 200]),
                        borderRadius: 18,
                        background: `${G}22`,
                        border: `4px solid ${G}`,
                        boxShadow: `0 0 40px ${G}66`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <CalendarDays size={56} color={GL} />
                      <Txt size={48} weight={900}>
                        ITR
                      </Txt>
                      <Txt size={26} color={GL} weight={700}>
                        trimestral
                      </Txt>
                    </div>
                  </Appear>
                </At>
                <At x={1360} y={720} center>
                  <Appear at={c.at('h17', 'condensado')} dir="up">
                    <Pill color={G} solid size={30}>
                      condensado
                    </Pill>
                  </Appear>
                </At>
              </>
            );
          })()}
        </AbsoluteFill>
      ) : null}

      {/* F — CPC 05 */}
      {sec(5).show ? (
        <AbsoluteFill style={{opacity: sec(5).o, transform: `translateX(${sec(5).x}px)`}}>
          <SectionTitle at={starts[5]} n={6} title="Partes relacionadas" tag="CPC 05" />
          {[
            {
              x: 130, ok: true, head: 'É parte relacionada', line: 'h19',
              items: [{w: 'controladora', t: 'Controladora'}, {w: 'controlada', t: 'Controlada'}, {w: 'coligada', t: 'Coligada'}, {w: 'pessoal', t: 'Pessoal-chave da administração'}],
            },
            {
              x: 1000, ok: false, head: 'Não é — só por isso', line: 'h20',
              items: [{w: 'cliente', t: 'Grande cliente ou fornecedor'}, {w: 'banco', t: 'Banco que financia'}, {w: 'administrador', t: 'Administrador em comum'}],
            },
          ].map((col) => (
            <At key={col.head} x={col.x} y={290} w={790}>
              <Appear at={c.s(col.line) - 2} dir="up">
                <Card color={col.ok ? G : `${C.red}AA`} glow={0.3} style={{minHeight: 470}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                    {col.ok ? <Check size={46} color={GL} strokeWidth={3} /> : <X size={46} color={C.redL} strokeWidth={3} />}
                    <Txt size={40} weight={900} color={col.ok ? GL : C.redL}>
                      {col.head}
                    </Txt>
                  </div>
                  <div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 14}}>
                    {col.items.map((it) => (
                      <Appear key={it.t} at={c.at(col.line, it.w) - 3} dir="left" dist={40}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: `2px solid ${col.ok ? `${G}55` : `${C.red}44`}`}}>
                          <div style={{width: 14, height: 14, borderRadius: 7, background: col.ok ? G : C.red}} />
                          <Txt size={32} weight={700}>
                            {it.t}
                          </Txt>
                        </div>
                      </Appear>
                    ))}
                  </div>
                </Card>
              </Appear>
            </At>
          ))}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
