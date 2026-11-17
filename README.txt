MISE À JOUR V2.6

1. SAISIE VOCALE RÉTABLIE DANS LE NOUVEAU PROTOCOLE ARBRE
- boutons Saisie clavier / Saisie vocale dans l'écran du profil d'arbre ;
- appui sur le micro ;
- affichage du diamètre compris ;
- champ modifiable ;
- bouton Valider ;
- bouton Modifier / recommencer ;
- aucune mesure vocale n'est enregistrée sans validation.

2. CLASSES FORESTIÈRES DYNAMIQUES
- mise à jour automatique lors de l'ouverture de la parcelle et au fur et à mesure des saisies ;
- classes de 5 cm : classe C = [C-2,5 ; C+2,5[ ;
- affichage de 20 à la classe maximale réellement observée ;
- aucun plafond à 80 cm ni à 150 cm ;
- les classes 155, 160, etc. apparaissent automatiquement si nécessaire ;
- arbres classés par D130, grumes par premier diamètre au gros bout.

DÉPLOIEMENT GITHUB
- ajouter tree-voice-v26.js ;
- ajouter forest-classes-v26.js ;
- remplacer service-worker.js ;
- conserver ui-v21.js, tree-protocol-v22.js, modal-fix-v24.js, reset-data-v25.js et tous les fichiers V2.

Le cache passe à cubage-douglas-complet-v26. Après le commit : ouvrir en ligne, actualiser deux fois, fermer complètement puis rouvrir.
