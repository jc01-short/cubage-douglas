(function(){
"use strict";
const DB="cubage-douglas-v151";
const $=id=>document.getElementById(id);
const req=r=>new Promise((ok,no)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error||new Error("Erreur IndexedDB"));});
const fmt=(n,d=3)=>Number(n).toLocaleString("fr-FR",{minimumFractionDigits:d,maximumFractionDigits:d});
let db=null;
function store(n,m="readonly"){return db.transaction(n,m).objectStore(n)}
function openDB(){return new Promise((ok,no)=>{const r=indexedDB.open(DB,1);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error);});}
function area(dcm){const dm=dcm/100;return Math.PI*dm*dm/4;}
function smalian(h1,d1,h2,d2){const L=h2-h1;return L>0?L*(area(d1)+area(d2))/2:0;}
function sortedMeasures(all,id){return all.filter(x=>x.treeId===id).sort((a,b)=>a.hauteur-b.hauteur);}
function completeProfile(measures,length){const p=measures.map(x=>({h:Number(x.hauteur),d:Number(x.diametre)}));if(!p.length)return p;const last=p[p.length-1];if(length>last.h){p.push({h:Number(length),d:0,virtual:true});}return p;}
function measuredVolume(p){let v=0;for(let i=0;i<p.length-1;i++)v+=smalian(p[i].h,p[i].d,p[i+1].h,p[i+1].d);return v;}
function cutoffVolume(profile,threshold){let v=0;for(let i=0;i<profile.length-1;i++){
 const a=profile[i],b=profile[i+1];
 if(a.d<threshold)break;
 if(b.d>=threshold){v+=smalian(a.h,a.d,b.h,b.d);continue;}
 if(a.d===b.d)break;
 const ratio=(a.d-threshold)/(a.d-b.d);
 const hc=a.h+ratio*(b.h-a.h);
 v+=smalian(a.h,a.d,hc,threshold);
 break;
}return v;}
function metrics(item,measures){
 if(measures.length<2)return null;
 const measured=measures.map(x=>({h:Number(x.hauteur),d:Number(x.diametre)}));
 const complete=completeProfile(measures,Number(item.htot));
 const first=measured[0],last=measured[measured.length-1];
 const measuredLength=last.h-first.h;
 const dmm=measuredLength>0?(first.d-last.d)/measuredLength:null;
 return {
  measured:measuredVolume(measured),
  total:measuredVolume(complete),
  v20:cutoffVolume(complete,20),
  v14:cutoffVolume(complete,14),
  v7:cutoffVolume(complete,7),
  dmm:dmm,
  measuredTo:last.h,
  estimated:Number(item.htot)>last.h
 };
}
function recapHtml(m){if(!m)return '<div class="recap-warning">Au moins deux diamètres sont nécessaires pour calculer les volumes.</div>';return `
 <div class="recap-grid">
  <div><span>Volume Smalian mesuré</span><b>${fmt(m.measured)} m³</b></div>
  <div><span>Volume total estimé</span><b>${fmt(m.total)} m³</b></div>
  <div><span>Volume découpe 20 cm</span><b>${fmt(m.v20)} m³</b></div>
  <div><span>Volume découpe 14 cm</span><b>${fmt(m.v14)} m³</b></div>
  <div><span>Volume bois fort 7 cm</span><b>${fmt(m.v7)} m³</b></div>
  <div><span>DMM mesurée</span><b>${m.dmm===null?'—':fmt(m.dmm,2)+' cm/m'}</b></div>
 </div>
 <p class="recap-note">${m.estimated?'Le volume total et les volumes de découpe complètent le profil par une section terminale estimée jusqu’à Htot, avec un diamètre final de 0 cm. ':''}DMM = (diamètre initial − dernier diamètre mesuré) / longueur mesurée. Calculs sur écorce si les diamètres saisis sont sur écorce.</p>`;}
function addCss(){const s=document.createElement('style');s.textContent=`.recap-box{margin:14px 0;padding:14px;border:2px solid #b8d1bf;border-radius:12px;background:#f7faf7}.recap-box h3{margin:0 0 10px}.recap-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.recap-grid div{background:#fff;padding:10px;border-radius:8px;border:1px solid #d7e2da}.recap-grid span{display:block;color:#617066;font-size:.78rem}.recap-grid b{display:block;margin-top:4px;color:#195c35}.recap-note{font-size:.78rem;color:#617066;margin:10px 0 0}.recap-warning{padding:10px;background:#fff0bf;color:#765400;border-radius:8px}@media(max-width:390px){.recap-grid{grid-template-columns:1fr}}`;document.head.appendChild(s);}
async function findTreeFromDetail(){const title=$('detailTitle');if(!title)return null;const numero=title.textContent.replace(/^Arbre\s+/i,'').trim();const trees=await req(store('trees').getAll());const candidates=trees.filter(x=>x.type!=="grume"&&String(x.numero)===numero);if(candidates.length===1)return candidates[0];const d130=parseFloat((($('dD130')||{}).textContent||'').replace(',','.'));return candidates.find(x=>Math.abs(Number(x.d130)-d130)<.01)||null;}
async function renderTreeRecap(){const detail=$('detail');if(!detail||!detail.classList.contains('active'))return;const item=await findTreeFromDetail();if(!item||item.status!=="termine")return;const all=await req(store('measures').getAll()),m=metrics(item,sortedMeasures(all,item.id));let box=$('treeVolumeRecap');if(!box){box=document.createElement('div');box.id='treeVolumeRecap';box.className='recap-box';const hist=$('detailHistory');hist.parentNode.insertBefore(box,hist);}box.innerHTML='<h3>Récapitulatif de cubage</h3>'+recapHtml(m);}
async function renderGrumeRecap(){const panel=$('grumeProfile');if(!panel||panel.hidden)return;const title=$('grumeTitle');if(!title)return;const numero=title.textContent.replace(/^Grume\s+/i,'').trim();const trees=await req(store('trees').getAll());const item=trees.find(x=>x.type==='grume'&&String(x.numero)===numero);if(!item||item.status!=="termine")return;const all=await req(store('measures').getAll()),m=metrics(item,sortedMeasures(all,item.id));let box=$('grumeVolumeRecap');if(!box){box=document.createElement('div');box.id='grumeVolumeRecap';box.className='recap-box';const hist=$('grumeHistory');hist.parentNode.insertBefore(box,hist);}box.innerHTML='<h3>Récapitulatif de cubage</h3>'+recapHtml(m);}
async function init(){db=await openDB();addCss();const obs=new MutationObserver(()=>{renderTreeRecap().catch(console.error);renderGrumeRecap().catch(console.error);});obs.observe(document.body,{subtree:true,attributes:true,childList:true});setTimeout(()=>{renderTreeRecap();renderGrumeRecap();},1000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init().catch(console.error));else init().catch(console.error);
})();