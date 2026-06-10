// Service worker: serves /photos/* and /property-images/* from the same
// IndexedDB the app writes to (store.js), so <img> tags work without any
// files on disk. Everything else passes through to the network.

self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(ev) { ev.waitUntil(self.clients.claim()); });

function openDb() {
  return new Promise(function(resolve, reject) {
    var req = indexedDB.open('wildlife-mgmt', 1);
    req.onupgradeneeded = function() {
      var db = req.result;
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
    };
    req.onsuccess = function() { resolve(req.result); };
    req.onerror = function() { reject(req.error); };
  });
}

function getFile(path) {
  return openDb().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction('files', 'readonly');
      var req = tx.objectStore('files').get(path);
      req.onsuccess = function() { resolve(req.result); };
      req.onerror = function() { reject(req.error); };
    });
  });
}

function b64ToBytes(b64) {
  var bin = atob(b64);
  var bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

self.addEventListener('fetch', function(ev) {
  var url = new URL(ev.request.url);
  if (url.origin !== self.location.origin) return;
  if (ev.request.method !== 'GET') return;
  if (url.pathname.indexOf('/photos/') !== 0 && url.pathname.indexOf('/property-images/') !== 0) return;

  ev.respondWith(
    getFile(decodeURIComponent(url.pathname)).then(function(rec) {
      if (!rec) return new Response('Not found', { status: 404 });
      return new Response(b64ToBytes(rec.b64), {
        status: 200,
        headers: { 'Content-Type': rec.mime || 'image/jpeg' }
      });
    }).catch(function() {
      return new Response('Storage error', { status: 500 });
    })
  );
});
