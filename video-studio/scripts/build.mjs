#!/usr/bin/env node
// Le monteur (HyperFrames) : génère la vidéo BachataVan à partir de
//   <projet>/video.json             réglages (titre, mots-clés, fin, musique…)
//   <projet>/assets/rush.mp4        rush préparé par scripts/prepare.sh
//   <projet>/assets/transcript.json mots + temps, par scripts/transcribe.py
// Écrit index.html + compositions/{titre,sous-titres,fin}.html (HTML statique, éditable dans le Studio).
//
// Usage : node scripts/build.mjs <dossier du projet>

import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(process.argv[2] ?? ".");
const cfg = JSON.parse(fs.readFileSync(path.join(dir, "video.json"), "utf8"));
const transcriptPath = path.join(dir, "assets", "transcript.json");
const words = fs.existsSync(transcriptPath)
  ? JSON.parse(fs.readFileSync(transcriptPath, "utf8"))
  : [];

// ---- Le goût BachataVan (voir STYLE.md ; surchargeable via video.json > couleurs) ----
const C = {
  nuit: "#15101C",
  passion: "#E8304A",
  or: "#FFC24B",
  creme: "#FFF6EC",
  encre: "#111111",
  ...(cfg.couleurs ?? {}),
};
const W = 1080;
const H = 1920;
const r = (n) => Math.round(n * 1000) / 1000;

const D = r(cfg.duree); // durée du rush
const titreDuree = r(cfg.titre ? (cfg.dureeTitre ?? 2.8) : 0);
const fin = { actif: true, duree: 3, appel: "RÉSERVE TA PLACE", petit: "lien en bio", ...(cfg.fin ?? {}) };
const finDuree = fin.actif ? r(fin.duree) : 0;
const total = r(D + finDuree);
const perGroup = cfg.motsParGroupe ?? 3;
const capY = cfg.sousTitresY ?? 1180; // haut du bloc de sous-titres, en px depuis le haut
const motsCles = new Set((cfg.motsCles ?? []).map(norm));

function norm(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");
}
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---- Groupes de sous-titres ----
// Coupe à la limite de mots, à une fin de phrase, ou à une pause ≥ 150 ms.
const groups = [];
let cur = [];
for (let i = 0; i < words.length; i++) {
  const w = words[i];
  if (w.start >= D) break;
  cur.push(w);
  const next = words[i + 1];
  const endsSentence = /[.!?…]$/.test(w.text);
  const pause = next ? next.start - w.end >= 0.15 : true;
  if (cur.length >= perGroup || endsSentence || pause || !next) {
    groups.push(cur);
    cur = [];
  }
}
if (cur.length) groups.push(cur);

const timed = groups.map((g, i) => {
  const prevEnd = i > 0 ? groups[i - 1].at(-1).end : 0;
  let start = Math.max(g[0].start - 0.08, 0.15, i > 0 ? prevEnd : 0);
  let end = g.at(-1).end + 0.35;
  if (groups[i + 1]) end = Math.min(end, Math.max(groups[i + 1][0].start - 0.08, g.at(-1).end));
  end = Math.min(end, D);
  if (end - start < 0.2) end = Math.min(start + 0.2, D);
  return { words: g, start: r(start), end: r(end) };
}).filter((g) => g.end > g.start);

// Mot qui sert de « texte » au groupe : enlève la ponctuation finale, majuscules.
const show = (t) => t.replace(/[.,;:!?…]+$/u, "").toUpperCase();

// ---- index.html ----
const indexHtml = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: ${C.nuit}; }
      #rush { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
      #titre { z-index: 2; }
      #sous-titres { z-index: 3; }
      #fin { z-index: 4; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${W}" data-height="${H}">
      <video id="rush" class="clip" src="${esc(cfg.rush ?? "assets/rush.mp4")}" data-start="0" data-duration="${D}" data-has-audio="true" data-track-index="0"></video>
${cfg.titre ? `      <div id="titre" data-composition-id="titre" data-composition-src="compositions/titre.html" data-start="0" data-duration="${titreDuree}" data-track-index="1" data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>\n` : ""}${timed.length ? `      <div id="sous-titres" data-composition-id="sous-titres" data-composition-src="compositions/sous-titres.html" data-start="0" data-duration="${D}" data-track-index="2" data-track-kind="captions" data-width="${W}" data-height="${H}"></div>\n` : ""}${fin.actif ? `      <div id="fin" data-composition-id="fin" data-composition-src="compositions/fin.html" data-start="${D}" data-duration="${finDuree}" data-track-index="3" data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>\n` : ""}${cfg.musique ? `      <audio id="musique" src="${esc(cfg.musique)}" data-start="0" data-duration="${total}" data-volume="${cfg.volumeMusique ?? 0.15}" data-fade-out="1" data-track-index="4"></audio>\n` : ""}    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;

// ---- compositions/titre.html : l'accroche, visible dès la 1re image ----
const titreHtml = `<template>
  <style>
    #root { position: absolute; inset: 0; }
    #titre-bloc {
      position: absolute; left: 0; right: 0; top: 250px;
      display: flex; flex-direction: column; align-items: center; gap: 22px;
      text-align: center; padding: 0 90px;
    }
    #titre-main {
      font-family: "Archivo Black", sans-serif; font-size: 92px; line-height: 1.02;
      color: ${C.creme}; background: ${C.encre}; padding: 18px 34px 22px; border-radius: 22px;
      text-transform: uppercase; box-shadow: 0 14px 0 ${C.passion};
    }
    #titre-sous {
      font-family: "Inter", sans-serif; font-weight: 700; font-size: 44px;
      color: ${C.encre}; background: ${C.or}; padding: 10px 26px; border-radius: 999px;
    }
  </style>
  <div id="root" data-composition-id="titre" data-width="${W}" data-height="${H}">
    <div id="titre-bloc">
      <div id="titre-main">${esc(cfg.titre ?? "")}</div>
${cfg.sousTitre ? `      <div id="titre-sous">${esc(cfg.sousTitre)}</div>\n` : ""}    </div>
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.fromTo("#titre-main", { scale: 1.12, rotation: -2 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.2)" }, 0);
${cfg.sousTitre ? `    tl.fromTo("#titre-sous", { y: 24, scale: 0.9 }, { y: 0, scale: 1, duration: 0.3, ease: "back.out(2)" }, 0.05);\n` : ""}    tl.to("#titre-bloc", { y: -60, opacity: 0, duration: 0.2, ease: "power2.in" }, ${r(titreDuree - 0.24)});
    window.__timelines["titre"] = tl;
  </script>
</template>
`;

