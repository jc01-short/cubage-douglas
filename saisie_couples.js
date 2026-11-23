(function() {
  "use strict";
  document.addEventListener('DOMContentLoaded', () => {
    const homeSection = document.getElementById('home');
    const measuresView = document.getElementById('measuresParcelView');
    const openBtn = document.getElementById('btnOpenCouples');
    
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        if (homeSection) homeSection.style.display = 'none';
        if (measuresView) measuresView.style.display = 'block';
      });
    }
  });
})();