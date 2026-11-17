(function(){
"use strict";
const FLAG="cubage-open-new-grume-profile";
function $(id){return document.getElementById(id);}
function isGrumeForm(){const form=$("itemForm"),title=$("itemFormTitle");return !!(form&&form.classList.contains("active")&&title&&/grume/i.test(title.textContent||""));}
/* Enregistrer l'intention avant que le correctif V2.8 crée la grume et recharge la page. */
document.addEventListener("click",function(event){
 const button=event.target.closest&&event.target.closest("#createItem");
 if(button&&isGrumeForm())sessionStorage.setItem(FLAG,"1");
},true);
function continueDirectly(){
 if(sessionStorage.getItem(FLAG)!=="1")return;
 let tries=0;
 const timer=setInterval(function(){
  tries++;
  const detail=$("detailView"),resume=$("resumeItem"),title=$("detailTitle");
  if(detail&&detail.classList.contains("active")&&resume&&title&&/grume/i.test(title.textContent||"")){
   clearInterval(timer);
   sessionStorage.removeItem(FLAG);
   resume.click();
  }else if(tries>100){
   clearInterval(timer);
   sessionStorage.removeItem(FLAG);
  }
 },100);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",continueDirectly,{once:true});else continueDirectly();
})();
