const C='adhkar-v29';
const FILES=['./','./manifest.webmanifest','./icon-192.png','./icon-512.png','./hafs.18.woff2','./warsh.10.woff2','./qaloon.10.woff2','./en.js','./fr.js','./ru.js','./id.js','./it.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(f=>fetch(f,{redirect:'follow'}).then(r=>r.ok?clean(r).then(b=>c.put(f,b)):0).catch(()=>0)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function clean(r){if(!r.redirected)return Promise.resolve(r);return r.blob().then(b=>new Response(b,{status:200,headers:r.headers}))}
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(req.mode==='navigate'){
    const key='./';
    e.respondWith(fetch(key,{redirect:'follow'}).then(r=>clean(r).then(b=>{const cp=b.clone();caches.open(C).then(c=>c.put(key,cp)).catch(()=>{});return b})).catch(()=>caches.match(key).then(r=>r||new Response('offline',{status:503}))));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{if(res&&res.ok&&u.origin===location.origin){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp)).catch(()=>{})}return res}).catch(()=>caches.match('./'))));
});
