CORRECTION V2.7 - DISTINCTION ARBRE / GRUME

Arbre :
- numero + D130 ;
- profil impose tous les metres ;
- bouton Fin de tige ;
- Htot exacte + dernier diametre + cime complete/cassee.

Grume :
- numero + longueur totale + pas 1, 2 ou 4 m ;
- saisie conventionnelle du profil depuis le gros bout ;
- aucune fenetre Fin de tige ;
- la longueur est connue des la creation ;
- la grume est enregistree avec type=grume et apparait uniquement dans le cadre Grumes.

DEPLOIEMENT
1. Ajouter tree-type-fix-v27.js a la racine GitHub.
2. Remplacer service-worker.js.
3. Conserver les autres fichiers V2.6.
4. Committer, ouvrir avec Internet, actualiser deux fois, fermer completement puis rouvrir.

Le cache passe a cubage-douglas-complet-v27.
