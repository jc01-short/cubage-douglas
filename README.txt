MISE À JOUR V2.5 - RÉINITIALISATION COMPLÈTE

Un cadre « Réinitialisation » est ajouté en bas de l'écran d'accueil.
Le bouton rouge « Tout effacer et repartir à zéro » supprime localement :
- toutes les parcelles ;
- tous les arbres ;
- toutes les grumes ;
- toutes les mesures et tous les profils.

Sécurité :
1. affichage du nombre d'éléments qui seront supprimés ;
2. première confirmation ;
3. saisie obligatoire du mot EFFACER ;
4. suppression des trois stores IndexedDB dans une seule transaction.

Cette opération n'efface pas les fichiers CSV déjà téléchargés et ne modifie pas les fichiers GitHub. Elle ne concerne que les données IndexedDB de l'appareil utilisé.

DÉPLOIEMENT GITHUB
1. Ajouter reset-data-v25.js à la racine.
2. Remplacer service-worker.js.
3. Conserver ui-v21.js, tree-protocol-v22.js, modal-fix-v24.js et les fichiers de la V2.
4. Committer puis ouvrir l'application avec Internet.
5. Actualiser deux fois, fermer complètement, puis rouvrir.

Le cache passe à cubage-douglas-complet-v25.
