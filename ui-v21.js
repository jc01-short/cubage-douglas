(function(){
"use strict";
function byId(id){return document.getElementById(id);}
function hideJsonToolsWithoutRemoving(){
  var backup=byId('backupJson');
  var restore=byId('restoreJson');
  if(backup){backup.hidden=true;backup.style.display='none';}
  if(restore){
    restore.hidden=true;
    restore.style.display='none';
    var label=restore.closest?restore.closest('label'):null;
    if(label){label.hidden=true;label.style.display='none';}
  }
}
function removeHalfMeterOption(){
  var radio=document.querySelector('input[name="step"][value="0.5"]');
  if(!radio)return;
  var label=radio.closest?radio.closest('label'):null;
  if(label)label.remove();else radio.remove();
}
function goHome(){
  var overlay=byId('treeWalkOverlay');
  var modal=byId('twEndModal');
  if(modal)modal.hidden=true;
  if(overlay)overlay.hidden=true;
  document.querySelectorAll('.view').forEach(function(view){view.classList.toggle('active',view.id==='home');});
  var back=byId('back');if(back)back.hidden=true;
  var title=byId('appTitle');if(title)title.textContent='Cubage Douglas';
  window.scrollTo({top:0,behavior:'smooth'});
}
function addHomeButton(){
  if(byId('homeButton'))return;
  var header=document.querySelector('header.bar'),back=byId('back');
  if(!header)return;
  var button=document.createElement('button');
  button.id='homeButton';button.type='button';button.className='secondary compact';button.textContent='⌂ Accueil';
  button.addEventListener('click',goHome);
  if(back)back.insertAdjacentElement('afterend',button);else header.insertBefore(button,header.firstChild);
}
function addStyle(){
  if(byId('v23-ui-style'))return;
  var style=document.createElement('style');style.id='v23-ui-style';
  style.textContent='header.bar{flex-wrap:wrap}#homeButton{width:auto;margin:0}.steps{grid-template-columns:repeat(3,1fr)}@media(max-width:410px){.steps{grid-template-columns:repeat(3,1fr)}#appTitle{order:3;width:100%;margin:6px 0 0}}';
  document.head.appendChild(style);
}
function init(){
  /* Important : masquer les contrôles JSON, sans les supprimer. app.js leur attache encore des événements. */
  hideJsonToolsWithoutRemoving();
  removeHalfMeterOption();
  addHomeButton();
  addStyle();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();