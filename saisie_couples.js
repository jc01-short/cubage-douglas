(function() {
  "use strict";

  document.addEventListener('DOMContentLoaded', () => {
    const parcelSelect = document.getElementById('parcelSelect');
    const measuresParcelView = document.getElementById('measuresParcelView');
    const btnOpenCouples = document.getElementById('btnOpenCouples');

    // Gérer le changement de parcelle
    if (parcelSelect) {
      parcelSelect.addEventListener('change', (e) => {
        const newParcelId = parseInt(e.target.value);
        if (newParcelId) {
          measuresParcelView.style.display = 'block';
        } else {
          measuresParcelView.style.display = 'none';
        }
      });
    }

    // Gérer le bouton "Saisir couples h/d"
    if (btnOpenCouples) {
      btnOpenCouples.addEventListener('click', () => {
        if (measuresParcelView.style.display === 'none') {
          measuresParcelView.style.display = 'block';
        } else {
          measuresParcelView.style.display = 'none';
        }
      });
    }
  });
})();