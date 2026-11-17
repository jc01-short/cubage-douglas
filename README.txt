MISE A JOUR V1.10 - RECAPITULATIF DE CUBAGE

Sur une tige terminée ou une grume terminée, la fiche affiche :
- volume Smalian mesuré entre les sections réellement relevées ;
- volume total estimé jusqu'à Htot/longueur totale ;
- volumes aux découpes 20 cm, 14 cm et 7 cm ;
- DMM mesurée en cm/m.

Hypothèses :
- section circulaire ;
- interpolation linéaire des diamètres entre deux mesures ;
- formule de Smalian pour chaque tronçon ;
- si la dernière mesure est avant Htot, ajout d'une section terminale estimée allant du dernier diamètre à 0 cm à Htot ;
- DMM = (diamètre initial - dernier diamètre réellement mesuré) / longueur réellement mesurée.

GitHub : ajouter volume-recap-patch.js et remplacer service-worker.js. Conserver les patchs précédents. Le cache passe en v7.
