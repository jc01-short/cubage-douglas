(function () {
  "use strict";

  const DB_NAME = "cubage-douglas-v151";
  const DETAIL_VIEW_ID = "detail";
  const BUTTON_ID = "deleteTree";

  function element(id) {
    return document.getElementById(id);
  }

  function requestPromise(request) {
    return new Promise(function (resolve, reject) {
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error("Erreur IndexedDB")); };
    });
  }

  function openDatabase() {
    return new Promise(function (resolve, reject) {
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error("Base inaccessible")); };
    });
  }

  function parseFrenchNumber(text) {
    return Number(String(text || "").replace(/[^0-9,.-]/g, "").replace(",", "."));
  }

  function treeNumberFromTitle() {
    const title = element("detailTitle");
    if (!title) return "";
    return title.textContent.replace(/^Arbre\s+/i, "").trim();
  }

  async function locateDisplayedTree(db) {
    const number = treeNumberFromTitle();
    const d130 = parseFrenchNumber(element("dD130") && element("dD130").textContent);
    const htot = parseFrenchNumber(element("dHtot") && element("dHtot").textContent);
    const step = parseFrenchNumber(element("dStep") && element("dStep").textContent);

    const trees = await requestPromise(db.transaction("trees", "readonly").objectStore("trees").getAll());
    const matches = trees.filter(function (tree) {
      return String(tree.numero) === String(number)
        && Math.abs(Number(tree.d130) - d130) < 0.001
        && Math.abs(Number(tree.htot) - htot) < 0.001
        && Math.abs(Number(tree.step || 1) - step) < 0.001;
    });

    if (matches.length !== 1) {
      throw new Error(matches.length === 0
        ? "Arbre introuvable dans la base."
        : "Plusieurs arbres identiques ont été trouvés. Suppression annulée par sécurité.");
    }
    return matches[0];
  }

  async function deleteTreeAndMeasures() {
    const number = treeNumberFromTitle();
    const status = element("dStatus") ? element("dStatus").textContent.trim() : "";
    const confirmation = window.confirm(
      "Supprimer définitivement l’arbre " + number + " (" + status + ") et toutes ses mesures ?\n\nCette action est irréversible."
    );
    if (!confirmation) return;

    try {
      const db = await openDatabase();
      const tree = await locateDisplayedTree(db);
      const allMeasures = await requestPromise(db.transaction("measures", "readonly").objectStore("measures").getAll());
      const ids = allMeasures.filter(function (measure) { return measure.treeId === tree.id; }).map(function (measure) { return measure.id; });

      await new Promise(function (resolve, reject) {
        const transaction = db.transaction(["trees", "measures"], "readwrite");
        const treeStore = transaction.objectStore("trees");
        const measureStore = transaction.objectStore("measures");
        ids.forEach(function (id) { measureStore.delete(id); });
        treeStore.delete(tree.id);
        transaction.oncomplete = resolve;
        transaction.onerror = function () { reject(transaction.error || new Error("Suppression impossible")); };
        transaction.onabort = function () { reject(transaction.error || new Error("Suppression annulée")); };
      });

      db.close();
      window.alert("Arbre " + number + " et profil supprimés.");
      window.location.reload();
    } catch (error) {
      window.alert(error.message || String(error));
    }
  }

  function installDeleteButton() {
    const detail = element(DETAIL_VIEW_ID);
    const resume = element("resume");
    if (!detail || !resume || element(BUTTON_ID)) return;

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "Supprimer cet arbre";
    button.style.background = "#9d2525";
    button.style.color = "#ffffff";
    button.style.marginTop = "0";
    button.addEventListener("click", deleteTreeAndMeasures);
    resume.insertAdjacentElement("afterend", button);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installDeleteButton, { once: true });
  } else {
    installDeleteButton();
  }
})();
