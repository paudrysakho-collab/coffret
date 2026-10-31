/* Plaquette entreprise Cave 71 — une page A4, pas un prix.
   Les textes viennent de data/plaquette.json, les visuels de src/photos/.
   BANDEAU=02 ou 03 prend une variante du visuel du haut.
   Usage : npm run plaquette → dist/plaquette-entreprise-2026.pdf */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const RACINE = path.resolve(import.meta.dirname, '..');
const lire = (f) => JSON.parse(fs.readFileSync(path.join(RACINE, f), 'utf8'));
const E = lire('data/plaquette.json');
const SANITAIRE = lire('data/mentions.json').message_sanitaire;

const SUFFIXE_BANDEAU = () => (process.env.BANDEAU && process.env.BANDEAU !== '01' ? `-bandeau${process.env.BANDEAU}` : '');
const SORTIE = path.join(RACINE, `dist/plaquette-entreprise-2026${SUFFIXE_BANDEAU()}.pdf`);

/* Les deux compositions studio fournies par l'agence (30 octobre), posées telles quelles :
   proportions conservées, aucun produit ajouté ni découpé, le coffret Canerccia reste dehors.
   BANDEAU=02 ou 03 prend l'une des deux variantes à la place du bandeau principal. */
const BANDEAUX = {
  '01': '01_Bandeau_principal_espacement_corrige.png',
  '02': '02_Bandeau_variante_coffrets.png',
  '03': '03_Bandeau_variante_champagne.png',
};
const CHOIX = BANDEAUX[process.env.BANDEAU] ? process.env.BANDEAU : '01';
const BANDEAU = `../src/photos/compositions/${BANDEAUX[CHOIX]}`;
/* La gamme : les neuf bouteilles sur une même ligne de sol. Même hauteur pour les 75 cl,
   le champagne un peu plus haut, comme en vrai ; les largeurs suivent chaque photo, rien
   n'est étiré. Puis les cinq bocaux d'épicerie, à leur échelle. */
const prod = (f) => `../src/photos/produits/${f}`;
/* Une seule ligne de produits : douze suffisent à montrer la gamme, et les espaces
   restent réguliers. Les hauteurs suivent les tailles réelles des emballages, pas le
   cadrage des images (LIRE_AVANT_UTILISATION.txt) : 75 cl 32 mm, champagne 36,
   spiritueux 70 cl 31, bière 33 cl 23, sachet de chocolats 22, bocaux 12-13. */
const GAMME = [
  ['03_Jardin_de_Corbieres.png', 32],
  ['07_Champagne_Expression.png', 36],
  ['05_Amphibolites.png', 32],
  ['06_Pinot_Noir_Villebois.png', 32],
  ['12_Clos_de_Vougeot.png', 32],
  ['01_rhum_La_Favorite_Coeur_de_Canne.png', 31],
  ['03_whisky_Suntory_Toki.png', 31],
  ['09_biere_Lutgarde_Blonde.png', 23],
  ['15_jus_de_raisin_Barbiniere.png', 27],
  ['11_chocolats_Maison_Guinguet.png', 22],
  ['16_gressins_Atelier_Emile.png', 20],
  ['08_Tartinable_tomates_corrige.png', 13],
  ['09_Tartinable_asperges_corrige.png', 13],
  ['10_Terrine_perdrix_corrige.png', 12],
];
const GAMME2 = [];
for (const rel of [BANDEAU, ...[...GAMME, ...GAMME2].map(([f]) => prod(f))]) {
  const f = path.join(RACINE, rel.replace('../', ''));
  if (!fs.existsSync(f)) throw new Error(`image manquante : ${path.relative(RACINE, f)}`);
}

