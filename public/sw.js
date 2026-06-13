// Service worker. Two jobs:
//   1. Serve /photos/* and /property-images/* from the same IndexedDB the app
//      writes to (store.js), so <img> tags work without files on disk.
//   2. Make the app work offline: precache the app shell on install and serve
//      pages/assets network-first (fresh when online, cached when offline).
//
// App data isn't cached here — store.js patches window.fetch so every /api/*
// call is served from IndexedDB in the page and never hits the network, and
// the optional Google Drive sync (/oauth/* and *.googleapis.com) is always
// network-only.

var CACHE = 'wm-shell-v4';

// Core shell precached on install so the app opens offline even on a page the
// user hasn't visited yet. Parameterized routes (/report/:year, /yearbook/:year)
// are cached on first visit instead.
var SHELL = [
  '/', '/activity', '/plan', '/reports', '/settings', '/bucks', '/assets',
  '/map', '/trends', '/privacy', '/terms', '/plan-print',
  '/theme.js', '/store.js', '/dialog.js', '/google-sync.js', '/spa.js',
  '/photo-source.js', '/help.js', '/welcome.js', '/version.js', '/activities-form.js',
  '/print-helpers.js', '/form-shared.css', '/print-shared.css', '/mobile.css',
  '/favicon.svg'
];

self.addEventListener('install', function(ev) {
  self.skipWaiting();
  ev.waitUntil(
    caches.open(CACHE).then(function(cache) {
      // Cache each entry independently so one missing/renamed file can't abort
      // the whole precache.
      return Promise.all(SHELL.map(function(u) {
        return cache.add(new Request(u, { cache: 'reload' })).catch(function() {});
      }));
    })
  );
});

self.addEventListener('activate', function(ev) {
  ev.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function() { return self.clients.claim(); })
  );
});

// ── IndexedDB image serving ──

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

var SAFE_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/bmp'];

function b64ToBytes(b64) {
  var bin = atob(b64);
  var bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function serveImage(pathname) {
  return getFile(decodeURIComponent(pathname)).then(function(rec) {
    if (!rec) return new Response('Not found', { status: 404 });
    // Only ever serve these records as raster images. The stored mime is data
    // (it round-trips through backup files), so an imported backup must not be
    // able to plant text/html or image/svg+xml here and have it execute as a
    // same-origin document.
    var mime = SAFE_IMAGE_MIMES.indexOf(rec.mime) !== -1 ? rec.mime : 'image/jpeg';
    return new Response(b64ToBytes(rec.b64), {
      status: 200,
      headers: {
        'Content-Type': mime,
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
        'Cross-Origin-Resource-Policy': 'same-origin'
      }
    });
  }).catch(function() {
    return new Response('Storage error', { status: 500 });
  });
}

// ── App shell: network-first with cache fallback ──

function networkFirst(request) {
  return fetch(request).then(function(resp) {
    // Cache successful same-origin responses for offline use.
    if (resp && resp.ok && resp.type === 'basic') {
      var copy = resp.clone();
      caches.open(CACHE).then(function(c) { c.put(request, copy); }).catch(function() {});
    }
    return resp;
  }).catch(function() {
    return caches.match(request).then(function(cached) {
      if (cached) return cached;
      // Offline and never cached: for a page navigation, fall back to the home
      // shell so the app still boots; otherwise report offline.
      if (request.mode === 'navigate') return caches.match('/');
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    });
  });
}

self.addEventListener('fetch', function(ev) {
  var req = ev.request;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Google etc. — untouched
  if (req.method !== 'GET') return;

  if (url.pathname.indexOf('/photos/') === 0 || url.pathname.indexOf('/property-images/') === 0) {
    ev.respondWith(serveImage(url.pathname));
    return;
  }
  // Local API (served in-page by store.js, never actually reaches here) and the
  // sync backend must always be live — never cache them.
  if (url.pathname.indexOf('/api/') === 0 || url.pathname.indexOf('/oauth/') === 0) return;

  ev.respondWith(networkFirst(req));
});
