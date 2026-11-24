import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Landmark, Search, Users} from 'lucide-react';
import {Appear, At, Counter, Pill, SceneHeader, Txt} from '../components/ui';
import {ease, move} from '../lib/anim';
import {useCues} from '../lib/timeline';
import {C, FONT, MONO} from '../theme';

// escala do gráfico: valor → x
const X0 = 817.5;
const K = 0.045;
const xv = (v: number) => X0 + v * K;

export const S6: React.FC = () => {
  const f = useCurrentFrame();
  const c = useCues();
  const rows = [
    {line: 'f2', label: 'Operacional', color: C.op, from: 0, to: -1800, y: 300},
    {line: 'f3', label: 'Investimento', color: C.inv, from: -1800, to: -6800, y: 430},
    {line: 'f4', label: 'Financiamento', color: C.fin, from: -6800, to: 11700, y: 560},
    {line: 'f5', label: 'Variação do caixa', color: C.dfc, from: 0, to: 11700, y: 705, total: true},
  ];
  const f6 = c.s('f6');
  const focusFin = ease(f, c.at('f6', 'origem'), 14);
  const BH = 76;

  return (
    <AbsoluteFill>
      <SceneHeader num={6} title="Cia Exemplo em 60 segundos" color={C.dfc} sub="Lendo a DFC" />

      {/* eixo zero */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={X0} y1={240} x2={X0} y2={760} stroke={C.muted} strokeWidth={3} strokeDasharray="8 10" opacity={ease(f, c.s('f1'), 16)} />
        <text x={X0} y={232} textAnchor="middle" fill={C.muted} fontFamily={MONO} fontWeight={700} fontSize={26} opacity={ease(f, c.s('f1'), 16)}>
          0
        </text>
        {/* conectores da cascata */}
        {[
          {x: xv(-1800), y1: 300 + BH / 2, y2: 430 - BH / 2, at: c.s('f3')},
          {x: xv(-6800), y1: 430 + BH / 2, y2: 560 - BH / 2, at: c.s('f4')},
          {x: xv(11700), y1: 560 + BH / 2, y2: 705 - BH / 2, at: c.s('f5')},
        ].map((k, i) => (
          <line key={i} x1={k.x} y1={k.y1} x2={k.x} y2={k.y1 + (k.y2 - k.y1) * ease(f, k.at - 6, 10)} stroke={C.muted} strokeWidth={3} strokeDasharray="6 6" opacity={f >= k.at - 6 ? 0.8 : 0} />
        ))}
      </svg>

      {rows.map((r, i) => {
        const at = c.s(r.line);
        const g = move(f, at + 4, 22);
        const cur = interpolate(g, [0, 1], [r.from, r.to]);
        const left = Math.min(xv(r.from), xv(cur));
        const width = Math.abs(xv(cur) - xv(r.from));
        const neg = r.to - r.from < 0;
        const dim = r.line === 'f4' ? 1 : 1 - 0.6 * focusFin;
        const barColor = neg ? C.red : r.color;
        return (
          <React.Fragment key={r.label}>
            <At x={110} y={r.y - 30} w={360}>
              <Appear at={at - 4} dir="right" dist={30}>
                <div style={{textAlign: 'right', opacity: dim}}>
                  <Txt size={r.total ? 34 : 36} weight={800} color={r.total ? C.text : r.color}>
                    {r.label}
                  </Txt>
                </div>
              </Appear>
            </At>
            {f >= at ? (
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: r.y - BH / 2,
                  width,
                  height: BH,
                  borderRadius: 14,
                  background: r.total ? `linear-gradient(90deg, ${C.dfc}, ${C.dfcL})` : `linear-gradient(90deg, ${barColor}CC, ${barColor})`,
                  boxShadow: `0 0 30px ${barColor}66`,
                  opacity: dim,
                  border: r.total ? '3px solid white' : 'none',
                }}
              />
            ) : null}
            <At x={1420} y={r.y - 40} w={360}>
              <Appear at={at} dir="left" dist={30}>
                <div style={{opacity: dim, display: 'flex', justifyContent: 'flex-end'}}>
                  <Counter at={at + 4} to={r.to - r.from} dur={22} sign size={r.total ? 70 : 64} color={neg ? C.redL : r.total ? C.dfcL : C.text} />
                </div>
              </Appear>
            </At>
          </React.Fragment>
        );
      })}
      {/* linha do total */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <line x1={110} y1={640} x2={110 + 1670 * ease(f, c.s('f5') - 8, 16)} y2={640} stroke={C.line} strokeWidth={3} />
      </svg>

      {/* leitura */}
      {f >= f6 ? (
        <>
          {(() => {
            const t = move(f, f6, 30);
            const x = interpolate(t, [0, 1], [1600, 1000]);
            const y = interpolate(t, [0, 1], [705, 560]);
            const o = Math.min(ease(f, f6, 8), 1 - ease(f, c.s('f8') + 10, 10));
            return (
              <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: o}}>
                <Search size={190} color={C.text} strokeWidth={1.4} style={{filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.45))'}} />
              </div>
            );
          })()}
          <At x={1180} y={118} w={640}>
            <Appear at={c.s('f7')} dir="down">
              <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px', borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: `2px solid ${C.line}`, fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.text, whiteSpace: 'nowrap'}}>
                Lucro <span style={{fontFamily: MONO, color: C.text}}>3.900</span>
                <span style={{color: C.red, fontWeight: 900, fontSize: 36}}>≠</span>
                Caixa operacional <span style={{fontFamily: MONO, color: C.redL}}>−1.800</span>
              </div>
            </Appear>
          </At>
          <At x={660} y={560} center>
            <Appear at={c.at('f8', 'socios')} dir="scale">
              <Pill color="#FFFFFF" solid icon={Users} size={30}>
                Sócios
              </Pill>
            </Appear>
          </At>
          <At x={920} y={560} center>
            <Appear at={c.at('f8', 'emprestimos')} dir="scale">
              <Pill color="#FFFFFF" solid icon={Landmark} size={30}>
                Empréstimos
              </Pill>
            </Appear>
          </At>
          {[
            {y: 430, w: 'pagou', t: 'pago com o financiamento'},
            {y: 300, w: 'cobriu', t: 'coberto pelo financiamento'},
          ].map((k) => (
            <At key={k.t} x={850} y={k.y - 26} w={540}>
              <Appear at={c.at('f9', k.w)} dir="right" dist={30}>
                <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 14, background: `${C.fin}26`, border: `2px solid ${C.fin}`, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.text, whiteSpace: 'nowrap'}}>
                  <span style={{color: C.fin, fontSize: 32}}>←</span>
                  {k.t}
                </div>
              </Appear>
            </At>
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
