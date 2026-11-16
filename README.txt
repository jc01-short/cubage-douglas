MISE A JOUR V1.9 - GRUMES

Après ouverture d'une parcelle, deux types de relevés sont disponibles :
- Arbres complets, avec le fonctionnement existant ;
- Grumes, avec numéro, longueur, pas de mesure et profil de diamètres.

Le 0 m d'une grume correspond à son gros bout. Chaque grume peut être reprise, terminée ou supprimée. Les grumes utilisent les mêmes stores IndexedDB que les arbres, avec le champ type=grume.

GitHub : ajouter grumes-patch.js et remplacer service-worker.js. Conserver delete-tree-patch.js et delete-parcel-patch.js. Le cache passe en v6.
