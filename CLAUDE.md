# Plaquette entreprise Cave 71 — coffrets et ateliers

Ce dépôt ne contient **qu'une chose** : la plaquette d'une page que la Cave 71 envoie aux
entreprises pour ses coffrets cadeaux et ses ateliers dégustation. Elle a été sortie du dépôt
du catalogue (`paudrysakho-collab/philippe1`) pour être travaillée à part.

**Lis `docs/reprise.md` en entier avant de toucher à quoi que ce soit** : il dit ce qui est
fait, comment la page est construite, ce que l'agence a décidé, et ce qui reste ouvert.

## Faire le PDF

```sh
npm install          # playwright ; Chromium est déjà là dans les sessions cloud
npm run plaquette    # → dist/plaquette-entreprise-2026.pdf
npm run variantes    # les deux autres visuels de tête (-bandeau02, -bandeau03)
```

La génération s'arrête d'elle-même si la page déborde en hauteur ou si la ligne de produits
dépasse en largeur : c'est voulu, c'est le garde-fou de la mise en page.

## Les règles de fond

1. **Aucun prix inventé, aucun fait inventé.** Les tarifs et les modalités viennent de
   l'agence ou de la plaquette 2025 (`sources/`). Dans le doute, on demande et on note dans
   `QUESTIONS.md` — on ne tranche pas seul.
2. **Tous les textes vivent dans `data/plaquette.json`**, jamais dans le gabarit. Chaque
   texte porte sa source dans le champ `_sources`.
3. **Les étiquettes des produits ne se régénèrent pas.** Les visuels actuels sont des
   retouches génératives dont certaines étiquettes sont fausses : voir
   `sources/LIRE_AVANT_UTILISATION.txt`. Bon pour la maquette, **pas pour l'impression**.
4. **Loi Évin** : c'est de la communication sur l'alcool. Jamais de personne qui boit, de
   verre levé, de main tenant un verre, de fête arrosée. Le message sanitaire reste en bas
   de page.
5. **Produits exclus**, décision de l'agence : le coffret **Canerccia** (photos sources
   1000060376 à 379), **Septembre Chardonnay** et **Petite Syrah** (cuvées arrêtées),
   **Boehler Molse blanc** (retiré le 31 octobre).

## La direction artistique

Celle du catalogue SCIO : papier tuffeau `#F2EADA`, violet `#67067C`, or `#E1C853`,
Young Serif pour les titres, Spectral pour le texte courant, IBM Plex Sans pour les
mentions. La bande de strates du catalogue est figée dans `scripts/plaquette.mjs`.
Texte courant 9 pt minimum.

## Comment travaille l'agence

- Elle écrit vite, souvent à la voix, en français familier. Lire l'intention, pas la lettre.
- **Agir, pas demander** : si la demande est claire à 80 %, la faire avec le choix le plus
  raisonnable et dire en une ligne ce qui a été choisi.
- Les deux seules choses qu'on ne fait jamais sans elle : inventer ou corriger un prix ou un
  fait, et effacer son travail.
- Après chaque changement : **regarder la page en image**, envoyer le PNG et le PDF, puis
  commit et push.
- Ses fichiers sont sur son **Google Drive** et dans ses mails ; chercher soi-même avant de
  demander.
