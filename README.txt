CORRECTION V2.3 - INITIALISATION

Cause corrigée : ui-v21.js supprimait du DOM les contrôles backupJson et restoreJson, alors que app.js tentait encore de leur affecter onclick/onchange. Cela produisait : Cannot set properties of null (setting 'onclick').

Correction : les contrôles JSON restent dans le DOM mais sont masqués. L'utilisateur ne les voit plus, et app.js peut terminer son initialisation normalement.

Déploiement :
1. Remplacer ui-v21.js.
2. Remplacer service-worker.js.
3. Conserver tree-protocol-v22.js et tous les fichiers V2.
4. Committer sur GitHub.
5. Ouvrir avec Internet, actualiser deux fois, fermer complètement puis rouvrir.

Supprimer des fichiers de votre PC après leur déploiement GitHub n'a aucun effet sur le site. Les fichiers utiles sont ceux présents dans le dépôt GitHub et dans le cache du navigateur.
