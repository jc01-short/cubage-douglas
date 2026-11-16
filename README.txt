MISE A JOUR V1.7 - SUPPRESSION D'UN ARBRE

Fonction ajoutée :
- lorsqu'une fiche arbre est ouverte, un bouton rouge « Supprimer cet arbre » apparaît ;
- le bouton est disponible pour un arbre terminé ou en cours ;
- une confirmation précise que l'arbre et toutes ses mesures seront supprimés ;
- la suppression est réalisée dans une seule transaction IndexedDB ;
- si plusieurs arbres strictement identiques sont détectés, la suppression est bloquée par sécurité.

Déploiement GitHub :
1. Ajouter delete-tree-patch.js à la racine du dépôt.
2. Remplacer service-worker.js par celui de cette archive.
3. Committer les deux fichiers.
4. Ouvrir l'application avec Internet, actualiser, fermer puis rouvrir.

Le cache passe en v4. Les données existantes ne sont pas supprimées lors de la mise à jour.
