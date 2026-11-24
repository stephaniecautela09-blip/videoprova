import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Banknote, FileText, GraduationCap, PieChart, TrendingDown, TrendingUp, Waves} from 'lucide-react';
import {Appear, At, Card, Counter, IconBadge, Pill, Title, Txt} from '../components/ui';
import {ease, fadeOut, pop, vis} from '../lib/anim';
import {useCues} from '../lib/timeline';
import {C, FONT} from '../theme';

export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = useCues();
  const a2 = c.s('a2');
  const a3 = c.s('a3');
  const a4 = c.s('a4');
  const a5 = c.s('a5');
  const a6 = c.s('a6');

  // Fase 1 — capa
  const cover = vis(f, 0, a2 + 4, 1, 14);
  // Fase 2 — “lucro não é caixa”
  const stmt = vis(f, a2 - 6, a5 + 6, 12, 14);
  const naoP = pop(f, fps, c.at('a2', 'não'), 8);
  // Fase 3 — mapa dos 3 temas
  const mapO = ease(f, a5 - 4, 14);

  const temas = [
    {k: 'DFC', at: c.at('a6', 'DFC'), color: C.dfc, icon: Waves, name: 'DFC', desc: 'De onde vem e para onde vai o caixa'},
    {k: 'DVA', at: c.at('a6', 'DVA'), color: C.dva, icon: PieChart, name: 'DVA', desc: 'Quanta riqueza gerou e para quem foi'},
    {k: 'NE', at: c.at('a6', 'Notas'), color: C.notas, icon: FileText, name: 'Notas Explicativas', desc: 'O que explica os números'},
  ];

  return (
    <AbsoluteFill>
      {/* CAPA */}
      {cover > 0 ? (
        <AbsoluteFill style={{opacity: cover, alignItems: 'center', justifyContent: 'center', paddingBottom: 120}}>
          <Appear at={2} dir="scale">
            <IconBadge icon={GraduationCap} color={C.intro} size={120} />
          </Appear>
          <Appear at={6} style={{marginTop: 30}}>
            <Txt size={30} color={C.intro} weight={800} style={{letterSpacing: 8, textAlign: 'center'}}>
              REVISÃO PARA A PROVA
            </Txt>
          </Appear>
          <Appear at={10} style={{marginTop: 14}}>
            <Title size={104} weight={900} style={{textAlign: 'center'}}>
              Tópicos em Contabilidade II
            </Title>
          </Appear>
          <div style={{display: 'flex', gap: 24, marginTop: 40}}>
            <Appear at={16} dir="scale">
              <Pill color={C.dfc}>DFC</Pill>
            </Appear>
            <Appear at={20} dir="scale">
              <Pill color={C.dva}>DVA</Pill>
            </Appear>
            <Appear at={24} dir="scale">
              <Pill color={C.notas}>Notas Explicativas</Pill>
            </Appear>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* LUCRO NÃO É CAIXA */}
      {stmt > 0 ? (
        <AbsoluteFill style={{opacity: stmt}}>
          <At x={960} y={250} center>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.text, letterSpacing: -3, whiteSpace: 'nowrap'}}>
              Lucro{' '}
              <span style={{color: C.red, display: 'inline-block', transform: `scale(${0.5 + 0.5 * naoP})`, opacity: naoP}}>não</span> é
              caixa.
            </div>
          </At>
          <At x={230} y={400} w={640}>
            <Appear at={a3} dir="left" dist={80}>
              <Card style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                  <IconBadge icon={TrendingUp} color={C.intro} size={80} />
                  <Txt size={40} weight={700}>
                    Lucro
                  </Txt>
                </div>
                <Counter at={c.at('a3', 'tres')} to={3900} size={120} color={C.text} />
                <Txt size={28} color={C.muted}>
                  Cia Exemplo — resultado do período
                </Txt>
              </Card>
            </Appear>
          </At>
          <At x={960} y={560} center>
            <Appear at={c.at('a4', 'consumiu')} dir="scale">
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 130, color: C.red}}>≠</div>
            </Appear>
          </At>
          <At x={1050} y={400} w={640}>
            <Appear at={a4} dir="right" dist={80}>
              <Card color={`${C.dfc}AA`} style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                  <IconBadge icon={Banknote} color={C.dfc} size={80} />
                  <Txt size={40} weight={700}>
                    Caixa operacional
                  </Txt>
                  <TrendingDown size={54} color={C.red} strokeWidth={2.6} style={{opacity: ease(f, c.at('a4', 'consumiu'), 10)}} />
                </div>
                <Counter at={c.at('a4', 'mil')} to={-1800} size={120} color={C.red} />
                <Txt size={28} color={C.muted}>
                  Cia Exemplo — caixa das operações
                </Txt>
              </Card>
            </Appear>
          </At>
        </AbsoluteFill>
      ) : null}

      {/* MAPA DOS 3 TEMAS */}
      {f >= a5 - 4 ? (
        <AbsoluteFill style={{opacity: mapO * fadeOut(f, c.dur - 14, 12)}}>
          <At x={960} y={215} center>
            <Txt size={56} weight={800} style={{whiteSpace: 'nowrap'}}>
              Hoje: 3 temas
            </Txt>
          </At>
          <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            {temas.map((t, i) => {
              const x = 420 + i * 540;
              const p = ease(f, t.at - 6, 16);
              return (
                <line key={t.k} x1={960} y1={270} x2={960 + (x - 960) * p} y2={270 + (380 - 270) * p} stroke={t.color} strokeWidth={4} strokeDasharray="10 10" opacity={0.7} />
              );
            })}
          </svg>
          {temas.map((t, i) => {
            const x = 420 + i * 540;
            const p = pop(f, fps, t.at, 11);
            const bob = Math.sin((f - t.at) / 18 + i) * 6;
            if (f < t.at) return null;
            return (
              <At key={t.k} x={x} y={560 + bob} center>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${p})`, width: 460}}>
                  <div
                    style={{
                      width: 250,
                      height: 250,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 35% 30%, ${t.color}66, ${t.color}18 70%)`,
                      border: `4px solid ${t.color}`,
                      boxShadow: `0 0 60px ${t.color}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <t.icon size={110} color={t.color} strokeWidth={2} />
                  </div>
                  <Txt size={48} weight={800} style={{marginTop: 22, color: t.color, textAlign: 'center'}}>
                    {t.name}
                  </Txt>
                  <Txt size={28} color={C.muted} weight={500} style={{marginTop: 6, textAlign: 'center'}}>
                    {t.desc}
                  </Txt>
                </div>
              </At>
            );
          })}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
