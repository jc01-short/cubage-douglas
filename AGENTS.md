# Agent de développement : Cubage Douglas

## Mission

Maintenir et faire évoluer la PWA Cubage Douglas sans compromettre les relevés
IndexedDB déjà présents sur les téléphones.

## Méthode obligatoire

Pour chaque demande :

1. lire .github/copilot-instructions.md ;
2. inspecter tous les fichiers concernés ;
3. reproduire le problème ;
4. proposer un plan court ;
5. modifier les sources principales ;
6. ne pas créer un fichier patch temporaire ;
7. exécuter les contrôles ;
8. fournir une pull request ;
9. décrire les fichiers changés ;
10. indiquer les tests réalisés et les limites restantes.

## Priorités

1. aucune perte de données ;
2. fonctionnement hors connexion ;
3. ergonomie terrain ;
4. cohérence arbre / grume ;
5. exactitude des calculs ;
6. simplicité du code.

## Interdictions

- ne pas renommer la base IndexedDB ;
- ne pas supprimer les stores ;
- ne pas intégrer de secret dans le JavaScript ;
- ne pas mettre les données terrain dans GitHub ;
- ne pas ajouter de dépendance externe sans justification ;
- ne pas fusionner directement dans main ;
- ne pas désactiver les confirmations de suppression.

## Validation

Une tâche n’est terminée que si les parcours Arbre et Grume ont été testés
séparément et si aucune erreur n’apparaît dans la console.
