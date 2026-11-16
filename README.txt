MISE A JOUR V1.8 - SUPPRESSION D'UNE PARCELLE

Fonction ajoutée :
- après ouverture d'une parcelle, un bouton rouge « Supprimer cette parcelle » apparaît ;
- la confirmation indique le nombre d'arbres et de mesures qui seront supprimés ;
- la parcelle, tous ses arbres et tous leurs profils sont supprimés ensemble ;
- la suppression est irréversible ;
- si plusieurs parcelles portent exactement le même nom, la suppression est bloquée par sécurité.

Déploiement GitHub :
1. Conserver delete-tree-patch.js déjà présent à la racine.
2. Ajouter delete-parcel-patch.js à la racine.
3. Remplacer service-worker.js par celui de cette archive.
4. Committer les fichiers.
5. Ouvrir l'application avec Internet, actualiser, fermer puis rouvrir.

Le cache passe en v5. La mise à jour ne supprime aucune donnée par elle-même.
