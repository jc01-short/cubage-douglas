(function () {
  "use strict";

  function element(id) {
    return document.getElementById(id);
  }

  function installStyles() {
    if (element("parcel-layout-v113-css")) return;
    const style = document.createElement("style");
    style.id = "parcel-layout-v113-css";
    style.textContent = `
      #parcel.active {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      #parcel.active > .parcel-dashboard,
      #parcel.active > .collection-card {
        width: 100%;
        margin: 0;
        background: #ffffff;
        padding: 16px;
        border-radius: 14px;
        box-shadow: 0 2px 10px #16382214;
      }

      #parcel.active > .parcel-dashboard { order: 1; }
      #parcel.active > #treeCollectionCard { order: 2; }
      #parcel.active > #grumeBlock { order: 3; }
      #parcel.active > #deleteParcel { order: 4; }

      #parcel.active > .parcel-original-header-v113 {
        display: none !important;
      }

      #treeCollectionCard .collection-head,
      #grumeBlock .collection-head-v113 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
      }

      #treeCollectionCard .collection-head h2,
      #grumeBlock .collection-head-v113 h2 {
        margin: 0;
      }

      #treeCollectionCard #treeCountBadge,
      #grumeBlock .grume-count-badge {
        color: #617066;
        font-size: .85rem;
        font-weight: 700;
      }

      #treeCollectionCard .collection-new,
      #grumeBlock .collection-new {
        width: 100%;
        margin: 12px 0 0;
      }
    `;
    document.head.appendChild(style);
  }

  function normalizeGrumeHeader(grumeCard) {
    const title = grumeCard.querySelector("h2");
    if (!title) return;

    let header = grumeCard.querySelector(".collection-head-v113");
    if (!header) {
      header = document.createElement("div");
      header.className = "collection-head-v113";
      title.parentNode.insertBefore(header, title);
      header.appendChild(title);
    }

    const badge = grumeCard.querySelector(".grume-count-badge");
    if (badge && badge.parentNode !== header) {
      header.appendChild(badge);
    }
  }

  function arrangeParcelScreen() {
    const parcel = element("parcel");
    if (!parcel || !parcel.classList.contains("active")) return;

    const dashboard = element("parcelDashboard");
    const treeCard = element("treeCollectionCard");
    const grumeCard = element("grumeBlock");
    if (!dashboard || !treeCard || !grumeCard) return;

    const title = element("parcelTitle");
    const originalHeader = title ? title.closest(".card") : null;
    if (originalHeader && originalHeader !== treeCard && originalHeader !== grumeCard) {
      originalHeader.classList.add("parcel-original-header-v113");
    }

    normalizeGrumeHeader(grumeCard);

    /* Les trois cadres deviennent des enfants directs de l'écran parcelle. */
    parcel.appendChild(dashboard);
    parcel.appendChild(treeCard);
    parcel.appendChild(grumeCard);

    const deleteButton = element("deleteParcel");
    if (deleteButton) parcel.appendChild(deleteButton);
  }

  function init() {
    installStyles();
    const observer = new MutationObserver(function () {
      window.setTimeout(arrangeParcelScreen, 60);
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class"]
    });
    window.setTimeout(arrangeParcelScreen, 1400);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
