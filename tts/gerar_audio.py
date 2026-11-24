#!/usr/bin/env python3
"""Gera a narração de cada cena e a linha do tempo usada pelo Remotion.

Uso:
  python3 tts/gerar_audio.py --engine edge            # edge-tts, pt-BR-FranciscaNeural (fallback: AntonioNeural)
  python3 tts/gerar_audio.py --engine kokoro --models DIR   # offline (Kokoro-82M, voz pf_dora)

Saídas:
  public/audio/<cena>.wav        áudio de cada cena (frases + pausas)
  src/data/timeline.json         início/fim de cada frase em frames (30 fps)
  roteiro-narracao.txt           roteiro final com tempos
"""
import argparse
import asyncio
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
SR = 48000
LEAD_IN = 0.5      # silêncio no começo de cada cena (entrada da animação)
TAIL = 0.6         # silêncio no fim de cada cena
DEFAULT_PAUSE = 0.35
PAUSE_SCALE = 0.75  # encurta levemente todas as pausas


def decode_to_float(path: Path) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, np.float32).copy()


def trim(x: np.ndarray, thr: float = 0.008, margin: float = 0.04) -> np.ndarray:
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x
    m = int(margin * SR)
    return x[max(0, idx[0] - m): min(len(x), idx[-1] + m)]


def write_wav(path: Path, x: np.ndarray) -> None:
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2").tobytes()
    subprocess.run(
        ["ffmpeg", "-v", "quiet", "-y", "-f", "s16le", "-ac", "1", "-ar", str(SR), "-i", "-", str(path)],
        input=pcm, check=True,
    )


class KokoroEngine:
    name = "kokoro"

    def __init__(self, models: Path, voice: str, speed: float):
        import soundfile  # noqa: F401
        from kokoro_onnx import Kokoro
        voices = models / "voices.npz"
        if not voices.exists():
            arr = {}
            for b in models.glob("*.bin"):
                arr[b.stem] = np.fromfile(b, dtype=np.float32).reshape(510, 1, 256)
            np.savez(voices, **arr)
        self.k = Kokoro(str(models / "kokoro-quantized.onnx"), str(voices))
        self.voice, self.speed = voice, speed

    def key(self):
        return f"kokoro|{self.voice}|{self.speed}"

    def synth(self, text: str, out: Path) -> None:
        import soundfile as sf
        s, sr = self.k.create(text, voice=self.voice, speed=self.speed, lang="pt-br")
        sf.write(str(out), s, sr)


class EdgeEngine:
    name = "edge"
    VOICES = ["pt-BR-FranciscaNeural", "pt-BR-AntonioNeural"]

    def __init__(self, rate: str):
        import edge_tts  # noqa: F401
        self.rate = rate
        self.voice = self.VOICES[0]

    def key(self):
        return f"edge|{self.voice}|{self.rate}"

    def synth(self, text: str, out: Path) -> None:
        import edge_tts
        last = None
        for v in [self.voice] + [x for x in self.VOICES if x != self.voice]:
            try:
                asyncio.run(edge_tts.Communicate(text, v, rate=self.rate).save(str(out)))
                if out.exists() and out.stat().st_size > 0:
                    if v != self.voice:
                        print(f"  (voz {self.voice} falhou; usando {v})")
                        self.voice = v
                    return
            except Exception as e:  # noqa: BLE001
                last = e
        raise RuntimeError(f"edge-tts falhou: {last}")


def fmt_time(sec: float) -> str:
    m, s = divmod(int(round(sec)), 60)
    return f"{m}:{s:02d}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", choices=["edge", "kokoro"], default="edge")
    ap.add_argument("--models", default=str(ROOT / "tts" / "modelos"))
    ap.add_argument("--voice", default="pf_dora")
    ap.add_argument("--speed", type=float, default=0.95)
    ap.add_argument("--rate", default="-5%")
    args = ap.parse_args()

    script = json.loads((ROOT / "narracao" / "roteiro.json").read_text(encoding="utf-8"))
    engine = KokoroEngine(Path(args.models), args.voice, args.speed) if args.engine == "kokoro" else EdgeEngine(args.rate)

    cache = ROOT / "narracao" / "cache"
    cache.mkdir(parents=True, exist_ok=True)
    (ROOT / "public" / "audio").mkdir(parents=True, exist_ok=True)
    (ROOT / "src" / "data").mkdir(parents=True, exist_ok=True)

    timeline = {"fps": FPS, "engine": engine.key(), "scenes": []}
    total = 0.0
    txt = []
    for sc in script["scenes"]:
        print(f"Cena {sc['num']}: {sc['title']}")
        parts = [np.zeros(int(LEAD_IN * SR), np.float32)]
        t = LEAD_IN
        lines_out = []
        for ln in sc["lines"]:
            h = hashlib.sha1((engine.key() + "|" + ln["say"]).encode()).hexdigest()[:16]
            ext = "mp3" if engine.name == "edge" else "wav"
            clip_path = cache / f"{ln['id']}_{h}.{ext}"
            if not clip_path.exists():
                engine.synth(ln["say"], clip_path)
            x = trim(decode_to_float(clip_path))
            peak = float(np.max(np.abs(x))) or 1.0
            x = x * (0.89 / peak)
            dur = len(x) / SR
            start, end = t, t + dur
            parts.append(x)
            t = end
            think = float(ln.get("think", 0))
            pause = think if think else float(ln.get("pause", DEFAULT_PAUSE)) * PAUSE_SCALE
            parts.append(np.zeros(int(pause * SR), np.float32))
            t += pause
            lines_out.append({
                "id": ln["id"],
                "kind": ln.get("kind", "line"),
                "cap": ln.get("cap", ln["say"]),
                "say": ln["say"],
                "start": round(start * FPS),
                "end": round(end * FPS),
                "thinkEnd": round((end + think) * FPS) if think else None,
            })
        parts.append(np.zeros(int(TAIL * SR), np.float32))
        audio = np.concatenate(parts)
        write_wav(ROOT / "public" / "audio" / f"{sc['id']}.wav", audio)
        dur_frames = int(np.ceil(len(audio) / SR * FPS))
        timeline["scenes"].append({
            "id": sc["id"], "num": sc["num"], "title": sc["title"], "block": sc["block"],
            "audio": f"audio/{sc['id']}.wav", "durationInFrames": dur_frames, "lines": lines_out,
        })
        txt.append((sc, total, lines_out))
        print(f"  {dur_frames / FPS:.1f}s")
        total += dur_frames / FPS

    (ROOT / "src" / "data" / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=1), encoding="utf-8")

    out = [f"{script['meta']['titulo']}", f"{script['meta']['subtitulo']}",
           f"Roteiro de narração — duração total {fmt_time(total)}", ""]
    for sc, t0, lines in txt:
        out.append(f"CENA {sc['num']} — {sc['title'].upper()}  [{fmt_time(t0)}]")
        for ln in lines:
            ts = fmt_time(t0 + ln["start"] / FPS)
            prefix = "  ⏸ " if ln["kind"] == "quiz-q" else ("  ✔ " if ln["kind"] == "quiz-a" else "    ")
            out.append(f"{prefix}[{ts}] {ln['cap']}")
            if ln["kind"] == "quiz-q":
                out.append("        (pausa para pensar)")
        out.append("")
    (ROOT / "roteiro-narracao.txt").write_text("\n".join(out), encoding="utf-8")
    print(f"Total: {fmt_time(total)} ({total:.1f}s)")


if __name__ == "__main__":
    sys.exit(main())
