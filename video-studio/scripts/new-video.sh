#!/usr/bin/env bash
# Chaîne complète : rush brut → projet HyperFrames prêt à prévisualiser.
# Usage : ./scripts/new-video.sh <rush brut> <nom-du-projet> [modele-whisper]
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
rush="${1:?rush brut manquant (ex : rushes/soiree.mov)}"
name="${2:?nom du projet manquant (ex : soiree-samedi)}"
model="${3:-small}"
proj="$here/projets/$name"

if [[ -e "$proj" ]]; then echo "✗ $proj existe déjà" >&2; exit 1; fi
cp -R "$here/template" "$proj"

echo "1/4 ✂️  FFmpeg : format vertical + son normalisé"
"$here/scripts/prepare.sh" "$rush" "$proj/assets/rush.mp4"

echo "2/4 👂 Whisper : transcription mot par mot ($model)"
python3 "$here/scripts/transcribe.py" "$proj/assets/rush.mp4" "$proj/assets/transcript.json" --model "$model"

dur="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$proj/assets/rush.mp4")"
node -e 'const f=process.argv[1],c=JSON.parse(require("fs").readFileSync(f));c.duree=Math.floor(+process.argv[2]*1000)/1000;require("fs").writeFileSync(f,JSON.stringify(c,null,2)+"\n")' "$proj/video.json" "$dur"

echo "3/4 🎬 HyperFrames : génération du montage"
node "$here/scripts/build.mjs" "$proj"

echo "4/4 ✅ Vérification"
(cd "$proj" && npx --yes hyperframes@0.9.33 check) || true

cat <<MSG

Projet prêt : $proj
  • Ajuste titre / mots-clés / fin dans video.json puis : node scripts/build.mjs "$proj"
  • Aperçu :  (cd "$proj" && npm run dev)
  • Rendu :   (cd "$proj" && npm run render)   → rendu.mp4
MSG
