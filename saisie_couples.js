(function() {
  "use strict";

  // Clé de stockage localStorage par parcelle
  const STORAGE_KEY = (parcelId) => `parcel_measures_${parcelId}`;

  // Au chargement de la page, on écoute le changement de parcelle
  document.addEventListener('DOMContentLoaded', () => {
    const parcelSelect = document.getElementById('parcelSelect');
    const parcelId = parcelIdParse = parcelId ? parseInt(parcelSelect.value) : null;
    const measures = loadMeasures(parcelIdParse);
    renderMeasures(measures, parcelIdParse);

    // Écoute du changement de parcelle
    if (parcelSelect) {
      parcelSelect.addEventListener('change', (e) => {
        const newParcelId = parseInt(e.target.value);
        const view = document.getElementById('measuresParcelView');
        view.style.display = newParcelId ? 'block' : 'none';
        const newMeasures = loadMeasures(newParcelId);
        renderMeasures(newMeasures, newParcelId);
        document.getElementById('couplesMsg').textContent = '';
      });
    }

    // Bouton "Ajouter une mesure"
    const btnAdd = document.getElementById('btnAddCouple');
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        const h = prompt('Hauteur totale (m) :');
        if (h === null || isNaN(h) || h <= 0) { document.getElementById('couplesMsg').textContent = 'Hauteur invalide.'; return; }
        const d = prompt('Diamètre 1,30 m (cm) :');
        if (d === null || isNaN(d) || d <= 0) { document.getElementById('couplesMsg').textContent = 'Diamètre invalide.'; return; }
        mesures.push({ h: parseFloat(h), d: parseFloat(d) });
        const pId = document.getElementById('parcelSelect') ? document.getElementById('parcelSelect').value : null;
        saveMeasures(mesures, pId);
        renderMeasures(mesures, pId);
        document.getElementById('couplesMsg').textContent = 'Nouvelle mesure enregistrée.';
      });
    }

    // Bouton "Enregistrer"
    const btnSave = document.getElementById('btnSaveCouples');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        document.getElementById('couplesMsg').textContent = 'Saisies enregistrées dans le stockage local.';
        document.getElementById('measuresParcelView').style.display = 'none';
      });
    }
  });

  // Fonctions utilitaires
  function loadMeasures(parcelId) {
    const data = localStorage.getItem(STORAGE_KEY(parcelId));
    return data ? JSON.parse(data) : [];
  }

  function saveMeasures(measures, parcelId) {
    if (parcelId) localStorage.setItem(STORAGE_KEY(parcelId), JSON.stringify(measures));
  }

  function renderMeasures(measures, parcelId) {
    const tbody = document.querySelector('#couplesTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    mesures.forEach((m, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${idx + 1}</td><td>${m.h}</td><td>${m.d}</td><td><button class="light" data-id="${idx}" data-parcel="${parcelId}">Suppr</button></td>`;
      tbody.appendChild(tr);
    });
    // Attacher suppression
    tbody.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rowIdx = parseInt(btn.dataset.id);
        const pId = parseInt(btn.dataset.parcel);
        mesures.splice(rowIdx, 1);
        saveMeasures(mesures, pId);
        renderMeasures(mesures, pId);
      });
    });
  }
})();