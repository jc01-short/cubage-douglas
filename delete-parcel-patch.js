(function () {
  "use strict";

  const DB_NAME = "cubage-douglas-v151";
  const BUTTON_ID = "deleteParcel";

  function element(id) {
    return document.getElementById(id);
  }

  function requestPromise(request) {
    return new Promise(function (resolve, reject) {
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () {
        reject(request.error || new Error("Erreur IndexedDB"));
      };
    });
  }

  function openDatabase() {
    return new Promise(function (resolve, reject) {
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () {
        reject(request.error || new Error("Base inaccessible"));
      };
    });
  }

  function parcelNameFromScreen() {
    const title = element("parcelTitle");
    if (!title) return "";
    return title.textContent.replace(/^Parcelle\s+/i, "").trim();
  }

  async function locateDisplayedParcel(db) {
    const parcelName = parcelNameFromScreen();
    const parcels = await requestPromise(
      db.transaction("parcels", "readonly").objectStore("parcels").getAll()
    );
    const matches = parcels.filter(function (parcel) {
      return String(parcel.name).trim() === parcelName;
    });

    if (matches.length !== 1) {
      throw new Error(
        matches.length === 0
          ? "Parcelle introuvable dans la base."
          : "Plusieurs parcelles portent exactement ce nom. Suppression annulée par sécurité."
      );
    }
    return matches[0];
  }

  async function deleteParcelAndContents() {
    let db;
    try {
      db = await openDatabase();
      const parcel = await locateDisplayedParcel(db);
      const trees = await requestPromise(
        db.transaction("trees", "readonly").objectStore("trees").getAll()
      );
      const measures = await requestPromise(
        db.transaction("measures", "readonly").objectStore("measures").getAll()
      );

      const parcelTrees = trees.filter(function (tree) {
        return tree.parcelId === parcel.id;
      });
      const treeIds = parcelTrees.map(function (tree) { return tree.id; });
      const parcelMeasures = measures.filter(function (measure) {
        return treeIds.indexOf(measure.treeId) !== -1;
      });

      const confirmation = window.confirm(
        "Supprimer définitivement la parcelle « " + parcel.name + " » ?\n\n" +
        parcelTrees.length + " arbre(s) et " + parcelMeasures.length +
        " mesure(s) seront également supprimés.\n\nCette action est irréversible."
      );
      if (!confirmation) {
        db.close();
        return;
      }

      await new Promise(function (resolve, reject) {
        const transaction = db.transaction(
          ["parcels", "trees", "measures"],
          "readwrite"
        );
        const parcelStore = transaction.objectStore("parcels");
        const treeStore = transaction.objectStore("trees");
        const measureStore = transaction.objectStore("measures");

        parcelMeasures.forEach(function (measure) {
          measureStore.delete(measure.id);
        });
        parcelTrees.forEach(function (tree) {
          treeStore.delete(tree.id);
        });
        parcelStore.delete(parcel.id);

        transaction.oncomplete = resolve;
        transaction.onerror = function () {
          reject(transaction.error || new Error("Suppression impossible"));
        };
        transaction.onabort = function () {
          reject(transaction.error || new Error("Suppression annulée"));
        };
      });

      db.close();
      window.alert(
        "Parcelle « " + parcel.name + " », arbres et profils supprimés."
      );
      window.location.reload();
    } catch (error) {
      if (db) db.close();
      window.alert(error.message || String(error));
    }
  }

  function installParcelDeleteButton() {
    const parcelView = element("parcel");
    const newTreeButton = element("parcelNewTree");
    if (!parcelView || !newTreeButton || element(BUTTON_ID)) return;

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "Supprimer cette parcelle";
    button.style.background = "#9d2525";
    button.style.color = "#ffffff";
    button.style.marginTop = "0";
    button.addEventListener("click", deleteParcelAndContents);
    newTreeButton.insertAdjacentElement("afterend", button);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      installParcelDeleteButton,
      { once: true }
    );
  } else {
    installParcelDeleteButton();
  }
})();
