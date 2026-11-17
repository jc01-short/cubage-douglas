(function(){
"use strict";
const DB='cubage-douglas-v151';
const $=id=>document.getElementById(id);
const req=r=>new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error||new Error('Erreur IndexedDB'));});
let db=null,running=false;
function store(n){return db.transaction(n,'readonly').objectStore(n);}
function openDB(){return new Promise((ok,no)=>{const r=indexedDB.open(DB,1);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});}
function fmt(n){return Number(n).toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1});}
async function render(){if(running)return;const view=$('parcelView');if(!view||!view.classList.contains('active'))return;const summary=$('parcelSummary'),select=$('parcelSelect');if(!summary||!select||!select.value)return;running=true;try{
 const pid=Number(select.value),[items,measures]=await Promise.all([req(store('trees').getAll()),req(store('measures').getAll())]),list=items.filter(x=>x.parcelId===pid),counts=new Map();let maxClass=20,minClass=20;
 list.forEach(item=>{let d;if(item.type==='grume'){const p=measures.filter(m=>m.treeId===item.id).sort((a,b)=>a.hauteur-b.hauteur);d=p.length?Number(p[0].diametre):NaN;}else d=Number(item.d130);if(!Number.isFinite(d))return;const c=Math.floor((d+2.5)/5)*5;minClass=Math.min(minClass,c);maxClass=Math.max(maxClass,c);if(!counts.has(c))counts.set(c,{tree:0,log:0});counts.get(c)[item.type==='grume'?'log':'tree']++;});
 /* Toujours afficher les classes de 20 jusqu'à la classe maximale observée, sans plafond à 80 ou 150. */
 maxClass=Math.max(80,maxClass);const rows=[];for(let c=Math.min(20,minClass);c<=maxClass;c+=5){const n=counts.get(c)||{tree:0,log:0};rows.push({c,tree:n.tree,log:n.log});}
 let old=summary.querySelector('.diam-table');if(old){const heading=old.previousElementSibling,note=old.nextElementSibling;old.remove();if(heading&&/classe/i.test(heading.textContent))heading.remove();if(note&&note.classList.contains('smallnote'))note.remove();}
 const wrap=document.createElement('div');wrap.id='forestClassesV26';wrap.innerHTML='<h3>Classes forestières de diamètre</h3><table class="diam-table"><thead><tr><th>Classe</th><th>Plage</th><th>Arbres</th><th>Grumes</th><th>Total</th></tr></thead><tbody>'+rows.map(r=>'<tr><td><b>'+r.c+'</b></td><td>'+fmt(r.c-2.5)+'–'+fmt(r.c+2.5)+'</td><td>'+r.tree+'</td><td>'+r.log+'</td><td><b>'+(r.tree+r.log)+'</b></td></tr>').join('')+'</tbody></table><p class="smallnote">Mise à jour automatique : arbres classés par D130, grumes par diamètre au gros bout. Les classes continuent au-delà de 150 cm si nécessaire.</p>';
 const previous=$('forestClassesV26');if(previous)previous.remove();summary.appendChild(wrap);
 }finally{running=false;}}
async function init(){db=await openDB();const observer=new MutationObserver(()=>setTimeout(render,60));observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});setInterval(render,1500);setTimeout(render,700);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init().catch(console.error));else init().catch(console.error);
})();