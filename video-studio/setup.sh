#!/usr/bin/env bash
# Installe les 4 outils du studio vidéo BachataVan : FFmpeg, yt-dlp, Whisper, HyperFrames.
# macOS (Homebrew) ou Linux Debian/Ubuntu. Usage : ./setup.sh [modele-whisper]
set -euo pipefail
model="${1:-small}"
ok() { printf "  ✓ %s\n" "$1"; }

echo "== Studio vidéo BachataVan : installation =="

command -v node >/dev/null || { echo "✗ Node.js 22+ requis : https://nodejs.org" >&2; exit 1; }
command -v python3 >/dev/null || { echo "✗ Python 3.10+ requis : https://python.org" >&2; exit 1; }

# 1. FFmpeg — les ciseaux
if ! command -v ffmpeg >/dev/null; then
  if [[ "$(uname)" == "Darwin" ]]; then brew install ffmpeg
  else sudo apt-get update && sudo apt-get install -y ffmpeg; fi
fi
ok "FFmpeg $(ffmpeg -version | head -1 | awk '{print $3}')"

# 2. yt-dlp — les yeux
if ! command -v yt-dlp >/dev/null; then
  if [[ "$(uname)" == "Darwin" ]]; then brew install yt-dlp
  else python3 -m pip install --user -U yt-dlp; fi
fi
ok "yt-dlp $(yt-dlp --version)"

# 3. Whisper — les oreilles (+ téléchargement du modèle une fois pour toutes)
python3 -c "import whisper" 2>/dev/null || python3 -m pip install --user -U openai-whisper
python3 -c "import whisper; whisper.load_model('$model')" >/dev/null
ok "Whisper (modèle $model)"

# 4. HyperFrames — le monteur (+ ses skills pour Claude Code)
npm install -g hyperframes@0.9.33 >/dev/null
ok "HyperFrames $(hyperframes --version)"
npx --yes hyperframes@0.9.33 skills || echo "  (skills HyperFrames : relance « npx hyperframes skills » si besoin)"

echo
echo "Tout est prêt 🎉  Dépose un rush dans rushes/ et demande à Claude de le monter."
