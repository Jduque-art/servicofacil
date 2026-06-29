var CACHE_NAME = 'servicofacil-v3';
var urlsToCache = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(function(resp){
        var clone = resp.clone();
        caches.open(CACHE_NAME).then(function(c){ c.put(e.request, clone); });
        return resp;
      })
      .catch(function(){
        return caches.match(e.request);
      })
  );
});
