# Reprise : la plaquette entreprise Cave 71 (31 octobre 2026)

Ce fichier passe le relais. La plaquette vient du dépôt du catalogue
(`paudrysakho-collab/philippe1`, branche `claude/design-skill-propositions-suwoa9`), où elle
a été conçue du 30 au 31 octobre. Elle est ici pour être travaillée sans mélanger les sujets.

## 1. Ce qu'est le livrable

**Une page A4, aucun prix de produit.** Émetteur : la **Cave 71**, avec le logo Agence SCIO
en pied. Elle part à des entreprises, par mail, pour les cadeaux de fin d'année.

De haut en bas :

1. l'enseigne Cave 71, le titre « Coffrets & ateliers », le sous-titre « des cadeaux pour
   vos clients et vos équipes », la bande de strates du catalogue ;
2. le **bandeau studio** des coffrets (visuel validé par l'agence) ;
3. le chapeau : un coffret composé selon votre budget ;
4. deux blocs : **Des coffrets composés avec vous** et **Atelier dégustation** ;
5. la **ligne de produits** : quatorze visuels sur une même ligne de sol, suivie de la
   mention « Exemples de produits. » ;
6. **La Cave 71** : sa présentation et ses trois modalités ;
7. l'encart « Parlons-en » avec les deux numéros, les contacts, les mentions légales et le
   message sanitaire.

## 2. Les fichiers

| Où | Quoi |
|---|---|
| `data/plaquette.json` | **tous les textes**, et la source de chacun dans `_sources` |
| `data/consignes-audio.json` | transcription des messages vocaux de la responsable (30 oct.) |
| `data/mentions.json` | le message sanitaire |
| `scripts/plaquette.mjs` | la page entière : gabarit, styles, liste des produits et de leurs hauteurs |
| `src/photos/produits/` | les 18 visuels studio du 30 octobre + le jus de raisin et les gressins du 31 |
| `src/photos/compositions/` | le bandeau principal et ses deux variantes, plus la composition à trois coffrets (inutilisée depuis le 31) |
| `src/images/` | le logo Cave 71 (repris de la plaquette 2025) et le logo Agence SCIO détouré |
| `sources/` | la plaquette 2025, l'épreuve annotée du 31 octobre, les briefs donnés à ChatGPT, le `LIRE_AVANT_UTILISATION.txt` des visuels |
| `dist/` | les trois PDF |

## 3. Ce que l'agence a décidé

### Les textes
- **Prélevés mot pour mot de la plaquette 2025** : la présentation de la Cave 71, « Il est
  possible de panacher ou de créer des coffrets personnalisés », « Paiement à la commande »,
  et les mentions légales du pied. L'agence y tient : *« s'il y a des trucs à prélever,
  prélève-le de l'autre catalogue »*.
- **Écrits d'après ses consignes** : le titre, le chapeau, les deux blocs, l'appel.
- **Non repris de 2025** : les remises (−5 %, −7 %, −10 %) et le code 777 — la plaquette ne
  porte aucun prix ; et la phrase où l'équipe « lève les verres » — loi Évin.

### L'atelier (réécrit le 30 octobre, l'ancien texte était barré en entier)
Deux formules : **privatisation du lieu** pour une équipe de 8 à 10 personnes, ou
**inscription individuelle** (seul, à deux ou à trois) dans un groupe que la cave constitue à
une date qu'elle fixe, **10 personnes au maximum**. Formule de **35 € à 70 € par personne**
selon l'offre.

### La relecture du 31 octobre (épreuve annotée, `sources/`)
Sous-titre « des cadeaux » ; « sans alcool » ajouté à l'énumération ; jus de raisin entre la
bière et les chocolats ; gressins entre les chocolats et la terrine ; Boehler retiré ; le
signe € après les deux nombres ; « Livraison sous 7 jours » remplacé par « Disponible 7 jours
ouvrables après le paiement, à la Cave 71 » ; mention « Exemples de produits. ».

### Les visuels
- Une **image par produit**, toutes au même rendu studio : fond blanc, lumière douce du haut,
  ombre courte, même netteté. L'agence a refusé une première version qui mélangeait deux
  séances : *« c'est disproportionné, on dirait pas studio photo, les images sont pas du tout
  même éclairage, l'une sombre, l'autre floue »*.
- **Une seule ligne**, pas deux : *« il y en a trop et les espaces entre eux sont moches »*.
- Les **hauteurs suivent les tailles réelles** des emballages, pas le cadrage des images :
  75 cl **32 mm**, champagne **36**, spiritueux 70 cl **31**, jus de raisin **27**, bière
  33 cl **23**, chocolats **22**, gressins **20**, bocaux **12-13**.

## 4. Ce qui reste ouvert

1. **Le tarif de l'atelier.** L'annotation manuscrite de l'épreuve se lit « 35 à 40 € », la
   consigne orale dit cinq fois « 35 à 70 € ». C'est l'oral qui est sur la page. **À
   confirmer avant diffusion** : un prix ne se tranche pas seul.
2. **Les étiquettes.** Les visuels sont des retouches génératives ; plusieurs étiquettes sont
   fausses (voir `sources/LIRE_AVANT_UTILISATION.txt`). **Bon pour la maquette, pas pour
   l'impression.**
3. **La bière Trompe Souris.** Son fichier studio est tronqué sur le Drive et la version
   précédente est trop sombre et floue : elle ne figure pas sur la page. Le brief pour la
   refaire est dans `sources/briefs-chatgpt/`.
4. **Deux annotations non reprises**, faute de certitude : à côté de l'ancienne ligne de
   livraison, une mention qui ressemble à « ou sur place » ; et un mot illisible en haut à
   droite du titre.

## 5. Le mail d'accompagnement

Un brouillon existe dans le Gmail de l'agence (compte connecté : `contact.cave71@gmail.com`
le 30 octobre, `paudrysakho@gmail.com` le 31 — vérifier le `viewUrl` que renvoie
`create_draft`). Objet : « Vos cadeaux de fin d'année — coffrets et ateliers, Cave 71 ».

**L'agence préfère les brouillons aux envois** : *« tu fais les brouillons des mails et moi
j'envoie »*. Et un PDF de plus de 25 Mo ne peut pas être joint depuis une session : lui
donner le fichier dans la conversation, elle le joint elle-même.
