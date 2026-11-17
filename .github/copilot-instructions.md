# Instructions permanentes : Cubage Douglas

## Objet du projet

PWA mobile de terrain destinée à la collecte de profils de tiges de Douglas
pour l’élaboration d’un tarif de cubage et de modèles de défilement.

L’application est hébergée sur GitHub Pages et doit fonctionner hors connexion
sur Android après un premier chargement en ligne.

## Utilisateurs

Techniciens forestiers travaillant en forêt, avec :

- réseau absent ou instable ;
- téléphone tenu d’une main ;
- gants possibles ;
- forte luminosité ;
- saisie rapide et fiable prioritaire ;
- export quotidien en CSV.

## Architecture attendue

L’application doit rester simple et statique :

- index.html
- styles.css
- db.js
- app.js
- manifest.webmanifest
- service-worker.js
- icons/

Ne pas ajouter de framework JavaScript sans demande explicite.

Ne pas ajouter de backend, Firebase, Supabase ou synchronisation cloud.

Les données sont locales dans IndexedDB.

Nom de la base à conserver :

cubage-douglas-v151

Stores IndexedDB :

- parcels
- trees
- measures

Ne jamais changer le nom de la base ni supprimer les stores sans prévoir une
migration explicite et demander une validation.

## Règles métier : parcelles

Une parcelle contient des arbres et des grumes.

La suppression d’une parcelle supprime ses arbres, ses grumes et leurs mesures,
après double confirmation explicite.

## Règles métier : arbres complets

Création :

1. numéro de l’arbre ;
2. D130 en cm.

Le D130 est mesuré à 1,30 m depuis le trait de coupe de l’abatteuse.

Pour les arbres, le pas est obligatoirement de 1 m et ne doit pas être modifiable.

Profil :

- première mesure à 0 m ;
- puis 1 m, 2 m, 3 m, etc. ;
- sauvegarde IndexedDB après chaque diamètre ;
- possibilité d’annuler la dernière mesure ;
- contrôle si un diamètre augmente.

Fin de tige :

- bouton distinct « Fin de tige » ;
- saisie de Htot exacte ;
- saisie du diamètre terminal ;
- état : cime complète ou tige cassée ;
- Htot doit être strictement supérieure à la dernière mesure régulière ;
- Htot doit être inférieure ou égale au mètre suivant.

Exemple valide :

- 42,00 m → 8 cm ;
- 42,50 m → 3 cm ;
- Htot = 42,50 m.

## Règles métier : grumes

Une grume est différente d’un arbre.

Création :

1. numéro de grume ;
2. longueur totale connue ;
3. pas de 1 m, 2 m ou 4 m.

Le point 0 m correspond au gros bout.

Une grume :

- ne possède pas de D130 ;
- ne déclenche jamais la fenêtre Fin de tige ;
- ouvre directement l’écran de saisie du profil après création ;
- est stockée avec type = "grume" ;
- apparaît uniquement dans le cadre Grumes.

## Saisie vocale

La saisie vocale doit être disponible sur l’écran du profil d’un arbre.

Flux :

1. appui sur le micro ;
2. reconnaissance d’un diamètre en français ;
3. affichage de la valeur comprise ;
4. possibilité de modifier la valeur ;
5. bouton Valider ;
6. aucune sauvegarde sans validation humaine.

Conserver en parallèle la saisie clavier.

## Calculs

Surface circulaire :

S = π × D² / 4

D doit être converti de cm en m.

Volume de chaque tronçon par Smalian :

V = L × (S1 + S2) / 2

Afficher pour une tige terminée :

- volume Smalian mesuré ;
- volume total ;
- volume à la découpe 20 cm ;
- volume à la découpe 14 cm ;
- volume bois fort 7 cm ;
- DMM en cm/m.

Les hauteurs aux découpes sont calculées par interpolation linéaire.

Ne pas demander manuellement H20, H14 ou H7.

## Classes forestières

Classes de 5 cm :

- classe 20 : [17,5 ; 22,5[
- classe 25 : [22,5 ; 27,5[
- classe 30 : [27,5 ; 32,5[
- etc.

Ne jamais limiter les classes à 80 ou 150 cm.

Le tableau doit continuer automatiquement jusqu’à la classe maximale observée.

Référence :

- arbres : D130 ;
- grumes : premier diamètre mesuré au gros bout.

## Interface

Écran parcelle, dans cet ordre :

1. synthèse de la parcelle ;
2. cadre Arbres ;
3. cadre Grumes ;
4. suppression de la parcelle.

Les cadres Arbres et Grumes ont la même mise en page :

- titre ;
- compteur ;
- liste ;
- bouton de nouvelle saisie dans le cadre.

Un bouton Accueil doit rester disponible dans la barre supérieure.

## Exports

Conserver deux exports :

- profils.csv : une ligne par mesure ;
- tiges.csv : une ligne par arbre ou grume avec volumes calculés.

Ne pas afficher la sauvegarde ou la restauration JSON pour l’instant.

## PWA

L’application doit :

- fonctionner sur GitHub Pages ;
- utiliser un manifest valide ;
- posséder des icônes 192 et 512 px ;
- fonctionner hors connexion après le premier chargement ;
- ne jamais supprimer IndexedDB lors d’une mise à jour ;
- incrémenter le nom du cache du service worker après une mise à jour.

## Qualité attendue

Avant toute pull request :

1. vérifier qu’aucune erreur JavaScript n’est présente ;
2. tester la création d’une parcelle ;
3. tester un arbre complet ;
4. tester une grume ;
5. tester la reprise d’un profil ;
6. tester les suppressions ;
7. tester les deux exports CSV ;
8. tester le chargement hors connexion ;
9. vérifier que les données existantes IndexedDB ne sont pas effacées.

Ne pas accumuler de fichiers patch-vXX.js.

Les corrections doivent être intégrées directement dans les fichiers sources
principaux.

Ne pas modifier plusieurs comportements métier dans une même pull request,
sauf demande explicite.
