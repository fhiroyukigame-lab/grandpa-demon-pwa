const CACHE_VERSION = 'grandpa-demon-v5.6.6';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const MEDIA_CACHE = `${CACHE_VERSION}-media`;
const APP_SHELL = ['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(STATIC_CACHE).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==STATIC_CACHE&&k!==MEDIA_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const r=event.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==self.location.origin)return;if(r.mode==='navigate'){event.respondWith(fetch(r).then(res=>{const copy=res.clone();caches.open(STATIC_CACHE).then(c=>c.put('./index.html',copy));return res}).catch(()=>caches.match('./index.html')));return;}const isMedia=/\.(mp3|m4a|wav|ogg)$/i.test(u.pathname);if(isMedia){event.respondWith(caches.open(MEDIA_CACHE).then(async c=>{const hit=await c.match(r);if(hit)return hit;const res=await fetch(r);if(res&&res.ok)c.put(r,res.clone());return res}));return;}event.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res&&res.ok)caches.open(STATIC_CACHE).then(c=>c.put(r,res.clone()));return res})));});
