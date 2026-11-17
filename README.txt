MISE A JOUR V2.2 - PROTOCOLE ARBRE EN UN SEUL PARCOURS

ARBRES
- création avec Numéro + D130 seulement ;
- pas imposé à 1 m ;
- saisie régulière 0 m, 1 m, 2 m, etc. ;
- bouton Fin de tige ;
- saisie finale de Htot exacte et du dernier diamètre ;
- Htot doit être située entre la dernière position régulière et la position entière suivante ;
- état terminal : cime complète ou tige cassée ;
- enregistrement d'une dernière section de longueur réelle, par exemple 42,00 m puis 42,50 m.

GRUMES
- fonctionnement inchangé ;
- pas 1 m, 2 m ou 4 m selon la V2.1.

CALCULS
Les calculs Smalian et les découpes 20, 14 et 7 cm utilisent automatiquement la dernière position exacte et le dernier diamètre. Aucun champ H20/H14/H7 n'est demandé.

GITHUB
1. Ajouter tree-protocol-v22.js à la racine.
2. Remplacer service-worker.js.
3. Conserver ui-v21.js et les fichiers de la V2.
4. Committer, ouvrir en ligne, actualiser deux fois, fermer puis rouvrir.

Le cache passe à cubage-douglas-complet-v22. La base IndexedDB reste inchangée.
