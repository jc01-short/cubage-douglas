CORRECTION V2.8 - FORMULAIRE GRUME

La capture montrait que le formulaire « Nouvelle grume » affichait encore D130 et le texte du protocole Arbre. Le correctif force maintenant, dès l'ouverture du formulaire Grume :
- masquage de D130 ;
- affichage de Longueur totale ;
- affichage du pas 1, 2 ou 4 m ;
- texte « point 0 m = gros bout » ;
- création avec type=grume ;
- aucune fenêtre Fin de tige.

DEPLOIEMENT
1. Ajouter grume-form-fix-v28.js à la racine.
2. Remplacer service-worker.js.
3. Conserver tree-type-fix-v27.js et tous les autres fichiers.
4. Committer, ouvrir en ligne, actualiser deux fois, fermer complètement puis rouvrir.

Le cache passe à cubage-douglas-complet-v28.
