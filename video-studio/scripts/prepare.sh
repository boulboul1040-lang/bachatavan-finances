#!/usr/bin/env bash
# Les ciseaux (FFmpeg) : transforme un rush brut en vidéo verticale 1080x1920 30 i/s,
# son normalisé à -14 LUFS, prête pour HyperFrames.
# Usage : ./scripts/prepare.sh <rush brut> <sortie.mp4> [debut_sec] [fin_sec]
set -euo pipefail

in="${1:?rush brut manquant}"
out="${2:?fichier de sortie manquant}"
start="${3:-}"
end="${4:-}"

trim=()
[[ -n "$start" ]] && trim+=(-ss "$start")
[[ -n "$end" ]] && trim+=(-to "$end")

# Remplit l'écran vertical (recadrage centré si la vidéo est horizontale).
vf="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30"

if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$in" | grep -q .; then
  ffmpeg -hide_banner -loglevel error -y "${trim[@]}" -i "$in" \
    -vf "$vf" -af "loudnorm=I=-14:TP=-1.5:LRA=11" \
    -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
    -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$out"
else
  ffmpeg -hide_banner -loglevel error -y "${trim[@]}" -i "$in" \
    -vf "$vf" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
    -an -movflags +faststart "$out"
fi

echo "✓ Rush préparé : $out ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out" | cut -d. -f1) s)"
