export const C = {
  bg: '#070B18',
  bg2: '#0D1430',
  text: '#F1F5F9',
  muted: '#94A3B8',
  dim: '#64748B',
  line: 'rgba(148,163,184,0.22)',
  card: 'rgba(255,255,255,0.045)',
  cardBorder: 'rgba(255,255,255,0.10)',
  // DFC — azul
  dfc: '#3B82F6',
  dfcL: '#93C5FD',
  dfcD: '#1E40AF',
  // Atividades da DFC (família azul)
  op: '#38BDF8',
  inv: '#3B82F6',
  fin: '#818CF8',
  // DVA — dourado/âmbar
  dva: '#F59E0B',
  dvaL: '#FCD34D',
  dvaD: '#B45309',
  // Notas explicativas — verde
  notas: '#10B981',
  notasL: '#6EE7B7',
  notasD: '#047857',
  // Pegadinhas — vermelho
  red: '#EF4444',
  redL: '#FCA5A5',
  redD: '#991B1B',
  // Abertura / fechamento
  intro: '#A5B4FC',
};

export type Block = 'intro' | 'dfc' | 'dva' | 'notas' | 'fim';

export const blockColor: Record<Block, string> = {
  intro: C.intro,
  dfc: C.dfc,
  dva: C.dva,
  notas: C.notas,
  fim: C.intro,
};

export const blockLabel: Record<Block, string> = {
  intro: 'Abertura',
  dfc: 'DFC',
  dva: 'DVA',
  notas: 'Notas Explicativas',
  fim: 'Fechamento',
};

export const FONT = "'Inter', system-ui, sans-serif";
export const MONO = "'JetBrains Mono', ui-monospace, monospace";

export const W = 1920;
export const H = 1080;
