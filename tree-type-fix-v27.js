(function(){
"use strict";

/*
  Correctif de routage Arbre / Grume.
  Ce fichier est charge AVANT tree-protocol-v22.js.
  Pour une grume, il intercepte le bouton Creer et realise le flux conventionnel :
  numero + longueur + pas, puis profil aux positions regulieres.
  Pour un arbre, il ne fait rien et laisse tree-protocol-v22.js gerer le protocole
  numero + D130 + profil tous les metres + fin de tige.
*/

const DB_NAME="cubage-douglas-v151";
const $=id=>document.getElementById(id);
const request=r=>new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error||new Error("Erreur IndexedDB"));});
let db=null;

function store(name,mode="readonly"){
  return db.transaction(name,mode).objectStore(name);
}

function openDatabase(){
  return new Promise((ok,no)=>{
    const r=indexedDB.open(DB_NAME,1);
    r.onsuccess=()=>ok(r.result);
    r.onerror=()=>no(r.error||new Error("Base inaccessible"));
  });
}

function grumeFormIsActive(){
  const form=$("itemForm");
  const title=$("itemFormTitle");
  const d130Label=$("d130Label");
  if(!form||!form.classList.contains("active"))return false;
  const titleSaysGrume=title&&/grume/i.test(title.textContent||"");
  const d130IsHidden=d130Label&&(d130Label.hidden||getComputedStyle(d130Label).display==="none");
  return Boolean(titleSaysGrume||d130IsHidden);
}

async function createConventionalLog(event){
  if(!grumeFormIsActive())return;

  /* Bloque le gestionnaire special Arbre qui est charge ensuite. */
  event.preventDefault();
  event.stopImmediatePropagation();

  try{
    const parcelSelect=$("parcelSelect");
    const parcelId=parcelSelect&&parcelSelect.value?Number(parcelSelect.value):null;
    const numero=$("itemNumber")?$("itemNumber").value.trim():"";
    const longueur=$("itemLength")?Number($("itemLength").value):NaN;
    const selectedStep=document.querySelector('input[name="step"]:checked');
    const step=selectedStep?Number(selectedStep.value):1;
    const message=$("itemFormMsg");

    if(!parcelId||!numero||!(longueur>0)){
      if(message)message.textContent="Renseigne le numero de la grume et sa longueur.";
      return;
    }
    if(![1,2,4].includes(step)){
      if(message)message.textContent="Le pas de la grume doit etre de 1 m, 2 m ou 4 m.";
      return;
    }

    const all=await request(store("trees").getAll());
    const duplicate=all.some(item=>
      item.parcelId===parcelId&&item.type==="grume"&&String(item.numero)===numero
    );
    if(duplicate){
      if(message)message.textContent="Cette grume existe deja dans la parcelle.";
      return;
    }

    const grume={
      parcelId:parcelId,
      type:"grume",
      numero:numero,
      d130:0,
      htot:longueur,
      step:step,
      status:"en_cours",
      origin:"gros_bout_grume",
      terminalState:null
    };
    grume.id=await request(store("trees","readwrite").add(grume));

    /*
      app.js sait deja afficher et saisir une grume conventionnelle. Pour lui
      transmettre la grume nouvellement creee sans toucher a sa variable interne,
      on recharge la page puis on ouvre automatiquement la fiche via un marqueur
      de session. Le marqueur ne contient aucune donnee de mesure.
    */
    sessionStorage.setItem("cubage-open-log-id",String(grume.id));
    window.location.reload();
  }catch(error){
    const message=$("itemFormMsg");
    if(message)message.textContent=error.message||String(error);
  }
}

async function reopenCreatedLog(){
  const raw=sessionStorage.getItem("cubage-open-log-id");
  if(!raw)return;
  sessionStorage.removeItem("cubage-open-log-id");
  const id=Number(raw);
  if(!id)return;

  /* Attend que app.js ait fini d'initialiser l'interface. */
  let attempts=0;
  const timer=setInterval(async()=>{
    attempts++;
    const select=$("parcelSelect");
    const openParcel=$("openParcel");
    if(select&&openParcel){
      clearInterval(timer);
      const grume=await request(store("trees").get(id));
      if(!grume)return;
      select.value=String(grume.parcelId);
      select.dispatchEvent(new Event("change",{bubbles:true}));
      openParcel.click();
      window.setTimeout(()=>{
        const button=document.querySelector('#logList button[data-id="'+id+'"]');
        if(button)button.click();
      },350);
    }else if(attempts>30){
      clearInterval(timer);
    }
  },100);
}

async function init(){
  db=await openDatabase();
  const create=$("createItem");
  if(create){
    /* Enregistrement en capture avant tree-protocol-v22.js. */
    create.addEventListener("click",createConventionalLog,true);
  }
  reopenCreatedLog().catch(console.error);
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",()=>init().catch(console.error),{once:true});
}else{
  init().catch(console.error);
}
})();
