#!/usr/bin/env python3
"""Les oreilles (Whisper) : transcrit la voix mot par mot avec les temps exacts.

Usage : python3 scripts/transcribe.py <video.mp4> <transcript.json> [--model small] [--language fr]

Écrit une liste [{"id": "w0", "text": "Salut", "start": 0.12, "end": 0.41}, ...]
au format attendu par scripts/build.mjs (et par HyperFrames).
"""
import argparse
import json
import re
import sys

# Phrases que Whisper invente souvent sur les silences en français.
HALLUCINATIONS = [
    "sous-titrage",
    "sous-titres réalisés",
    "merci d'avoir regardé",
    "amara.org",
    "abonnez-vous",
]


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("video")
    p.add_argument("output")
    p.add_argument("--model", default="small")
    p.add_argument("--language", default="fr")
    a = p.parse_args()

    try:
        import whisper  # openai-whisper
    except ImportError:
        print("Whisper n'est pas installé : lance ./setup.sh", file=sys.stderr)
        return 1

    model = whisper.load_model(a.model)
    result = model.transcribe(
        a.video,
        language=a.language,
        word_timestamps=True,
        condition_on_previous_text=False,
        fp16=False,
    )

    words = []
    for seg in result.get("segments", []):
        seg_text = seg.get("text", "").lower()
        if any(h in seg_text for h in HALLUCINATIONS):
            continue
        for w in seg.get("words", []):
            text = w["word"].strip()
            if not text or re.fullmatch(r"[\W_]+", text) or "♪" in text:
                continue
            words.append(
                {
                    "id": f"w{len(words)}",
                    "text": text,
                    "start": round(float(w["start"]), 3),
                    "end": round(float(w["end"]), 3),
                }
            )

    with open(a.output, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False, indent=1)

    print(f"✓ {len(words)} mots transcrits → {a.output}")
    print("  " + " ".join(w["text"] for w in words)[:400])
    return 0


if __name__ == "__main__":
    sys.exit(main())
