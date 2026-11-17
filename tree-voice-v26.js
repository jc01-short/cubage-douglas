(function(){
"use strict";
let recognition=null,listening=false;
const $=id=>document.getElementById(id);
function parseFrenchNumber(text){
 let s=String(text||"").toLowerCase().replace(/,/g,'.').replace(/centim[eè]tres?/g,'').trim();
 let direct=s.match(/\d+(?:\.\d+)?/);if(direct)return Number(direct[0]);
 const u={zéro:0,zero:0,un:1,une:1,deux:2,trois:3,quatre:4,cinq:5,six:6,sept:7,huit:8,neuf:9,dix:10,onze:11,douze:12,treize:13,quatorze:14,quinze:15,seize:16,dixsept:17,dixhuit:18,dixneuf:19,vingt:20,trente:30,quarante:40,cinquante:50,soixante:60,cent:100};
 let words=s.replace(/-/g,' ').split(/\s+/),total=0,current=0;
 words.forEach(w=>{if(w==='cent'){current=(current||1)*100;}else if(u[w]!==undefined){current+=u[w];}});total+=current;return total||null;
}
function style(){if($('tree-voice-v26-css'))return;const s=document.createElement('style');s.id='tree-voice-v26-css';s.textContent=`
.tw-voice-mode{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.tw-voice-mode button{margin:0}.tw-voice-active{background:#195c35!important;color:#fff!important}.tw-voice-inactive{background:#e7efe9!important;color:#174d2e!important;border:1px solid #b8cbbb!important}.tw-mic{font-size:2rem;min-height:72px;background:#8b2020!important}.tw-mic.listening{background:#d02b2b!important;animation:twPulse 1s infinite}.tw-voice-box{border:2px solid #d7e2da;border-radius:12px;padding:12px;margin:10px 0;text-align:center}.tw-candidate{font-size:1.35rem;font-weight:800;text-align:center}.tw-candidate-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}@keyframes twPulse{50%{transform:scale(1.03)}}[hidden]{display:none!important}@media(max-width:390px){.tw-voice-mode,.tw-candidate-actions{grid-template-columns:1fr}}
`;document.head.appendChild(s);}
function install(){const add=$('twAdd'),input=$('twDiam');if(!add||!input||$('twVoiceMode'))return;style();
 const modes=document.createElement('div');modes.className='tw-voice-mode';modes.innerHTML='<button id="twManualMode" class="tw-voice-active" type="button">Saisie clavier</button><button id="twVoiceMode" class="tw-voice-inactive" type="button">🎤 Saisie vocale</button>';input.closest('label').insertAdjacentElement('beforebegin',modes);
 const panel=document.createElement('div');panel.id='twVoicePanel';panel.hidden=true;panel.innerHTML='<div class="tw-voice-box"><button id="twMic" class="tw-mic" type="button">🎤</button><p id="twVoiceHelp">Appuie sur le micro et prononce uniquement le diamètre.</p><div id="twCandidateBox" hidden><label>Diamètre compris (cm)<input id="twCandidate" class="tw-candidate" type="number" inputmode="decimal" step="0.1"></label><div class="tw-candidate-actions"><button id="twConfirmVoice" type="button">Valider</button><button id="twRetryVoice" class="tw-secondary" type="button">Modifier / recommencer</button></div></div></div>';add.insertAdjacentElement('afterend',panel);
 const manualLabel=input.closest('label');
 function setMode(voice){manualLabel.hidden=voice;add.hidden=voice;panel.hidden=!voice;$('twManualMode').className=voice?'tw-voice-inactive':'tw-voice-active';$('twVoiceMode').className=voice?'tw-voice-active':'tw-voice-inactive';}
 $('twManualMode').onclick=()=>setMode(false);$('twVoiceMode').onclick=()=>setMode(true);
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){$('twVoiceHelp').textContent='Reconnaissance vocale indisponible dans ce navigateur. Utilise Chrome Android ou la saisie clavier.';$('twMic').disabled=true;return;}
 recognition=new SR();recognition.lang='fr-FR';recognition.continuous=false;recognition.interimResults=false;recognition.maxAlternatives=1;
 recognition.onstart=()=>{listening=true;$('twMic').classList.add('listening');$('twVoiceHelp').textContent='Écoute en cours…';};
 recognition.onend=()=>{listening=false;$('twMic').classList.remove('listening');};
 recognition.onerror=e=>{$('twVoiceHelp').textContent='Erreur micro : '+e.error;};
 recognition.onresult=e=>{const text=e.results[0][0].transcript,value=parseFrenchNumber(text);$('twVoiceHelp').textContent='Entendu : « '+text+' »';if(value!==null){$('twCandidate').value=value;$('twCandidateBox').hidden=false;}else{$('twVoiceHelp').textContent+=' — nombre non reconnu.';}};
 $('twMic').onclick=()=>{if(listening)recognition.stop();else{$('twCandidateBox').hidden=true;recognition.start();}};
 $('twConfirmVoice').onclick=()=>{const value=Number($('twCandidate').value);if(!(value>0))return;$('twDiam').value=value;$('twAdd').click();$('twCandidate').value='';$('twCandidateBox').hidden=true;};
 $('twRetryVoice').onclick=()=>{$('twCandidate').focus();$('twCandidate').select();};
}
function init(){style();install();const observer=new MutationObserver(()=>install());observer.observe(document.body,{subtree:true,childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();