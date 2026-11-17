CORRECTION V2.4 - FENETRE FIN DE TIGE

Cause : la classe CSS .tw-modal imposait display:flex. Cette règle pouvait prendre le dessus sur l'attribut HTML hidden, ce qui maintenait la fenêtre visible même lorsqu'elle devait être fermée.

Correction :
- règle globale [hidden] { display:none !important; } ;
- fermeture forcée au démarrage ;
- bouton Annuler renforcé ;
- nettoyage de l'affichage lors de la validation.

DEPLOIEMENT GITHUB
1. Ajouter modal-fix-v24.js à la racine.
2. Remplacer service-worker.js.
3. Conserver ui-v21.js, tree-protocol-v22.js et tous les fichiers V2.
4. Committer.
5. Ouvrir le site avec Internet et actualiser deux fois.
6. Fermer complètement la PWA ou Chrome puis rouvrir.

Le cache passe à cubage-douglas-complet-v24. Aucune donnée IndexedDB n'est supprimée.
