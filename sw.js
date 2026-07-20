const CACHE_NAME='grandpa-demon-v577-20260720';
const APP_SHELL=[
'./','./index.html','./style.css?v=5.7.7','./app.js?v=5.7.7',
'./vendor/jsQR.min.js?v=5.7.7','./manifest.webmanifest?v=5.7.7',
'./icon-192.png','./icon-512.png'
];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  const isCode=
    url.pathname.endsWith('/app.js')||
    url.pathname.endsWith('/style.css')||
    url.pathname.endsWith('/index.html')||
    url.pathname.endsWith('/manifest.webmanifest')||
    url.pathname.includes('/vendor/jsQR.min.js')||
    url.pathname.endsWith('/');

  if(isCode){
    event.respondWith(
      fetch(req,{cache:'no-store'})
        .then(res=>{
          const copy=res.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));
          return res;
        })
        .catch(()=>caches.match(req).then(r=>r||caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached=>cached||fetch(req).then(res=>{
      const copy=res.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));
      return res;
    }))
  );
});
