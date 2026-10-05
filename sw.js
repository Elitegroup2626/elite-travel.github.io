// Elite Travel PWA - offline cache. Bump VERSION on every site update.
const VERSION='elite-v2';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==VERSION).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin) return;
  e.respondWith(
    fetch(r).then(res=>{const copy=res.clone();caches.open(VERSION).then(c=>c.put(r,copy));return res;})
      .catch(()=>caches.match(r).then(m=>m||caches.match('./index.html')))
  );
});
