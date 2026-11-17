(function(){
"use strict";

function element(id){return document.getElementById(id);}

function installHiddenFix(){
  if(element("hidden-fix-v24"))return;
  var style=document.createElement("style");
  style.id="hidden-fix-v24";
  style.textContent="[hidden]{display:none!important}.tw-modal[hidden]{display:none!important}#twEndModal[hidden]{display:none!important}";
  document.head.appendChild(style);
}

function closeEndModal(){
  var modal=element("twEndModal");
  if(!modal)return;
  modal.hidden=true;
  modal.setAttribute("hidden","");
  modal.style.display="none";
}

function reinforceModalButtons(){
  var modal=element("twEndModal");
  var cancel=element("twCancelEnd");
  var confirm=element("twConfirmEnd");
  var open=element("twEnd");

  if(cancel&&!cancel.dataset.v24){
    cancel.dataset.v24="1";
    cancel.addEventListener("click",function(){
      closeEndModal();
    },true);
  }

  if(open&&!open.dataset.v24){
    open.dataset.v24="1";
    open.addEventListener("click",function(){
      if(modal){
        modal.style.removeProperty("display");
        modal.hidden=false;
        modal.removeAttribute("hidden");
      }
    });
  }

  if(confirm&&!confirm.dataset.v24){
    confirm.dataset.v24="1";
    confirm.addEventListener("click",function(){
      window.setTimeout(function(){
        if(modal&&modal.hidden)modal.style.display="none";
      },50);
    });
  }
}

function init(){
  installHiddenFix();
  closeEndModal();
  reinforceModalButtons();

  var observer=new MutationObserver(function(){
    reinforceModalButtons();
    var modal=element("twEndModal");
    if(modal&&modal.hasAttribute("hidden"))modal.style.display="none";
  });
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["hidden"]});
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