// ---- compositions/sous-titres.html : bulles + karaoké ----
const groupHtml = timed
  .map((g, gi) => {
    const spans = g.words
      .map((w, wi) => {
        const cle = motsCles.has(norm(w.text)) ? " cle" : "";
        return `<span id="g${gi}-w${wi}" class="mot${cle}">${esc(show(w.text))}</span>`;
      })
      .join("");
    return `    <div id="g${gi}" class="groupe clip" data-start="${g.start}" data-duration="${r(g.end - g.start)}"><div id="g${gi}-ligne" class="ligne">${spans}</div></div>`;
  })
  .join("\n");

const groupTl = timed
  .map((g, gi) => {
    const lines = [
      `    tl.fromTo("#g${gi}-ligne", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: "back.out(2)" }, ${g.start});`,
    ];
    g.words.forEach((w, wi) => {
      const on = r(Math.max(w.start, g.start));
      const off = r(Math.min(w.end, g.end - 0.01));
      if (off <= on) return;
      // Mot normal : texte or. Mot-clé (bulle rouge) : la bulle passe en or, texte encre (contraste lisible).
      const cle = motsCles.has(norm(w.text));
      const onSt = cle ? `backgroundColor: "${C.or}", color: "${C.encre}"` : `color: "${C.or}"`;
      const offSt = cle ? `backgroundColor: "${C.passion}", color: "${C.creme}"` : `color: "${C.creme}"`;
      lines.push(`    tl.set("#g${gi}-w${wi}", { ${onSt}, scale: 1.08 }, ${on});`);
      lines.push(`    tl.set("#g${gi}-w${wi}", { ${offSt}, scale: 1 }, ${off});`);
    });
    return lines.join("\n");
  })
  .join("\n");

const sousTitresHtml = `<template>
  <style>
    #root { position: absolute; inset: 0; }
    .groupe { position: absolute; left: 0; right: 0; top: ${capY}px; overflow: visible; }
    .ligne {
      display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 14px;
      padding: 0 110px; text-align: center;
    }
    .mot {
      display: inline-block; font-family: "Archivo Black", sans-serif; font-size: 78px; line-height: 1.05;
      color: ${C.creme}; background: ${C.encre}; padding: 8px 18px 12px; border-radius: 14px;
    }
    .mot.cle { background: ${C.passion}; }
  </style>
  <div id="root" data-composition-id="sous-titres" data-width="${W}" data-height="${H}">
${groupHtml}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
${groupTl}
    window.__timelines["sous-titres"] = tl;
  </script>
</template>
`;

// ---- compositions/fin.html : carte de fin ----
const finHtml = `<template>
  <style>
    #root { position: absolute; inset: 0; }
    #fin-fond { position: absolute; inset: 0; background: ${C.nuit}; }
    #fin-bloc {
      position: absolute; left: 0; right: 0; top: 560px;
      display: flex; flex-direction: column; align-items: center; gap: 46px; text-align: center;
    }
    #fin-logo { font-family: "Archivo Black", sans-serif; font-size: 128px; color: ${C.creme}; letter-spacing: -2px; }
    #fin-logo span { color: ${C.passion}; }
    #fin-appel {
      font-family: "Archivo Black", sans-serif; font-size: 62px; color: ${C.creme};
      background: ${C.passion}; padding: 20px 44px 26px; border-radius: 999px;
    }
    #fin-petit { font-family: "Inter", sans-serif; font-weight: 700; font-size: 44px; color: ${C.or}; }
  </style>
  <div id="root" data-composition-id="fin" data-width="${W}" data-height="${H}">
    <div id="fin-fond"></div>
    <div id="fin-bloc">
      <div id="fin-logo">Bachata<span>Van</span></div>
      <div id="fin-appel">${esc(fin.appel)}</div>
      <div id="fin-petit">${esc(fin.petit)}</div>
    </div>
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.fromTo("#fin-fond", { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" }, 0);
    tl.fromTo("#fin-logo", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, 0.1);
    tl.fromTo("#fin-appel", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2.4)" }, 0.35);
    tl.fromTo("#fin-petit", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: "power3.out" }, 0.5);
    window.__timelines["fin"] = tl;
  </script>
</template>
`;

fs.mkdirSync(path.join(dir, "compositions"), { recursive: true });
const write = (f, s) => fs.writeFileSync(path.join(dir, f), s);
write("index.html", indexHtml);
for (const f of ["titre", "sous-titres", "fin"]) {
  const p = path.join(dir, "compositions", `${f}.html`);
  if (fs.existsSync(p)) fs.rmSync(p);
}
if (cfg.titre) write("compositions/titre.html", titreHtml);
if (timed.length) write("compositions/sous-titres.html", sousTitresHtml);
if (fin.actif) write("compositions/fin.html", finHtml);

console.log(`✓ Montage généré : ${total} s, ${timed.length} groupes de sous-titres, ${words.length} mots`);
