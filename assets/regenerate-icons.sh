#!/bin/zsh
# Regenerate every favicon, app icon, and shield logo from the master SVG.
# Master: assets/sdit-shield.svg  (navy mark, native portrait aspect 286:347)
#
# Two treatments:
#   • Inline logos  → navy shield on TRANSPARENT, native aspect (masthead, brand showcase)
#   • Browser/app   → navy shield centered on a PAPER tile, square (favicons, PWA, apple-touch)
#
# Requires: rsvg-convert (librsvg) + magick (ImageMagick). Run from repo root:
#   zsh assets/regenerate-icons.sh
set -euo pipefail

cd "$(dirname "$0")"            # -> assets/
SVG="sdit-shield.svg"
PAPER="#FCFBF8"                 # --paper, matches the site background
SS=4                            # supersample factor for crisp small icons

# --- Inline navy shields, transparent, native portrait aspect ---------------
rsvg-convert -h 1024 "$SVG" -o sdit-shield.png
cp sdit-shield.png sdit-shield-ink.png
cp sdit-shield.png sdit-shield-navy.png

# --- Square paper-tile icon: shield centered at ~78% of tile height ---------
make_tile() {
  local size=$1 out=$2
  local big=$(( size * SS ))
  local sh=$(( big * 78 / 100 ))
  rsvg-convert -h "$sh" "$SVG" -o /tmp/_shield_src.png
  magick -size "${big}x${big}" xc:"$PAPER" \
         /tmp/_shield_src.png -gravity center -composite \
         -resize "${size}x${size}" "$out"
}

make_tile 16  favicon-16x16.png
make_tile 32  favicon-32x32.png
make_tile 180 ../apple-touch-icon.png
make_tile 192 icon-192.png
make_tile 512 icon-512.png

# --- Multi-resolution favicon.ico (16 / 32 / 48) ----------------------------
make_tile 48 /tmp/_fav48.png
magick favicon-16x16.png favicon-32x32.png /tmp/_fav48.png ../favicon.ico

echo "Icons regenerated from $SVG."
