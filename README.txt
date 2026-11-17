MISE A JOUR V1.13 - MISE EN PAGE PARCELLE

Nouvel ordre de l'écran parcelle :
1. cadre de synthèse de la parcelle ;
2. cadre Arbres ;
3. cadre Grumes ;
4. bouton de suppression de la parcelle.

Le cadre Arbres est sorti de l'ancien cadre de titre de parcelle.
Les cadres Arbres et Grumes utilisent la même présentation :
- titre et compteur en haut ;
- liste des saisies ;
- bouton de nouvelle saisie à l'intérieur du cadre.

Aucune donnée, aucun calcul et aucune fonction métier n'est modifié.

Déploiement GitHub :
- ajouter parcel-layout-patch.js à la racine ;
- remplacer service-worker.js ;
- conserver parcel-dashboard-patch.js et tous les autres patchs.
Le cache passe en v10.
