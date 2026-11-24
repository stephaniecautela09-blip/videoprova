# Vídeo-aula de revisão — Tópicos em Contabilidade II

Vídeo de 8:49 (1920×1080, 30 fps, MP4) sobre **DFC**, **DVA** e **Notas Explicativas**, feito em Remotion (React).

- `video-revisao.mp4`: o vídeo pronto
- `roteiro-narracao.txt`: o roteiro da narração, cena por cena, com os tempos
- `narracao/roteiro.json`: fonte única do roteiro (texto falado, legenda e pausas)
- `tts/gerar_audio.py`: gera o áudio de cada cena e a linha do tempo que sincroniza animações e legendas
- `src/`: as 9 cenas animadas (`src/scenes/S1.tsx` … `S9.tsx`)

## Cores

DFC em azul · DVA em dourado/âmbar · Notas Explicativas em verde · pegadinhas em vermelho.

## Sobre a voz

O pedido era edge-tts com `pt-BR-FranciscaNeural` (ou `pt-BR-AntonioNeural`). O ambiente em nuvem onde o
vídeo foi gerado não consegue acessar o serviço do edge-tts: o host `speech.platform.bing.com` está bloqueado
na rede e o proxy não permite WebSocket, que é o protocolo do edge-tts. Por isso, a narração do MP4 foi
gerada **offline** com o modelo Kokoro-82M, voz feminina pt-BR `pf_dora`, e cada frase foi conferida por
reconhecimento de fala (Whisper) para pegar erros de pronúncia.

Para trocar pela voz Francisca no seu computador (Windows, com internet):

1. Instale [Node.js 18+](https://nodejs.org), [Python 3.10+](https://python.org) e o [ffmpeg](https://ffmpeg.org) (precisa estar no PATH).
2. Na pasta do projeto:

```bash
npm install
```

```bash
pip install edge-tts numpy
```

```bash
python tts/gerar_audio.py --engine edge
```

```bash
npx remotion render VideoRevisao video-revisao.mp4
```

O script tenta a Francisca e, se ela falhar, usa o Antonio. Ele reescreve `public/audio/`,
`src/data/timeline.json` e `roteiro-narracao.txt`. As durações das cenas se ajustam sozinhas ao novo áudio,
e as animações e legendas acompanham.

Para editar uma fala, mude `narracao/roteiro.json` (`say` = o que é falado; `cap` = a legenda, quando
diferente) e rode os dois últimos comandos de novo.

Para ver e ajustar as animações no navegador: `npx remotion studio`.
