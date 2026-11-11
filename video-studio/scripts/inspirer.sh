#!/usr/bin/env bash
# Les yeux (yt-dlp) : télécharge une vidéo qui t'inspire et prépare une planche
# d'images pour que Claude analyse rythme, couleurs et sous-titres.
# Usage : ./scripts/inspirer.sh <lien TikTok/Instagram/YouTube>
# ⚠️ Pour analyser un style uniquement : ne republie pas le contenu d'autrui.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
url="${1:?lien manquant}"
out="$here/inspirations/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$out"

yt-dlp -q --no-playlist -f "bv*[height<=1920]+ba/b" --merge-output-format mp4 -o "$out/video.%(ext)s" "$url"
v="$out/video.mp4"

# Une image par seconde, en planche de 6 colonnes (rythme, cadrage, typo, couleurs).
ffmpeg -hide_banner -loglevel error -y -i "$v" -vf "fps=1,scale=270:-1,tile=6x4" "$out/planche-%02d.jpg"
# Plans détectés (changements de scène) → rythme du montage.
ffmpeg -hide_banner -i "$v" -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 \
  | grep -o 'pts_time:[0-9.]*' | cut -d: -f2 > "$out/coupes.txt" || true

echo "✓ Inspiration enregistrée : $out"
echo "  $(wc -l < "$out/coupes.txt") coupes détectées sur $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$v" | cut -d. -f1) s"
echo "  Demande à Claude : « Analyse $out et mets à jour STYLE.md »"
