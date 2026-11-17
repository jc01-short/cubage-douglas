const CACHE="cubage-douglas-complet-v21";
const FILES=["./","./index.html","./styles.css","./db.js","./app.js","./ui-v21.js","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
async function patchHtml(response){
 const type=response.headers.get("content-type")||"";
 if(!type.includes("text/html"))return response;
 let html=await response.text();
 if(!html.includes("ui-v21.js"))html=html.replace("</body>",'<script src="./ui-v21.js"></script></body>');
 return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
}
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const url=new URL(e.request.url);
 const page=e.request.mode==="navigate"||url.pathname.endsWith("/index.html");
 if(page){
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy));return patchHtml(r)}).catch(async()=>{const cached=await caches.match("./index.html");return cached?patchHtml(cached):Response.error()}));
  return;
 }
 e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));
});
