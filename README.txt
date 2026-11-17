MISE A JOUR V2.1

Modifications :
- suppression du pas de 0,5 m ;
- maintien des pas 1 m, 2 m et 4 m, avec 1 m sélectionné par défaut ;
- ajout du bouton « Accueil » dans la barre supérieure ;
- suppression des commandes de sauvegarde et restauration JSON ;
- maintien des deux exports CSV quotidiens.

DEPLOIEMENT GITHUB
1. Ajouter ui-v21.js à la racine du dépôt.
2. Remplacer service-worker.js.
3. Conserver index.html, styles.css, db.js, app.js, manifest.webmanifest et le dossier icons.
4. Committer, ouvrir l'application avec Internet, actualiser deux fois, fermer puis rouvrir.

Le cache PWA passe à cubage-douglas-complet-v21. Les données IndexedDB ne sont pas effacées.