/* La bande de strates du catalogue SCIO, figée ici : ce dépôt ne dépend plus du sien. */
const strates = "<svg viewBox=\"0 0 600 26\" preserveAspectRatio=\"none\" class=\"bande\"\n            aria-hidden=\"true\"><defs></defs><rect x=\"0\" y=\"0.00\" width=\"600\" height=\"4.66\" fill=\"#46606E\" opacity=\".78\"/><rect x=\"0\" y=\"4.06\" width=\"600\" height=\"2.11\" fill=\"#3C5B47\" opacity=\".78\"/><rect x=\"0\" y=\"3.76\" width=\"600\" height=\".6\" fill=\"#FBF8F1\" opacity=\".7\"/><rect x=\"0\" y=\"5.57\" width=\"600\" height=\"2.11\" fill=\"#A8515F\" opacity=\".78\"/><rect x=\"0\" y=\"5.27\" width=\"600\" height=\".6\" fill=\"#FBF8F1\" opacity=\".7\"/><rect x=\"0\" y=\"7.08\" width=\"600\" height=\"4.08\" fill=\"#D08C3C\" opacity=\".78\"/><rect x=\"0\" y=\"6.78\" width=\"600\" height=\".6\" fill=\"#FBF8F1\" opacity=\".7\"/><rect x=\"0\" y=\"10.56\" width=\"600\" height=\"4.08\" fill=\"#3C5B47\" opacity=\".78\"/><rect x=\"0\" y=\"10.26\" width=\"600\" height=\".6\" fill=\"#FBF8F1\" opacity=\".7\"/><rect x=\"0\" y=\"14.04\" width=\"600\" height=\"2.34\" fill=\"#D08C3C\" opacity=\".78\"/><rect x=\"0\" y=\"13.74\" width=\"600\" height=\".6\" fill=\"#FBF8F1\" opacity=\".7\"/><rect x=\"0\" y=\"15.79\" width=\"600\" height=\"4.08\" fill=\"#A8515F\" opacity=\".78\"/><rect x=\"0\" y=\"15.49\" width=\"600\" height=\".6\" fill=\"#FBF8F1\" opacity=\".7\"/><rect x=\"0\" y=\"19.27\" width=\"600\" height=\"2.11\" fill=\"#46606E\" opacity=\".78\"/><rect x=\"0\" y=\"18.97\" width=\"600\" height=\".6\" fill=\"#FBF8F1\" opacity=\".7\"/><rect x=\"0\" y=\"20.78\" width=\"600\" height=\"3.50\" fill=\"#3C5B47\" opacity=\".78\"/><rect x=\"0\" y=\"20.48\" width=\"600\" height=\".6\" fill=\"#FBF8F1\" opacity=\".7\"/><rect x=\"0\" y=\"23.68\" width=\"600\" height=\"2.92\" fill=\"#D9CDB4\" opacity=\".78\"/><rect x=\"0\" y=\"23.38\" width=\"600\" height=\".6\" fill=\"#FBF8F1\" opacity=\".7\"/></svg>";

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../src/styles/systeme.css">
<style>
  @page { size: 210mm 297mm; margin: 0; }
  html, body { margin: 0; background: #fff; }
  .p { width: 210mm; height: 297mm; box-sizing: border-box; background: var(--tuffeau);
       display: flex; flex-direction: column; overflow: hidden; position: relative; }

  /* — en-tête — */
  .haut { padding: 10mm 15mm 0; display: flex; align-items: flex-start; gap: 9mm; flex: none; }
  .enseigne { width: 48mm; display: block; flex: none; }
  .titres { padding-top: .5mm; }
  h1 { font: 400 27pt/1.02 var(--titre); color: var(--violet); }
  .sous { margin-top: 2mm; font: 400 13.5pt/1.2 var(--titre); color: var(--gneiss); }
  .bande { width: 100%; height: 5mm; display: block; margin-top: 4.5mm; flex: none; }

  /* — la vitrine : la composition studio, toute la largeur utile — */
  .vitrine { flex: none; margin-top: 3mm; padding: 0 44mm; }
  .vitrine img { display: block; width: 100%; height: auto; }

  /* — le chapeau, sous la vitrine — */
  .chapeau { flex: none; margin: 3mm 15mm 0; font: 400 10.8pt/1.38 var(--courant); color: var(--encre); }
  .chapeau b { font-weight: 400; color: var(--violet); }

  /* — les deux blocs — */
  .blocs { flex: none; padding: 3mm 15mm 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; }
  .bloc h2 { font: 400 14.5pt/1.15 var(--titre); color: var(--violet); }
  .bloc h2::after { content: ""; display: block; width: 15mm; height: 1.1pt;
                    background: var(--or); margin: 2mm 0 2.6mm; }
  .bloc p { font: 400 9.2pt/1.34 var(--courant); color: var(--encre); }

  /* — la gamme : les bouteilles sur une même ligne de sol — */
  .gamme { flex: none; margin-top: 7mm; padding: 0 15mm; display: flex;
           align-items: flex-end; justify-content: space-between; gap: 1mm; }
  .gamme img { display: block; width: auto; flex: none; }
  .legende-gamme { flex: none; margin: 2mm 15mm 0; font: 400 8pt var(--technique);
                   color: var(--silex); font-style: italic; }
  .gamme2 { margin-top: 2mm; }

  /* — la maison, sur toute la largeur — */
  .frise { flex: none; margin-top: 7mm; padding: 0 15mm; }
  .marche h2 { font: 400 14.5pt/1.15 var(--titre); color: var(--violet); }
  .marche h2::after { content: ""; display: block; width: 15mm; height: 1.1pt;
                      background: var(--or); margin: 2mm 0 2.8mm; }
  .marche p { font: 400 9.2pt/1.34 var(--courant); color: var(--encre); }
  .marche ul { list-style: none; margin-top: 3mm; display: grid;
               grid-template-columns: repeat(3, 1fr); gap: 0 8mm; }
  .marche li { position: relative; padding-left: 5mm; margin-bottom: 1.4mm;
               font: 400 9.4pt/1.36 var(--technique); color: var(--encre); }
  .marche li::before { content: ""; position: absolute; left: 0; top: 1.5mm;
                       width: 2.6mm; height: 1.1pt; background: var(--or); }
  .occasions { margin-top: 2.6mm; font: 400 9pt/1.38 var(--technique); color: var(--silex); }

  /* — appel, contacts, mention — */
  .bas { flex: none; margin-top: auto; }
  .appel { margin: 4mm 15mm 0; padding: 3.2mm 6mm; background: var(--craie);
           border-left: 2.2pt solid var(--or); font: 400 11.2pt/1.3 var(--titre); color: var(--violet);
           display: flex; align-items: baseline; justify-content: space-between; gap: 5mm; }
  .appel .numeros { font: 600 10.6pt var(--technique); color: var(--encre); white-space: nowrap; }
  .pied { padding: 4.5mm 15mm 16mm; display: flex; align-items: flex-end;
          justify-content: space-between; gap: 8mm; }
  .coord { font: 400 9.4pt/1.46 var(--technique); color: var(--encre); }
  .coord b { font-weight: 600; }
  .mentions { margin-top: 2.4mm; font-size: 7.2pt; line-height: 1.35; color: var(--silex); }
  .coord .tel { color: var(--violet); font-weight: 600; }
  .scio { text-align: right; }
  .scio img { width: 34mm; display: block; margin-left: auto; }
  .scio span { display: block; margin-top: 1.6mm; font: 400 7.4pt var(--technique); color: var(--silex); }
  /* .sanitaire est déjà posé en bas de page par systeme.css : on ne règle que l'assiette */
  .sanitaire { left: 15mm; bottom: 7mm; font-size: 6.4pt; opacity: .7; }
</style></head><body><div class="p">

  <header class="haut">
    <img class="enseigne" src="../src/images/logo-cave71.png" alt="${E.emetteur}">
    <div class="titres">
      <h1>${E.titre}</h1>
      <div class="sous">${E.sous_titre}</div>
    </div>
  </header>
  ${strates}

  <section class="vitrine">
    <img src="${BANDEAU}" alt="Coffrets, magnum de champagne et sachet d’épicerie fine">
  </section>

  <p class="chapeau">${E.chapeau}</p>

  <section class="blocs">
    ${E.blocs.map((b) => `<article class="bloc"><h2>${b.titre}</h2><p>${b.texte}</p></article>`).join('')}
  </section>

  <section class="gamme">
    ${GAMME.map(([f, h]) => `<img src="${prod(f)}" alt="" style="height:${h}mm">`).join('')}
  </section>


  <p class="legende-gamme">${E.legende_gamme}</p>

  <section class="frise">
    <div class="marche">
      <h2>${E.bas.titre}</h2>
      <p>${E.bas.texte}</p>
      <ul>${E.bas.modalites.map((m) => `<li>${m}</li>`).join('')}</ul>
    </div>
  </section>

  <div class="bas">
    <p class="appel"><span>${E.appel}</span><span class="numeros">${E.appel_numeros}</span></p>
    <footer class="pied">
      <div class="coord">
        <b>${E.emetteur}</b> — ${E.contacts.adresse}<br>
        ${E.contacts.horaires} · ${E.contacts.site}
        <div class="mentions">${E.mentions}</div>
      </div>
      <div class="scio">
        <img src="../src/images/logo-agence-scio-detoure.png" alt="Agence SCIO Vins &amp; Spirits">
        <span>${E.pied_agence}</span>
      </div>
    </footer>
  </div>
  <div class="sanitaire">${SANITAIRE}</div>
</div></body></html>`;

fs.mkdirSync(path.join(RACINE, 'build'), { recursive: true });
fs.mkdirSync(path.join(RACINE, 'dist'), { recursive: true });
const fichier = path.join(RACINE, `build/plaquette-entreprise.html`);
fs.writeFileSync(fichier, html);
/* CHROME=/chemin/vers/chrome force un Chromium déjà installé (sessions cloud, CI).
   Sans la variable, Playwright prend celui qu'il a téléchargé lui-même. */
const nav = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await nav.newPage();
await page.goto(pathToFileURL(fichier).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const mesures = await page.evaluate(() => {
  const p = document.querySelector('.p').getBoundingClientRect();
  const v = document.querySelector('.vitrine');
  return {
    bas: Math.round(document.querySelector('.bas').getBoundingClientRect().bottom - p.bottom),
    large: Math.round(v.scrollWidth - v.clientWidth),
    gamme: Math.round(document.querySelector('.gamme').scrollWidth - document.querySelector('.gamme').clientWidth),
  };
});
if (mesures.bas > 1) throw new Error(`le bas de page déborde de ${mesures.bas} px : réduire les hauteurs de photos`);
if (mesures.large > 1) throw new Error(`la vitrine déborde de ${mesures.large} px en largeur : réduire les hauteurs ou le nombre de coffrets`);
if (mesures.gamme > 1) throw new Error(`la gamme déborde de ${mesures.gamme} px en largeur : réduire la hauteur des bouteilles`);
await page.pdf({ path: SORTIE, printBackground: true, preferCSSPageSize: true });

/* IMAGES POUR LE CORPS DU MAIL
   La plaquette part aussi en image, intégrée dans le mail : le destinataire la voit
   sans ouvrir de pièce jointe. Rendue à 2x (1240 px de large) pour rester nette quand
   on zoome sur un téléphone, puis affichée à 620 px dans le mail.
   PNG=1 npm run plaquette → dist/mail/ */
if (process.env.PNG) {
  const dossier = path.join(RACINE, 'dist/mail');
  fs.mkdirSync(dossier, { recursive: true });
  const elt = await page.$('.p');
  const boite = await elt.boundingBox();
  const ECHELLE = 2;
  const vue = await nav.newPage({ viewport: { width: Math.round(boite.width), height: Math.round(boite.height) }, deviceScaleFactor: ECHELLE });
  await vue.goto(pathToFileURL(fichier).href, { waitUntil: 'networkidle' });
  await vue.evaluate(() => document.fonts.ready);
  const cible = await vue.$('.p');

  const entier = path.join(dossier, `plaquette-mail${SUFFIXE_BANDEAU()}.png`);
  await cible.screenshot({ path: entier });

  /* Version coupée en deux : la moitié haute (offre) et la moitié basse (gamme, cave,
     numéros), pour qui préfère deux images plus lisibles qu'une page entière. */
  const h = Math.round(boite.height);
  const coupe = Math.round((await vue.evaluate(() => {
    const p = document.querySelector('.p').getBoundingClientRect();
    return document.querySelector('.gamme').getBoundingClientRect().top - p.top;
  })));
  for (const [nom, y, hauteur] of [['haut', 0, coupe], ['bas', coupe, h - coupe]]) {
    await vue.screenshot({
      path: path.join(dossier, `plaquette-mail-${nom}${SUFFIXE_BANDEAU()}.png`),
      clip: { x: 0, y, width: Math.round(boite.width), height: hauteur },
    });
  }
  await vue.close();
  console.log(`✓ dist/mail/ — image entière + haut/bas, ${Math.round(boite.width * ECHELLE)} px de large`);
}

await nav.close();
console.log(`✓ ${path.relative(RACINE, SORTIE)} — bandeau ${CHOIX}, ${GAMME.length} produits`);
