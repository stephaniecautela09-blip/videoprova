import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ArrowLeftRight, ArrowRight, Croissant, Crown, Factory, Handshake, Landmark, Package, Receipt, Scale, Users, Wheat, X} from 'lucide-react';
import {Appear, At, Card, Counter, DrawPath, IconBadge, Pegadinha, Pill, SceneHeader, Strike, Txt} from '../components/ui';
import {ease, move, pop, vis} from '../lib/anim';
import {useCues} from '../lib/timeline';
import {C, FONT, MONO} from '../theme';

const BX = [1095, 1295, 1495, 1695]; // centros dos baldes
const BTOP = 450;
const BH = 220;

const Bucket: React.FC<{x: number; at: number; fill: number; icon: React.ElementType; label: string; sub: string; flash?: number}> = ({x, at, fill, icon: Icon, label, sub, flash = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(f, fps, at, 12);
  if (f < at) return null;
  const lvl = BH * (0.15 + 0.6 * fill);
  return (
    <div style={{position: 'absolute', left: x - 85, top: BTOP, width: 170, transform: `scale(${p})`, transformOrigin: 'bottom center'}}>
      <svg width={170} height={BH} style={{overflow: 'visible'}}>
        <defs>
          <clipPath id={`bk${x}`}>
            <path d={`M 8 0 L 162 0 L 140 ${BH} L 30 ${BH} Z`} />
          </clipPath>
        </defs>
        <g clipPath={`url(#bk${x})`}>
          <path
            d={`M 0 ${BH - lvl} ${Array.from({length: 10})
              .map((_, i) => `L ${i * 20} ${BH - lvl + Math.sin(i / 1.5 + f / 7 + x) * 5}`)
              .join(' ')} L 170 ${BH - lvl} L 170 ${BH} L 0 ${BH} Z`}
            fill={`${C.dva}AA`}
          />
        </g>
        <path d={`M 8 0 L 162 0 L 140 ${BH} L 30 ${BH} Z`} fill="none" stroke={flash > 0 ? C.red : C.dvaL} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', top: 70, width: 170, display: 'flex', justifyContent: 'center'}}>
        <Icon size={64} color="white" strokeWidth={2} />
      </div>
      <div style={{textAlign: 'center', marginTop: 10}}>
        <Txt size={32} weight={800} color={C.dvaL}>
          {label}
        </Txt>
        <Txt size={19} color={C.muted} weight={500}>
          {sub}
        </Txt>
      </div>
      {flash > 0 ? (
        <div style={{position: 'absolute', top: 60, left: 35, opacity: flash}}>
          <X size={100} color={C.red} strokeWidth={3.5} />
        </div>
      ) : null}
    </div>
  );
};

export const S7: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = useCues();
  const g2 = c.s('g2');
  const g8 = c.s('g8');
  const g9 = c.s('g9');
  const g16 = c.s('g16');

  const p0 = vis(f, 0, g2 + 4, 1, 12);
  const p1 = vis(f, g2, g8 + 4, 12, 14);
  const p2 = vis(f, g8, g9 + 4, 12, 14);
  const funnelO = vis(f, g9, g16 + 4, 12, 14);
  const bucketsO = ease(f, c.s('g13'), 1);

  const stations = [
    {line: 'g3', icon: Wheat, who: 'Agricultor', what: 'Trigo', price: 250, add: 250, w: 'duzentos', addAt: c.e('g3') - 6},
    {line: 'g4', icon: Factory, who: 'Moinho', what: 'Farinha', price: 400, add: 150, w: 'quatrocentos', addAt: c.at('g4', 'Agregou')},
    {line: 'g5', icon: Croissant, who: 'Padaria', what: 'Pão', price: 1000, add: 600, w: 'mil', addAt: c.at('g5', 'Agregou')},
  ];

  const funnel = [
    {n: 1, t: 'Receitas', at: c.at('g10', 'Receitas')},
    {n: 2, t: '(−) Insumos adquiridos de terceiros', at: c.at('g10', 'insumos')},
    {n: 3, t: '(=) Valor adicionado bruto', at: c.at('g10', 'bruto')},
    {n: 4, t: '(−) Retenções (ex.: depreciação)', at: c.at('g11', 'retencoes')},
    {n: 5, t: '(=) Valor adicionado líquido', at: c.at('g11', 'liquido')},
    {n: 6, t: '(+) Recebido em transferência', at: c.at('g12', 'transferencia')},
    {n: 7, t: '(=) Valor adicionado a distribuir', at: c.at('g12', 'item')},
    {n: 8, t: 'Distribuição do valor adicionado', at: c.at('g13', 'oito')},
  ];
  const gold = ease(f, c.s('g15'), 14);

  // pegadinhas: fichas que mudam de balde
  const inssAt = c.at('g18', 'patronal');
  const inssMove = move(f, c.at('g18', 'Governo'), 22);
  const inssDrop = move(f, c.at('g18', 'Pessoal') + 10, 16);
  const pessoalFlash = f >= c.at('g18', 'nao') ? vis(f, c.at('g18', 'nao'), c.e('g18') + 20, 6, 10) : 0;
  const alugAt = c.s('g19');
  const alugDrop = move(f, c.at('g19', 'Terceiros'), 20);

  return (
    <AbsoluteFill>
      <SceneHeader num={7} title="DVA" color={C.dva} sub="Demonstração do Valor Adicionado" />

      {/* g1 — pergunta central */}
      {p0 > 0 ? (
        <AbsoluteFill style={{opacity: p0, alignItems: 'center', justifyContent: 'center', paddingBottom: 140}}>
          <Appear at={c.at('g1', 'quanta') - 4} dir="up">
            <Title2>Quanta riqueza a empresa gerou?</Title2>
          </Appear>
          <Appear at={c.at('g1', 'para quem') - 4} dir="up" style={{marginTop: 26}}>
            <Title2 color={C.dvaL}>E para quem foi?</Title2>
          </Appear>
        </AbsoluteFill>
      ) : null}

      {/* ---------- P1: cadeia do pão ---------- */}
      {p1 > 0 ? (
        <AbsoluteFill style={{opacity: p1}}>
          {stations.map((s, i) => {
            const x = 380 + i * 580;
            return (
              <React.Fragment key={s.who}>
                <At x={x - 240} y={240} w={480}>
                  <Appear at={c.s(s.line) - 2} dir="up">
                    <Card color={`${C.dva}AA`} glow={0.3} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '24px 26px'}}>
                      <IconBadge icon={s.icon} color={C.dvaL} size={92} />
                      <div>
                        <Txt size={26} color={C.muted} weight={600}>
                          {s.who}
                        </Txt>
                        <Txt size={38} weight={800}>
                          {s.what}
                        </Txt>
                        <div style={{display: 'flex', alignItems: 'baseline', gap: 10, whiteSpace: 'nowrap'}}>
                          <Txt size={24} color={C.muted} weight={500}>
                            vende por
                          </Txt>
                          <Counter at={c.at(s.line, s.w)} to={s.price} size={48} color={C.text} dur={16} />
                        </div>
                      </div>
                    </Card>
                  </Appear>
                </At>
                {i < 2 ? (
                  <At x={x + 248} y={330}>
                    <Appear at={c.s(stations[i + 1].line) - 4} dir="right" dist={30}>
                      <ArrowRight size={60} color={C.dvaL} strokeWidth={3} />
                    </Appear>
                  </At>
                ) : null}
                <At x={x} y={500} center>
                  <Appear at={s.addAt} dir="scale">
                    <Pill color={C.dva} solid size={30}>
                      agregou <span style={{fontFamily: MONO}}>+{s.add}</span>
                    </Pill>
                  </Appear>
                </At>
              </React.Fragment>
            );
          })}
          {/* soma errada */}
          <At x={960} y={620} center>
            <Appear at={c.s('g6')} dir="up">
              <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.muted, whiteSpace: 'nowrap'}}>
                Soma das vendas:
                <span style={{fontFamily: MONO, color: C.text}}>250 + 400 + 1.000 = 1.650</span>
                <Strike at={c.at('g6', 'conta')} />
              </div>
            </Appear>
          </At>
          <At x={960} y={676} center>
            <Appear at={c.at('g6', 'conta') + 4} dir="up">
              <Txt size={28} color={C.redL} weight={700}>
                conta o trigo várias vezes
              </Txt>
            </Appear>
          </At>
          {/* soma certa */}
          <At x={960} y={760} center>
            <Appear at={c.s('g7')} dir="scale">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: '14px 34px',
                  borderRadius: 22,
                  background: `${C.dva}22`,
                  border: `3px solid ${C.dva}`,
                  boxShadow: `0 0 40px ${C.dva}55`,
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 40,
                  color: C.text,
                  whiteSpace: 'nowrap',
                }}
              >
                Valor adicionado:
                <span style={{fontFamily: MONO, color: C.dvaL}}>250 + 150 + 600 = 1.000</span>
                <Appear at={c.at('g7', 'Produto')} dir="scale">
                  <Pill color={C.dva} solid size={30}>
                    PIB
                  </Pill>
                </Appear>
              </div>
            </Appear>
          </At>
        </AbsoluteFill>
      ) : null}

      {/* ---------- P2: fórmula ---------- */}
      {p2 > 0 ? (
        <AbsoluteFill style={{opacity: p2, alignItems: 'center', justifyContent: 'center', paddingBottom: 120}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
            {[
              {w: 'vendas', t: 'Vendas', icon: Receipt, op: ''},
              {w: 'insumos', t: 'Insumos', icon: Package, op: '−'},
              {w: 'transferencias', t: 'Transferências', icon: ArrowLeftRight, op: '+'},
            ].map((k) => (
              <Appear key={k.t} at={c.at('g8', k.w) - 4} dir="scale" style={{display: 'flex', alignItems: 'center', gap: 30}}>
                {k.op ? <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 90, color: C.dvaL}}>{k.op}</span> : null}
                <Card color={C.dva} glow={0.5} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '30px 40px'}}>
                  <k.icon size={70} color={C.dvaL} />
                  <Txt size={50} weight={900}>
                    {k.t}
                  </Txt>
                </Card>
              </Appear>
            ))}
          </div>
          <Appear at={c.e('g8') - 6} dir="up" style={{marginTop: 46}}>
            <Txt size={44} weight={800} color={C.dvaL}>
              = valor adicionado a distribuir
            </Txt>
          </Appear>
        </AbsoluteFill>
      ) : null}

      {/* ---------- P3: funil 1–8 ---------- */}
      {funnelO > 0 ? (
        <AbsoluteFill style={{opacity: funnelO}}>
          {funnel.map((r, i) => {
            const w = r.n === 8 ? 780 : 780 - i * 36;
            const p = pop(f, fps, r.at, 14);
            const glow = (r.n === 7 || r.n === 8) ? gold : 0;
            if (f < r.at) return null;
            return (
              <div
                key={r.n}
                style={{
                  position: 'absolute',
                  left: 510 - w / 2,
                  top: 214 + i * 74,
                  width: w,
                  height: 64,
                  borderRadius: 16,
                  background: r.n === 8 ? `${C.dva}44` : [3, 5, 7].includes(r.n) ? `${C.dva}2A` : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${glow > 0 ? C.dvaL : `${C.dva}88`}`,
                  boxShadow: glow > 0 ? `0 0 ${36 * glow}px ${C.dva}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  paddingLeft: 12,
                  transform: `translateY(${(1 - p) * -24}px)`,
                  opacity: Math.min(1, p * 1.4),
                }}
              >
                <div style={{width: 44, height: 44, borderRadius: 12, background: C.dva, color: '#1F1300', fontFamily: MONO, fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  {r.n}
                </div>
                <Txt size={26} weight={[3, 5, 7, 8].includes(r.n) ? 800 : 600}>
                  {r.t}
                </Txt>
              </div>
            );
          })}
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            <DrawPath d="M 905 760 C 960 760, 960 700, 1010 690" at={c.at('g13', 'distribui')} dur={16} color={C.dvaL} width={6} arrow />
          </svg>
          <At x={1495} y={300} center>
            <Appear at={c.s('g15')} dir="scale" damping={9}>
              <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 38px', borderRadius: 26, background: `linear-gradient(135deg, ${C.dva}, ${C.dvaD})`, boxShadow: `0 0 60px ${C.dva}AA`, whiteSpace: 'nowrap'}}>
                <Scale size={56} color="#1F1300" strokeWidth={2.4} />
                <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: '#1F1300'}}>Item 7 = Item 8</span>
              </div>
            </Appear>
          </At>
          <At x={1495} y={380} center>
            <Appear at={c.at('g15', 'Tudo')} dir="up">
              <Txt size={28} color={C.dvaL} weight={700} style={{whiteSpace: 'nowrap'}}>
                tudo o que foi gerado é distribuído
              </Txt>
            </Appear>
          </At>
        </AbsoluteFill>
      ) : null}

      {/* baldes (P3 e P4) */}
      {bucketsO > 0 ? (
        <AbsoluteFill>
          <Bucket x={BX[0]} at={c.at('g14', 'Pessoal')} fill={ease(f, c.at('g14', 'Pessoal'), 40)} icon={Users} label="Pessoal" sub="empregados" flash={pessoalFlash} />
          <Bucket x={BX[1]} at={c.at('g14', 'Governo')} fill={ease(f, c.at('g14', 'Governo'), 40) + 0.3 * inssDrop} icon={Landmark} label="Governo" sub="impostos, taxas e contrib." />
          <Bucket x={BX[2]} at={c.at('g14', 'Terceiros')} fill={ease(f, c.at('g14', 'Terceiros'), 40) + 0.3 * alugDrop} icon={Handshake} label="Terceiros" sub="juros e aluguéis" />
          <Bucket x={BX[3]} at={c.at('g14', 'socios')} fill={ease(f, c.at('g14', 'socios'), 40)} icon={Crown} label="Sócios" sub="capital próprio" />
        </AbsoluteFill>
      ) : null}

      {/* ---------- P4: pegadinhas ---------- */}
      {f >= g16 ? (
        <AbsoluteFill style={{opacity: ease(f, g16, 12)}}>
          <At x={960} y={215} center>
            <Pegadinha at={g16} label="3 PEGADINHAS" />
          </At>
          {[
            {line: 'g17', n: 1, t: 'Receita e insumos pelo valor BRUTO', s: 'com os tributos incluídos'},
            {line: 'g18', n: 2, t: 'INSS patronal → Governo', s: 'não vai para Pessoal'},
            {line: 'g19', n: 3, t: 'Aluguel → Terceiros', s: 'não é insumo'},
          ].map((k, i) => (
            <At key={k.n} x={120} y={290 + i * 160} w={790}>
              <Appear at={c.s(k.line) - 2} dir="left" dist={60}>
                <Card color={`${C.red}AA`} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '20px 26px'}}>
                  <div style={{width: 62, height: 62, borderRadius: 18, background: C.red, color: 'white', fontFamily: MONO, fontWeight: 800, fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    {k.n}
                  </div>
                  <div>
                    <Txt size={34} weight={800}>
                      {k.t}
                    </Txt>
                    <Txt size={26} color={C.redL} weight={600}>
                      {k.s}
                    </Txt>
                  </div>
                </Card>
              </Appear>
            </At>
          ))}
          {/* ficha INSS patronal */}
          {f >= inssAt && inssDrop < 1 ? (
            <div
              style={{
                position: 'absolute',
                left: interpolate(inssMove, [0, 1], [BX[0], BX[1]]),
                top: 380 + inssDrop * 120 - Math.sin(inssMove * Math.PI) * 60,
                transform: `translate(-50%,-50%) scale(${pop(f, fps, inssAt, 12) * (1 - 0.5 * inssDrop)})`,
                opacity: 1 - inssDrop,
              }}
            >
              <Pill color={C.dvaL} solid size={26}>
                INSS patronal
              </Pill>
            </div>
          ) : null}
          {/* ficha Aluguel */}
          {f >= alugAt && alugDrop < 1 ? (
            <div
              style={{
                position: 'absolute',
                left: BX[2],
                top: 300 + alugDrop * 200,
                transform: `translate(-50%,-50%) scale(${pop(f, fps, alugAt, 12) * (1 - 0.5 * alugDrop)})`,
                opacity: 1 - alugDrop,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Pill color={C.dvaL} solid size={26}>
                Aluguel
              </Pill>
              <div style={{position: 'relative', fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.redL}}>
                insumo
                <Strike at={alugAt + 6} width={4} />
              </div>
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

const Title2: React.FC<{color?: string; children: React.ReactNode}> = ({color = C.text, children}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, color, letterSpacing: -2, textAlign: 'center'}}>{children}</div>
);
