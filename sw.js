const CACHE_NAME='grandpa-demon-v5716-shop-sync-castle-intro-20260720';
const APP_SHELL=[
'./','./index.html','./style.css?v=5.7.16','./app.js?v=5.7.16',
'./manifest.webmanifest?v=5.7.12','./icon-192.png','./icon-512.png'
];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>
    Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))
  ).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const u=new URL(event.request.url);
  const code=u.pathname.endsWith('/app.js')||u.pathname.endsWith('/style.css')||
    u.pathname.endsWith('/index.html')||u.pathname.endsWith('/manifest.webmanifest')||
    u.pathname.endsWith('/');
  if(code){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(r=>{
      const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(event.request,copy)); return r;
    }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
  }else{
    event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request).then(net=>{
      const copy=net.clone(); caches.open(CACHE_NAME).then(c=>c.put(event.request,copy)); return net;
    })));
  }
});
