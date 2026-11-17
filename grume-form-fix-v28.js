(function(){
"use strict";
const DB_NAME="cubage-douglas-v151";
const $=id=>document.getElementById(id);
const request=r=>new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error||new Error("Erreur IndexedDB"));});
let db=null,submitting=false;
function store(name,mode="readonly"){return db.transaction(name,mode).objectStore(name);}
function openDB(){return new Promise((ok,no)=>{const r=indexedDB.open(DB_NAME,1);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error||new Error("Base inaccessible"));});}
function isGrumeForm(){const form=$("itemForm"),title=$("itemFormTitle");return !!(form&&form.classList.contains("active")&&title&&/grume/i.test(title.textContent||""));}
function stepValue(){const r=document.querySelector('input[name="step"]:checked');return r?Number(r.value):1;}
function adaptGrumeForm(){if(!isGrumeForm())return;const d130=$("d130Label"),length=$("lengthLabel"),fieldset=$("itemForm").querySelector("fieldset"),note=$("originNote"),title=$("itemFormTitle"),button=$("createItem");
 if(title)title.textContent="Nouvelle grume";
 if(d130){d130.hidden=true;d130.style.display="none";}
 if(length){length.hidden=false;length.style.removeProperty("display");const text=Array.from(length.childNodes).find(n=>n.nodeType===3);if(text)text.nodeValue="Longueur totale (m)";}
 if(fieldset){fieldset.hidden=false;fieldset.style.removeProperty("display");}
 if(note)note.textContent="Le point 0 m correspond au gros bout de la grume. La longueur est connue dès la création.";
 if(button)button.textContent="Créer et saisir le profil de la grume";
}
async function createGrume(event){if(!isGrumeForm()||submitting)return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();submitting=true;
 try{const parcel=$("parcelSelect"),pid=parcel&&parcel.value?Number(parcel.value):null,numero=$("itemNumber").value.trim(),longueur=Number($("itemLength").value),step=stepValue(),msg=$("itemFormMsg");
  if(!pid||!numero||!(longueur>0)){if(msg)msg.textContent="Renseigne le numéro de la grume et sa longueur.";return;}
  if(![1,2,4].includes(step)){if(msg)msg.textContent="Choisis un pas de 1 m, 2 m ou 4 m.";return;}
  const all=await request(store("trees").getAll());
  if(all.some(x=>x.parcelId===pid&&x.type==="grume"&&String(x.numero)===numero)){if(msg)msg.textContent="Cette grume existe déjà dans la parcelle.";return;}
  const grume={parcelId:pid,type:"grume",numero:numero,d130:0,htot:longueur,step:step,status:"en_cours",origin:"gros_bout_grume",terminalState:null};
  grume.id=await request(store("trees","readwrite").add(grume));
  sessionStorage.setItem("cubage-open-log-id",String(grume.id));window.location.reload();
 }catch(error){const msg=$("itemFormMsg");if(msg)msg.textContent=error.message||String(error);}finally{submitting=false;}
}
async function reopen(){const raw=sessionStorage.getItem("cubage-open-log-id");if(!raw)return;sessionStorage.removeItem("cubage-open-log-id");const id=Number(raw),grume=await request(store("trees").get(id));if(!grume)return;let tries=0;const timer=setInterval(()=>{tries++;const s=$("parcelSelect"),open=$("openParcel");if(s&&open){clearInterval(timer);s.value=String(grume.parcelId);s.dispatchEvent(new Event("change",{bubbles:true}));open.click();setTimeout(()=>{const b=document.querySelector('#logList button[data-id="'+id+'"]');if(b)b.click();},500);}else if(tries>40)clearInterval(timer);},100);}
async function init(){db=await openDB();document.addEventListener("click",function(e){const b=e.target.closest&&e.target.closest("#createItem");if(b&&isGrumeForm())createGrume(e);},true);const obs=new MutationObserver(()=>setTimeout(adaptGrumeForm,0));obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class","hidden"]});adaptGrumeForm();reopen().catch(console.error);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>init().catch(console.error),{once:true});else init().catch(console.error);
})();
