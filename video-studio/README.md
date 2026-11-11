# 🎬 Studio vidéo BachataVan

Tu donnes un rush brut à Claude, il te rend une vidéo TikTok / Reels prête à poster :
format vertical, son propre, **sous-titres animés façon karaoké**, accroche dès la 1re image
et carte de fin « Réserve ta place ».

| Rôle | Outil | Dans le kit |
|---|---|---|
| 👀 Les yeux | **yt-dlp** | `scripts/inspirer.sh` : télécharge une vidéo qui t'inspire et en tire une planche d'images |
| ✂️ Les ciseaux | **FFmpeg** | `scripts/prepare.sh` : format 1080×1920, recadrage, coupe, son à -14 LUFS |
| 👂 Les oreilles | **Whisper** | `scripts/transcribe.py` : chaque mot avec son temps exact |
| 🎞️ Le monteur | **HyperFrames** | `scripts/build.mjs` + `template/` : titres, sous-titres, carte de fin, rendu MP4 |

## 1. Installation (une seule fois, sur ton ordinateur)

```bash
cd video-studio
./setup.sh
```

Il te faut Node.js 22+ et Python 3.10+. Sur Mac, il te faut aussi [Homebrew](https://brew.sh).

## 2. Faire une vidéo

Dépose ton rush dans `video-studio/rushes/`, ouvre Claude Code dans `video-studio/` et dis :

> « Monte-moi rushes/soiree.mov : soirée bachata samedi 20h, on veut des inscriptions. »

Claude lance la chaîne, corrige la transcription, choisit l'accroche et les mots-clés,
vérifie les images, puis te montre l'aperçu ou te sort `projets/<nom>/rendu.mp4`.

À la main, si tu préfères :

```bash
./scripts/new-video.sh rushes/soiree.mov soiree-samedi
# modifie projets/soiree-samedi/video.json (titre, mots-clés, fin…)
node scripts/build.mjs projets/soiree-samedi
cd projets/soiree-samedi && npm run dev      # aperçu dans le navigateur
cd projets/soiree-samedi && npm run render   # → rendu.mp4
```

## 3. Lui apprendre ton goût

- Donne tes retours en langage normal (« sous-titres trop hauts, mets-les en bas »).
  Claude corrige et note la règle dans **`STYLE.md`**, pour ne plus refaire l'erreur.
- Montre-lui des vidéos qui te plaisent :
  `./scripts/inspirer.sh <lien>`, puis « Analyse cette inspiration et adapte STYLE.md ».
- Donne-lui les vraies couleurs et le logo de BachataVan : il mettra à jour le style.

## Réglages de `video.json`

| Clé | Rôle |
|---|---|
| `titre`, `sousTitre`, `dureeTitre` | Accroche en haut (mettre `titre: null` pour l'enlever) |
| `motsParGroupe` | Nombre de mots par sous-titre (3 = énergique) |
| `motsCles` | Mots affichés en bulle rouge |
| `sousTitresY` | Hauteur des sous-titres (px depuis le haut, 1180 par défaut) |
| `fin` | Carte de fin : `actif`, `duree`, `appel`, `petit` |
| `musique`, `volumeMusique` | Musique de fond (ex. `assets/musique.mp3`, 0.15) |
| `couleurs` | Remplace les couleurs du style pour cette vidéo seulement |
