#!/usr/bin/env bash
# Menyiapkan voice-over agar pas dengan durasi video (60 detik).
# - Memotong jeda hening di awal (TRIM detik)
# - Mempercepat tempo tanpa mengubah nada suara (TEMPO, 1.0 = asli)
# Pakai: bash scripts/prepare-voiceover.sh [input.mp3] [TEMPO] [TRIM]
set -euo pipefail
IN="${1:-audio-source/voiceover-original.mp3}"
TEMPO="${2:-1.15}"
TRIM="${3:-0.75}"
OUT="public/audio/voiceover.mp3"
ffmpeg -y -hide_banner -loglevel error -ss "$TRIM" -i "$IN" \
  -af "atempo=${TEMPO},afade=t=in:d=0.05,loudnorm=I=-16:TP=-1.5:LRA=11" \
  -ar 44100 -c:a libmp3lame -b:a 192k "$OUT"
echo "Voice-over siap: $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT") detik)"
