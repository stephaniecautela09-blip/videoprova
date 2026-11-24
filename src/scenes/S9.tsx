import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Check, Sparkles} from 'lucide-react';
import {Appear, At, Pegadinha, Txt} from '../components/ui';
import {ease, fadeOut, pop} from '../lib/anim';
import {useCues} from '../lib/timeline';
import {C, FONT, MONO} from '../theme';

export const S9: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = useCues();
  const items = [
    {line: 'i2', t: 'Banco → aplicação equivalente: não é fluxo', col: C.dfc, tag: 'DFC'},
    {line: 'i3', t: 'Fundos de ações e cambiais: fora do caixa', col: C.dfc, tag: 'DFC'},
    {line: 'i4', t: 'Parcela: juros de um lado, principal do outro', col: C.dfc, tag: 'DFC'},
    {line: 'i5', t: 'Compra financiada: só a parte paga em dinheiro', col: C.dfc, tag: 'DFC'},
    {line: 'i6', t: 'Ativo ↑ tira caixa · Passivo ↑ põe caixa', col: C.dfc, tag: 'DFC'},
    {line: 'i7', t: 'DVA: receita e insumos pelo valor bruto', col: C.dva, tag: 'DVA'},
    {line: 'i8', t: 'INSS patronal = Governo · Aluguel = Terceiros', col: C.dva, tag: 'DVA'},
    {line: 'i9', t: 'Evento subsequente: condição já existia → ajusta', col: C.notas, tag: 'NE'},
  ];
  const i10 = c.s('i10');
  const listO = fadeOut(f, i10 - 6, 14);
  const endP = pop(f, fps, i10, 12);

  return (
    <AbsoluteFill>
      {listO > 0 ? (
        <AbsoluteFill style={{opacity: listO}}>
          <At x={120} y={112}>
            <Appear at={2} dir="right">
              <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
                <Txt size={52} weight={900}>
                  Checklist final
                </Txt>
                <Pegadinha at={6} label="8 PEGADINHAS" size={26} />
              </div>
            </Appear>
          </At>
          {items.map((it, i) => {
            const col = i < 4 ? 0 : 1;
            const row = i % 4;
            const at = c.s(it.line);
            const tick = pop(f, fps, at + 4, 10);
            const on = f >= at;
            return (
              <At key={it.line} x={120 + col * 850} y={232 + row * 148} w={820}>
                <Appear at={c.s('i1') + 4 + i * 3} dir="up" dist={30}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 22,
                      height: 128,
                      padding: '0 26px',
                      borderRadius: 24,
                      background: on ? `${it.col}1E` : 'rgba(255,255,255,0.035)',
                      border: `2px solid ${on ? it.col : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: on ? `0 0 ${30 * ease(f, at, 10)}px ${it.col}44` : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 16,
                        border: `3px solid ${on ? it.col : C.red}`,
                        background: on ? it.col : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {on ? <Check size={42} color="#0B1020" strokeWidth={3.6} style={{transform: `scale(${tick})`}} /> : <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 28, color: C.redL}}>{i + 1}</span>}
                    </div>
                    <Txt size={31} weight={on ? 800 : 600} color={on ? C.text : C.muted} style={{flex: 1}}>
                      {it.t}
                    </Txt>
                    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 20, color: it.col, border: `2px solid ${it.col}`, borderRadius: 999, padding: '4px 12px', flexShrink: 0}}>{it.tag}</div>
                  </div>
                </Appear>
              </At>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {f >= i10 ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 140, opacity: ease(f, i10, 12) * fadeOut(f, c.dur - 20, 20)}}>
          <div style={{transform: `scale(${0.6 + 0.4 * endP})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Sparkles size={110} color={C.dvaL} style={{transform: `rotate(${Math.sin(f / 10) * 8}deg)`}} />
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, color: C.text, letterSpacing: -4, marginTop: 10}}>Boa prova!</div>
            <Appear at={c.at('i10', 'Voce')} dir="up">
              <Txt size={40} color={C.muted} weight={600} style={{textAlign: 'center'}}>
                Respira fundo. Você estudou.
              </Txt>
            </Appear>
            <div style={{display: 'flex', gap: 22, marginTop: 40}}>
              {[C.dfc, C.dva, C.notas].map((col, k) => (
                <div key={col} style={{width: 26, height: 26, borderRadius: 13, background: col, boxShadow: `0 0 20px ${col}`, transform: `translateY(${Math.sin(f / 8 + k) * 8}px)`}} />
              ))}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
