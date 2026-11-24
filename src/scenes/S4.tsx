import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Briefcase, Building2, Landmark, Receipt, Shuffle, ThumbsUp} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {Appear, At, Card, SceneHeader, Txt} from '../components/ui';
import {ease, pop} from '../lib/anim';
import {useCues} from '../lib/timeline';
import {C, FONT} from '../theme';

type Act = 'Operacional' | 'Investimento' | 'Financiamento';
const ACT: Record<Act, {color: string; icon: LucideIcon}> = {
  Operacional: {color: C.op, icon: Briefcase},
  Investimento: {color: C.inv, icon: Building2},
  Financiamento: {color: C.fin, icon: Landmark},
};

const Tag: React.FC<{act: Act; at: number; strong?: boolean}> = ({act, at, strong}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(f, fps, at, 11);
  if (f < at) return null;
  const {color, icon: Icon} = ACT[act];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 22px',
        borderRadius: 16,
        background: strong ? color : `${color}26`,
        border: `2px solid ${color}`,
        color: strong ? '#0B1020' : C.text,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 30,
        transform: `scale(${p})`,
        transformOrigin: 'left center',
      }}
    >
      <Icon size={30} strokeWidth={2.4} color={strong ? '#0B1020' : color} />
      {act}
    </div>
  );
};

export const S4: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const rows: {line: string; label: string; sub?: string; enc: Act; alt: Act; encWord: string}[] = [
    {line: 'd3', label: 'Juros pagos', enc: 'Operacional', alt: 'Financiamento', encWord: 'operacional'},
    {line: 'd4', label: 'Juros recebidos', enc: 'Operacional', alt: 'Investimento', encWord: 'operacional'},
    {line: 'd5', label: 'Dividendos recebidos', sub: '(e JCP recebidos)', enc: 'Operacional', alt: 'Investimento', encWord: 'operacional'},
    {line: 'd6', label: 'Dividendos pagos', sub: '(e JCP pagos)', enc: 'Financiamento', alt: 'Operacional', encWord: 'financiamento'},
  ];
  const X0 = 200;
  const COLS = [520, 470, 470];
  const TOP = 220;
  const RH = 104;
  const headIn = ease(f, c.s('d2'), 14);
  return (
    <AbsoluteFill>
      <SceneHeader num={4} title="Juros e dividendos" color={C.dfc} sub="Onde classificar na DFC" />

      {/* cabeçalho da tabela */}
      <At x={X0} y={TOP} w={COLS[0] + COLS[1] + COLS[2]} h={84}>
        <div style={{display: 'flex', height: '100%', opacity: ease(f, c.s('d1'), 14)}}>
          <div style={{width: COLS[0], display: 'flex', alignItems: 'center', paddingLeft: 28}}>
            <Txt size={30} color={C.muted} weight={700}>
              Item
            </Txt>
          </div>
          {[
            {t: 'Encorajado', icon: ThumbsUp, w: 'encoraja'},
            {t: 'Alternativa', icon: Shuffle, w: 'alternativa'},
          ].map((h, i) => (
            <div key={h.t} style={{width: COLS[i + 1], display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 28, opacity: ease(f, c.at('d2', h.w), 12)}}>
              <h.icon size={36} color={i === 0 ? C.dfcL : C.muted} />
              <Txt size={34} weight={800} color={i === 0 ? C.dfcL : C.text}>
                {h.t}
              </Txt>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 0, bottom: 0, height: 3, width: `${headIn * 100}%`, background: C.dfc, borderRadius: 3}} />
      </At>

      {/* linhas */}
      {rows.map((r, i) => {
        const y = TOP + 96 + i * RH;
        const st = c.s(r.line);
        const hl = r.line === 'd6' ? ease(f, c.at('d6', 'financiamento'), 12) : 0;
        return (
          <At key={r.label} x={X0} y={y} w={COLS[0] + COLS[1] + COLS[2]} h={RH - 12}>
            <Appear at={st - 2} dir="left" dist={50}>
              <div
                style={{
                  display: 'flex',
                  height: RH - 12,
                  alignItems: 'center',
                  borderRadius: 20,
                  background: f >= st && f < c.e(r.line) + 10 ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.035)',
                  border: `2px solid ${hl > 0 ? `rgba(129,140,248,${0.3 + 0.7 * hl})` : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: hl > 0 ? `0 0 ${40 * hl}px ${C.fin}55` : 'none',
                }}
              >
                <div style={{width: COLS[0], paddingLeft: 28, display: 'flex', alignItems: 'baseline', gap: 12}}>
                  <Txt size={36} weight={800}>
                    {r.label}
                  </Txt>
                  {r.sub ? (
                    <Txt size={22} color={C.muted} weight={500}>
                      {r.sub}
                    </Txt>
                  ) : null}
                </div>
                <div style={{width: COLS[1], paddingLeft: 28}}>
                  <Tag act={r.enc} at={c.at(r.line, r.encWord)} strong />
                </div>
                <div style={{width: COLS[2], paddingLeft: 28}}>
                  <Tag act={r.alt} at={c.at(r.line, 'Alternativa')} />
                </div>
              </div>
            </Appear>
          </At>
        );
      })}

      {/* IR / CSLL */}
      <At x={X0} y={TOP + 96 + 4 * RH + 14} w={COLS[0] + COLS[1] + COLS[2]}>
        <Appear at={c.s('d7')} dir="up">
          <Card color={`${C.op}AA`} glow={0.3} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '18px 28px'}}>
            <Receipt size={46} color={C.op} />
            <Txt size={34} weight={800}>
              IR e CSLL
            </Txt>
            <Txt size={34} color={C.muted} weight={500}>
              →
            </Txt>
            <Tag act="Operacional" at={c.at('d7', 'regra')} strong />
            <Txt size={28} color={C.muted} weight={500}>
              em regra
            </Txt>
          </Card>
        </Appear>
      </At>
      {/* destaque: único fora da operacional */}
      <At x={X0 + COLS[0] + COLS[1] + COLS[2] + 20} y={TOP + 96 + 3 * RH + 10}>
        <Appear at={c.at('d6', 'operacional')} dir="right">
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.fin, width: 200, lineHeight: 1.15}}>← o único fora da operacional</div>
        </Appear>
      </At>
    </AbsoluteFill>
  );
};
