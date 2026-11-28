# Le goût BachataVan 🎬💃

Ce fichier est la **mémoire de style** de Claude pour les vidéos BachataVan.
Claude le lit avant chaque montage et y ajoute chaque correction que tu lui donnes,
pour ne jamais refaire la même erreur.

> Les valeurs ci-dessous sont des **valeurs de départ**. Remplace-les par les vraies
> couleurs / police de BachataVan (logo, Instagram…) ou demande à Claude de les
> déduire de vidéos d'inspiration (`./scripts/inspirer.sh <lien>`).

## Format

- Vertical **1080 × 1920**, 30 images/s (TikTok, Reels, Shorts).
- Son normalisé à -14 LUFS (volume standard des réseaux sociaux).
- Zone sûre : aucun texte dans les 168 px du haut, rien d'important sous 1330 px
  (boutons TikTok), rien sous la colonne d'icônes à droite.

## Couleurs

| Rôle | Valeur | Usage |
|---|---|---|
| `--nuit` | `#15101C` | fonds, cartes de fin |
| `--passion` | `#E8304A` | mot-clé mis en avant, boutons |
| `--or` | `#FFC24B` | mot en cours de lecture (karaoké) |
| `--creme` | `#FFF6EC` | texte principal |
| `--encre` | `#111111` | fond des bulles de sous-titres |

## Typographie

- Titres et sous-titres : **Archivo Black**, en MAJUSCULES.
- Petits textes (lien en bio, date) : **Inter** 700.

## Sous-titres

- Style « bulles » : chaque mot dans une étiquette noire, texte crème.
- Le mot prononcé passe en **or** (effet karaoké) ; les mots-clés (`motsCles`) sont en
  bulle **rouge passion**.
- 3 mots maximum par groupe (rythme énergique, comme les danses).
- Position : **bas de la zone sûre** (≈ 1180-1300 px du haut), jamais sur un visage.
- Entrée : petit « pop » (échelle 0,85 → 1, 0,15 s). Pas de fondu lent.

## Animations

- Accroche (titre) à l'écran **dès la première image** (c'est la miniature).
- Titre en haut, entrée en rebond, reste ~2,8 s.
- Carte de fin 3 s : logo texte « BachataVan », appel à l'action, « lien en bio ».
- Mouvements rapides et nets (`power3.out`, `back.out`) : ça doit danser, pas flotter.

## Musique

- Si une musique est fournie : volume bas (≈ 15 %) sous la voix, plus fort sur la carte de fin.

## Corrections retenues

<!-- Claude ajoute ici chaque retour de l'utilisateur, daté, en une ligne.
     Exemple : - 2026-11-11 : sous-titres trop hauts → les placer plus bas. -->
- 2026-11-11 : selfie face caméra → sous-titres sous le menton (`sousTitresY` ≈ 1430), jamais sur la bouche.
- ~~2026-11-14 : logo BachataVan visible du début à la fin des vidéos~~ → annulé le 2026-11-28 (voir plus bas).
- 2026-11-22 : TOUJOURS centrer les titres et textes sous les photos/vidéos (jamais alignés à gauche).
- 2026-11-26 : animation de logo codée (phares, comète) jugée trop basique → pour un logo reveal réaliste/cinéma, passer par une IA vidéo (Veo via Higgsfield ou Google Flow) à partir du PNG de la plaque ; le code reste pour les cartes, textes et infos.
- 2026-11-26 : promo ACM jugée « trop froide » → palette chaude (vin, or, braise, crème sur noir chaud), étalonnage chaud sur les rushes (warm-daylight + grain + vignette), plus de bleu/violet ; transitions avec une cause (whip, objet qui devient le décor, zoom à travers, flash chaud), caméra qui suit le van, bruitages sur chaque transition.
- 2026-11-28 : **JAMAIS de logo plaque BachataVan en surimpression** dans les vidéos (ni en haut, ni sur la carte de fin). Le nom peut apparaître en texte (@bachatavan_official).
- 2026-11-28 : **JAMAIS de prix** (pas de « 15 € », pas de tarif early bird) dans les vidéos, flyers ou pages.
- 2026-11-28 : vidéos **en anglais** par défaut (sauf demande contraire).
- 2026-11-28 : le texte se place **au-dessus des têtes** (bande 300–760 px), jamais sur les visages ; voile sombre en haut pour la lisibilité.
- 2026-11-28 : choisir des **plans nets à distance moyenne** ; écarter les plans où un visage est collé à l'objectif ou flou.
- 2026-11-28 : Quechimba = **tous les vendredis et dimanches** ; message type « Every Friday & Sunday · Book your seat · link in bio ».
