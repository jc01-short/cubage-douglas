(function () {
  "use strict";

  const DB_NAME = "cubage-douglas-v151";
  const BUTTON_ID = "resetAllData";

  function element(id) {
    return document.getElementById(id);
  }

  function openDatabase() {
    return new Promise(function (resolve, reject) {
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () {
        reject(request.error || new Error("Impossible d’ouvrir la base locale."));
      };
      request.onblocked = function () {
        reject(new Error("La base est utilisée dans un autre onglet. Ferme les autres fenêtres de l’application."));
      };
    });
  }

  async function getCounts(db) {
    const names = ["parcels", "trees", "measures"];
    const values = await Promise.all(names.map(function (name) {
      return new Promise(function (resolve, reject) {
        const request = db.transaction(name, "readonly").objectStore(name).count();
        request.onsuccess = function () { resolve(request.result); };
        request.onerror = function () { reject(request.error); };
      });
    }));
    return { parcels: values[0], items: values[1], measures: values[2] };
  }

  function clearAllStores(db) {
    return new Promise(function (resolve, reject) {
      const transaction = db.transaction(["parcels", "trees", "measures"], "readwrite");
      transaction.objectStore("measures").clear();
      transaction.objectStore("trees").clear();
      transaction.objectStore("parcels").clear();
      transaction.oncomplete = resolve;
      transaction.onerror = function () {
        reject(transaction.error || new Error("La réinitialisation a échoué."));
      };
      transaction.onabort = function () {
        reject(transaction.error || new Error("La réinitialisation a été annulée."));
      };
    });
  }

  async function resetAllData() {
    let db;
    try {
      db = await openDatabase();
      const counts = await getCounts(db);

      if (counts.parcels === 0 && counts.items === 0 && counts.measures === 0) {
        window.alert("La base locale est déjà vide.");
        db.close();
        return;
      }

      const confirmation = window.confirm(
        "RÉINITIALISATION COMPLÈTE\n\n" +
        counts.parcels + " parcelle(s), " +
        counts.items + " arbre(s) ou grume(s), et " +
        counts.measures + " mesure(s) seront supprimés.\n\n" +
        "Exporte les CSV avant de continuer. Cette action est irréversible.\n\n" +
        "Continuer ?"
      );
      if (!confirmation) {
        db.close();
        return;
      }

      const typed = window.prompt(
        "Pour confirmer la suppression définitive, écris exactement :\n\nEFFACER"
      );
      if (typed !== "EFFACER") {
        window.alert("Réinitialisation annulée. Aucun relevé n’a été supprimé.");
        db.close();
        return;
      }

      await clearAllStores(db);
      db.close();
      window.alert("La base locale est maintenant vide. L’application va redémarrer.");
      window.location.reload();
    } catch (error) {
      if (db) db.close();
      window.alert(error.message || String(error));
    }
  }

  function installResetButton() {
    if (element(BUTTON_ID)) return;
    const home = element("home");
    if (!home) return;

    const card = document.createElement("div");
    card.className = "card";
    card.id = "resetCard";
    card.innerHTML =
      '<h2>Réinitialisation</h2>' +
      '<p class="smallnote">À utiliser uniquement après avoir exporté les CSV. Cette action efface toutes les parcelles, tous les arbres, toutes les grumes et tous les profils présents sur cet appareil.</p>';

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.className = "danger";
    button.textContent = "Tout effacer et repartir à zéro";
    button.addEventListener("click", resetAllData);
    card.appendChild(button);
    home.appendChild(card);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installResetButton, { once: true });
  } else {
    installResetButton();
  }
})();
