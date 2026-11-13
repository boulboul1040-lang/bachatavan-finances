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
- 2026-11-14 : logo BachataVan visible du début à la fin des vidéos (au-dessus des têtes, fond sombre), pas seulement sur la carte de fin.
