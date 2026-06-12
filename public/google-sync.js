// Optional Google Drive sync. The standard export archive (same format as
// the manual backup file) is stored in the user's Drive appDataFolder — a
// hidden, app-private area that only this app's OAuth client can see. OAuth
// runs entirely in the browser via Google Identity Services; the short-lived
// access token is cached locally (see TOKEN_KEY) so syncs don't re-open the
// OAuth popup on every page load.
//
// Requires a Google OAuth Client ID (Web application). Either hardcode it in
// DEFAULT_CLIENT_ID below for your deployment, or paste it in
// Settings → Data Management → Google Sync (stored per-browser in localStorage).
(function() {
  'use strict';

  var DEFAULT_CLIENT_ID = '462623472338-k5r76knldtvror94mvcfv417j2q6d9o0.apps.googleusercontent.com';
  var SCOPE = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email';
  var SYNC_FILENAME = 'wildlife-mgmt-sync.json';
  var GSI_SRC = 'https://accounts.google.com/gsi/client';

  // Per-device sync bookkeeping (not secret): which Drive file revision and
  // local change stamp we last reconciled, and the connected account email.
  function meta() {
    try { return JSON.parse(localStorage.getItem('gsync-meta')) || {}; }
    catch (e) { return {}; }
  }
  function setMeta(m) { localStorage.setItem('gsync-meta', JSON.stringify(m)); }

  function clientId() {
    return localStorage.getItem('gsync-client-id') || DEFAULT_CLIENT_ID;
  }

  // ── Google Identity Services ──

  var gisLoading = null;
  function loadGis() {
    if (window.google && window.google.accounts) return Promise.resolve();
    if (gisLoading) return gisLoading;
    gisLoading = new Promise(function(resolve, reject) {
      var s = document.createElement('script');
      s.src = GSI_SRC;
      s.onload = function() { resolve(); };
      s.onerror = function() { gisLoading = null; reject(new Error('Could not load Google sign-in. Check your network and any content blockers.')); };
      document.head.appendChild(s);
    });
    return gisLoading;
  }

  var accessToken = null;
  var tokenExpires = 0;
  var tokenClient = null;

  // Tokens from the GIS token client live only in page memory, and
  // requestAccessToken() ALWAYS opens the OAuth popup — even when Google
  // needs no input from the user. Without caching, every page load's
  // auto-sync pops the OAuth window. Persisting the short-lived access
  // token across page loads means at most ~one popup per hour. Trade-off:
  // the token sits in localStorage, but it is scoped to this app's hidden
  // Drive folder + email only and expires within the hour.
  var TOKEN_KEY = 'gsync-token';

  function loadCachedToken() {
    try {
      var t = JSON.parse(localStorage.getItem(TOKEN_KEY));
      if (t && t.clientId === clientId() && Date.now() < t.expiresAt - 120000) return t;
    } catch (e) { /* fall through */ }
    return null;
  }

  function clearCachedToken() {
    accessToken = null;
    tokenExpires = 0;
    localStorage.removeItem(TOKEN_KEY);
  }

  // ── Last-synced base snapshot (for three-way merges) ──
  // Stored in the app's IndexedDB (same DB store.js uses) because the data
  // can exceed localStorage limits. The snapshot is tagged with the Drive
  // revision it reconciled, so it's only trusted as a merge ancestor when it
  // matches the revision this device last synced with.
  var BASE_KEY = 'gsync-base';

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

  function kvOp(mode, fn) {
    return openDb().then(function(db) {
      return new Promise(function(resolve, reject) {
        var tx = db.transaction('kv', mode);
        var req = fn(tx.objectStore('kv'));
        req.onsuccess = function() { resolve(req.result); };
        req.onerror = function() { reject(req.error); };
      });
    });
  }

  function fileNames(archive, group) {
    return Object.keys(((archive || {}).files || {})[group] || {});
  }

  function saveBase(archive, remoteModifiedTime) {
    return kvOp('readwrite', function(s) {
      return s.put({
        remoteModifiedTime: remoteModifiedTime,
        data: archive.data,
        fileKeys: {
          photos: fileNames(archive, 'photos'),
          'property-images': fileNames(archive, 'property-images')
        }
      }, BASE_KEY);
    }).catch(function() { /* best effort — merge falls back to the dialog */ });
  }

  function loadBase(expectedRemoteTime) {
    return kvOp('readonly', function(s) { return s.get(BASE_KEY); }).then(function(b) {
      return (b && expectedRemoteTime && b.remoteModifiedTime === expectedRemoteTime) ? b : null;
    }).catch(function() { return null; });
  }

  function clearBase() {
    return kvOp('readwrite', function(s) { return s.delete(BASE_KEY); }).catch(function() {});
  }

  // interactive=false must never show UI: it only succeeds when Google can
  // mint a token from an existing session + prior grant.
  function getToken(interactive) {
    if (accessToken && Date.now() < tokenExpires - 60000) return Promise.resolve(accessToken);
    var cached = loadCachedToken();
    if (cached) {
      accessToken = cached.token;
      tokenExpires = cached.expiresAt;
      return Promise.resolve(accessToken);
    }
    if (!clientId()) return Promise.reject(new Error('No Google Client ID configured.'));
    return loadGis().then(function() {
      return new Promise(function(resolve, reject) {
        if (!tokenClient) {
          tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId(),
            scope: SCOPE,
            callback: function() {},
            error_callback: function() {}
          });
        }
        tokenClient.callback = function(resp) {
          if (resp.error) { reject(new Error(resp.error_description || resp.error)); return; }
          accessToken = resp.access_token;
          tokenExpires = Date.now() + (parseInt(resp.expires_in, 10) || 3600) * 1000;
          try {
            localStorage.setItem(TOKEN_KEY, JSON.stringify({
              token: accessToken, expiresAt: tokenExpires, clientId: clientId()
            }));
          } catch (e) { /* private mode etc. — cache is best-effort */ }
          resolve(accessToken);
        };
        tokenClient.error_callback = function(err) {
          reject(new Error(err && err.message ? err.message : 'Google sign-in was cancelled or blocked.'));
        };
        tokenClient.requestAccessToken({ prompt: interactive ? '' : 'none' });
      });
    });
  }

  // ── Drive REST helpers ──

  function drive(path, opts) {
    opts = opts || {};
    opts.headers = opts.headers || {};
    opts.headers['Authorization'] = 'Bearer ' + accessToken;
    return fetch('https://www.googleapis.com' + path, opts).then(function(r) {
      if (r.status === 401) {
        clearCachedToken();
        throw new Error('Google session expired — sync again to reconnect.');
      }
      return r;
    });
  }

  function findRemote() {
    var q = encodeURIComponent("name = '" + SYNC_FILENAME + "'");
    return drive('/drive/v3/files?spaces=appDataFolder&q=' + q + '&fields=files(id,modifiedTime,size)')
      .then(function(r) { return r.json(); })
      .then(function(j) { return (j.files && j.files[0]) || null; });
  }

  function downloadRemote(id) {
    return drive('/drive/v3/files/' + id + '?alt=media').then(function(r) {
      if (!r.ok) throw new Error('Drive download failed (' + r.status + ').');
      return r.json();
    });
  }

  // Resumable upload: works for archives of any size (photos make these big).
  function uploadRemote(existingId, jsonString) {
    var initPath = existingId
      ? '/upload/drive/v3/files/' + existingId + '?uploadType=resumable&fields=id,modifiedTime'
      : '/upload/drive/v3/files?uploadType=resumable&fields=id,modifiedTime';
    var metadata = existingId ? {} : { name: SYNC_FILENAME, parents: ['appDataFolder'] };
    return drive(initPath, {
      method: existingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(metadata)
    }).then(function(r) {
      if (!r.ok) throw new Error('Drive upload could not start (' + r.status + ').');
      var session = r.headers.get('Location');
      return fetch(session, { method: 'PUT', body: jsonString });
    }).then(function(r) {
      if (!r.ok) throw new Error('Drive upload failed (' + r.status + ').');
      return r.json();
    });
  }

  function fetchEmail() {
    return drive('/oauth2/v3/userinfo').then(function(r) { return r.json(); })
      .then(function(j) { return j.email || ''; })
      .catch(function() { return ''; });
  }

  // ── Sync activity indicator (bottom-left pill, all pages) ──

  var indicatorEl = null;
  var indicatorTimer = null;
  function indicator(state, text) {
    if (!document.body) return;
    if (!indicatorEl) {
      var style = document.createElement('style');
      style.textContent =
        '.gsync-pill{position:fixed;left:14px;bottom:14px;z-index:96;display:none;' +
          'align-items:center;gap:8px;background:#1a4a1a;color:white;border-radius:18px;' +
          'padding:7px 14px;font-family:Arial,sans-serif;font-size:0.8rem;font-weight:600;' +
          'box-shadow:0 3px 10px rgba(0,0,0,0.3);cursor:default}' +
        '.gsync-pill.show{display:flex}' +
        '.gsync-pill.error{background:#8b1a1a;cursor:pointer}' +
        '.gsync-spinner{width:13px;height:13px;border:2px solid rgba(255,255,255,0.35);' +
          'border-top-color:white;border-radius:50%;animation:gsyncSpin 0.8s linear infinite;flex-shrink:0}' +
        '@keyframes gsyncSpin{to{transform:rotate(360deg)}}' +
        '@media print{.gsync-pill{display:none !important}}';
      document.head.appendChild(style);
      indicatorEl = document.createElement('div');
      indicatorEl.className = 'gsync-pill';
      indicatorEl.setAttribute('role', 'status');
      indicatorEl.addEventListener('click', function() {
        if (indicatorEl.classList.contains('error')) location.href = '/settings';
      });
      document.body.appendChild(indicatorEl);
    }
    clearTimeout(indicatorTimer);
    if (!state) { indicatorEl.classList.remove('show'); return; }
    indicatorEl.classList.toggle('error', state === 'error');
    indicatorEl.innerHTML = (state === 'syncing' ? '<span class="gsync-spinner"></span>' : '') + esc(text);
    indicatorEl.title = state === 'error' ? text + ' — tap to open Settings' : text;
    indicatorEl.classList.add('show');
    if (state !== 'syncing') {
      indicatorTimer = setTimeout(function() { indicatorEl.classList.remove('show'); },
        state === 'error' ? 8000 : 2500);
    }
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── Conflict diff ──
  // Human summary of how the two archives differ, so the conflict dialog can
  // say what would actually be gained or lost by each choice.
  function diffArchives(localA, remoteA) {
    var L = (localA && localA.data) || {};
    var R = (remoteA && remoteA.data) || {};
    var device = [], drive = [], both = [];

    function byId(list) {
      var m = {};
      (list || []).forEach(function(x) { if (x && x.id != null) m[x.id] = x; });
      return m;
    }
    function phrase(n, one, many, items, labelFn) {
      var s = n + ' ' + (n === 1 ? one : many);
      if (labelFn && n && n <= 2) s += ' \u2014 ' + items.map(labelFn).join(', ');
      return s;
    }
    function compare(lList, rList, one, many, labelFn) {
      var lm = byId(lList), rm = byId(rList);
      var lOnly = [], rOnly = [], edited = 0;
      Object.keys(lm).forEach(function(id) {
        if (!rm[id]) lOnly.push(lm[id]);
        else if (JSON.stringify(lm[id]) !== JSON.stringify(rm[id])) edited++;
      });
      Object.keys(rm).forEach(function(id) { if (!lm[id]) rOnly.push(rm[id]); });
      if (lOnly.length) device.push(phrase(lOnly.length, one, many, lOnly, labelFn));
      if (rOnly.length) drive.push(phrase(rOnly.length, one, many, rOnly, labelFn));
      if (edited) both.push(phrase(edited, one, many, [], null));
    }
    function entryLabel(e) {
      var name = (e && (e.name || e.type)) || 'entry';
      var d = e && e.datetime ? String(e.datetime).slice(0, 10) : '';
      return '\u201c' + name + '\u201d' + (d ? ' (' + d + ')' : '');
    }
    function nameLabel(x) { return '\u201c' + ((x && x.name) || 'unnamed') + '\u201d'; }

    compare(L.log, R.log, 'activity log entry', 'activity log entries', entryLabel);
    compare(L.bucks, R.bucks, 'buck', 'bucks', nameLabel);
    compare(L.routes, R.routes, 'census route', 'census routes', nameLabel);
    compare(L.propertyImages, R.propertyImages, 'property image', 'property images', null);

    var lr = L.reports || {}, rr = R.reports || {};
    Object.keys(lr).forEach(function(y) {
      if (!rr[y]) device.push('the ' + y + ' annual report');
      else if (JSON.stringify(lr[y]) !== JSON.stringify(rr[y])) both.push('the ' + y + ' annual report');
    });
    Object.keys(rr).forEach(function(y) { if (!lr[y]) drive.push('the ' + y + ' annual report'); });

    if ((L.planUpdatedAt || '') !== (R.planUpdatedAt || '')) {
      if ((L.planUpdatedAt || '') > (R.planUpdatedAt || '')) device.push('management plan edits');
      else drive.push('management plan edits');
    }

    return { device: device, drive: drive, both: both };
  }

  // ── Three-way merge ──
  // Merges local and Drive changes against the last-synced base snapshot.
  // Independent changes (different plan/report fields, different records,
  // different fields of the same record, additions on both sides) merge
  // cleanly; only a field changed differently on both sides — or an edit
  // colliding with a delete — is a conflict.
  var DATA_COLLECTIONS = ['log', 'bucks', 'routes', 'propertyImages'];
  var DATA_SPECIAL = { log: 1, bucks: 1, routes: 1, propertyImages: 1, reports: 1, reportsMeta: 1, lastModifiedAt: 1, planUpdatedAt: 1 };

  function mergeArchives(base, localA, remoteA) {
    var j = JSON.stringify;
    var B = base.data || {};
    var L = (localA && localA.data) || {};
    var R = (remoteA && remoteA.data) || {};
    var merged = {};
    var conflicts = [];

    function mergeValue(label, b, l, r) {
      if (j(l) === j(r)) return l;
      if (j(l) !== j(b) && j(r) === j(b)) return l;
      if (j(r) !== j(b) && j(l) === j(b)) return r;
      conflicts.push(label);
      return l;
    }

    function mergeRecord(labelPrefix, b, l, r) {
      var out = {};
      var keys = {};
      [b, l, r].forEach(function(o) { Object.keys(o || {}).forEach(function(k) { keys[k] = 1; }); });
      Object.keys(keys).forEach(function(k) {
        var v = mergeValue(labelPrefix + ' \u2014 field \u201c' + k + '\u201d',
          b ? b[k] : undefined, l ? l[k] : undefined, r ? r[k] : undefined);
        if (v !== undefined) out[k] = v;
      });
      return out;
    }

    function recLabel(rec, kind) {
      var name = (rec && (rec.name || rec.type)) || 'record';
      return kind + ' \u201c' + name + '\u201d';
    }

    function byId(list) {
      var m = {};
      (list || []).forEach(function(x) { if (x && x.id != null) m[x.id] = x; });
      return m;
    }

    DATA_COLLECTIONS.forEach(function(name) {
      var kind = { log: 'log entry', bucks: 'buck', routes: 'route', propertyImages: 'property image' }[name];
      var bm = byId(B[name]), lm = byId(L[name]), rm = byId(R[name]);
      var seen = {};
      var out = [];
      function visit(id) {
        if (seen[id]) return;
        seen[id] = 1;
        var b = bm[id], l = lm[id], r = rm[id];
        if (l && r) {
          if (j(l) === j(r)) out.push(l);
          else if (!b) { conflicts.push(recLabel(l, kind) + ' added differently on both devices'); out.push(l); }
          else out.push(mergeRecord(recLabel(l, kind), b, l, r));
        } else if (l) {
          if (!b) out.push(l); // added locally
          else if (j(l) !== j(b)) { conflicts.push(recLabel(l, kind) + ' edited here but deleted in the Drive copy'); out.push(l); }
          // unchanged + gone remotely = deleted there; drop
        } else if (r) {
          if (!b) out.push(r); // added remotely
          else if (j(r) !== j(b)) { conflicts.push(recLabel(r, kind) + ' edited in the Drive copy but deleted here'); out.push(r); }
        }
      }
      (L[name] || []).forEach(function(x) { if (x && x.id != null) visit(x.id); });
      (R[name] || []).forEach(function(x) { if (x && x.id != null) visit(x.id); });
      (B[name] || []).forEach(function(x) { if (x && x.id != null) visit(x.id); });
      merged[name] = out;
    });

    // Annual reports, keyed by year, merged per-field within a year
    var br = B.reports || {}, lr = L.reports || {}, rr = R.reports || {};
    var years = {};
    [br, lr, rr].forEach(function(o) { Object.keys(o).forEach(function(y) { years[y] = 1; }); });
    merged.reports = {};
    merged.reportsMeta = {};
    Object.keys(years).forEach(function(y) {
      var b = br[y], l = lr[y], r = rr[y];
      var label = 'the ' + y + ' annual report';
      var keep;
      if (l && r) keep = (j(l) === j(r)) ? l : (!b ? (conflicts.push(label + ' created differently on both devices'), l) : mergeRecord(label, b, l, r));
      else if (l) {
        if (!b) keep = l;
        else if (j(l) !== j(b)) { conflicts.push(label + ' edited here but deleted in the Drive copy'); keep = l; }
      } else if (r) {
        if (!b) keep = r;
        else if (j(r) !== j(b)) { conflicts.push(label + ' edited in the Drive copy but deleted here'); keep = r; }
      }
      if (keep !== undefined) {
        merged.reports[y] = keep;
        var lm2 = (L.reportsMeta || {})[y], rm2 = (R.reportsMeta || {})[y];
        merged.reportsMeta[y] = ((lm2 && lm2.updatedAt) || '') >= ((rm2 && rm2.updatedAt) || '') ? (lm2 || rm2 || {}) : rm2;
      }
    });

    // Plan + other root-level fields, three-way per field
    var rootKeys = {};
    [B, L, R].forEach(function(o) { Object.keys(o).forEach(function(k) { if (!DATA_SPECIAL[k]) rootKeys[k] = 1; }); });
    Object.keys(rootKeys).forEach(function(k) {
      var v = mergeValue('plan field \u201c' + k + '\u201d', B[k], L[k], R[k]);
      if (v !== undefined) merged[k] = v;
    });
    merged.planUpdatedAt = ((L.planUpdatedAt || '') >= (R.planUpdatedAt || '')) ? L.planUpdatedAt : R.planUpdatedAt;

    // Files: union of both sides; a file present in the base but missing
    // from one side was deleted there (file contents are never edited
    // in place, so there are no per-file conflicts)
    function mergeFiles(group) {
      var baseNames = {};
      ((base.fileKeys || {})[group] || []).forEach(function(n) { baseNames[n] = 1; });
      var lf = ((localA || {}).files || {})[group] || {};
      var rf = ((remoteA || {}).files || {})[group] || {};
      var out = {};
      Object.keys(lf).forEach(function(n) {
        if (rf[n] !== undefined || !baseNames[n]) out[n] = lf[n];
      });
      Object.keys(rf).forEach(function(n) {
        if (out[n] === undefined && lf[n] === undefined && !baseNames[n]) out[n] = rf[n];
      });
      return out;
    }

    return {
      conflicts: conflicts,
      archive: {
        format: localA.format,
        version: localA.version,
        exportedAt: new Date().toISOString(),
        data: merged,
        files: { photos: mergeFiles('photos'), 'property-images': mergeFiles('property-images') }
      }
    };
  }

  // ── Conflict dialog ──
  // Self-contained (dialog.js isn't loaded on every page). Resolves to
  // 'drive' (replace this device with the Drive copy), 'local' (overwrite
  // the Drive copy with this device), or null (decide later).
  var conflictStyleAdded = false;
  function showConflictDialog(remote, localStamp, diff, conflicts) {
    if (!conflictStyleAdded) {
      conflictStyleAdded = true;
      var style = document.createElement('style');
      style.textContent =
        '.gsync-conflict-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:1001;' +
          'display:flex;align-items:center;justify-content:center}' +
        '.gsync-conflict{background:white;border-radius:10px;padding:22px 26px;width:540px;' +
          'max-width:calc(100vw - 40px);max-height:88vh;overflow-y:auto;' +
          'box-shadow:0 8px 32px rgba(0,0,0,0.25);font-family:Arial,sans-serif;' +
          'animation:gsyncConflictIn 0.18s ease}' +
        '@keyframes gsyncConflictIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:none}}' +
        '.gsync-conflict h3{color:#8b5a1a;font-size:1.05rem;margin:0 0 10px}' +
        '.gsync-conflict p{font-size:0.88rem;color:#444;line-height:1.55;margin:0 0 10px}' +
        '.gsync-conflict-times{font-size:0.84rem;color:#555;background:#f7f5ef;border:1px solid #e5dfc9;' +
          'border-radius:6px;padding:9px 12px;margin:0 0 12px;line-height:1.7}' +
        '.gsync-conflict-diff{font-size:0.84rem;color:#444;background:#fbfbf6;border:1px solid #e5dfc9;' +
          'border-radius:6px;padding:9px 12px;margin:0 0 12px;line-height:1.6}' +
        '.gsync-conflict-diff .gc-diff-title{font-size:0.74rem;font-weight:700;color:#8b5a1a;' +
          'text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px}' +
        '.gsync-conflict-diff div+div{margin-top:3px}' +
        '.gsync-conflict-tip{font-size:0.82rem;color:#555;background:#f0f7f0;border-left:3px solid #5a9a5a;' +
          'padding:7px 10px;border-radius:0 4px 4px 0;margin:0 0 14px;line-height:1.5}' +
        '.gsync-conflict-actions{display:flex;flex-direction:column;gap:8px}' +
        '.gsync-conflict-actions button{border:none;border-radius:6px;padding:11px 16px;font-size:0.9rem;' +
          'font-weight:600;cursor:pointer;text-align:left;font-family:Arial,sans-serif}' +
        '.gsync-conflict-actions .gc-drive{background:#1a4a1a;color:white}' +
        '.gsync-conflict-actions .gc-drive:hover{background:#256325}' +
        '.gsync-conflict-actions .gc-local{background:#e8f0e8;color:#1a4a1a}' +
        '.gsync-conflict-actions .gc-local:hover{background:#d0e4d0}' +
        '.gsync-conflict-actions .gc-later{background:#f0f0f0;color:#555}' +
        '.gsync-conflict-actions .gc-later:hover{background:#e2e2e2}' +
        '.gsync-conflict-actions small{display:block;font-weight:400;font-size:0.76rem;opacity:0.85;margin-top:2px}' +
        '@media print{.gsync-conflict-overlay{display:none !important}}';
      document.head.appendChild(style);
    }
    return new Promise(function(resolve) {
      function fmt(iso) {
        var d = iso ? new Date(iso) : null;
        return (d && !isNaN(d)) ? d.toLocaleString() : 'unknown';
      }
      function diffGroup(title, items) {
        if (!items || !items.length) return '';
        return '<div><strong>' + title + ':</strong> ' + items.map(esc).join('; ') + '</div>';
      }
      var diffHtml;
      if (!diff) {
        diffHtml = '<div>The contents of the two copies could not be compared.</div>';
      } else {
        diffHtml = diffGroup('Only on this device', diff.device) +
          diffGroup('Only in the Drive copy', diff.drive) +
          diffGroup('Edited differently in each copy', diff.both);
        if (!diffHtml) diffHtml = '<div>The copies differ only in minor details (timestamps or settings).</div>';
      }
      if (conflicts && conflicts.length) {
        var shown = conflicts.slice(0, 8);
        if (conflicts.length > 8) shown.push('\u2026 and ' + (conflicts.length - 8) + ' more');
        diffHtml += diffGroup('Conflicting edits (same thing changed on both)', shown);
        diffHtml = '<div style="margin-bottom:6px">Everything that could be merged automatically was \u2014 only these clashes need a decision:</div>' + diffHtml;
      }
      var overlay = document.createElement('div');
      overlay.className = 'gsync-conflict-overlay';
      overlay.innerHTML =
        '<div class="gsync-conflict" role="dialog" aria-modal="true" aria-label="Sync conflict">' +
          '<h3>&#9888;&#65039; Sync conflict</h3>' +
          '<p>This device and your Google Drive backup <strong>both have changes</strong> since they ' +
          'last synced. This usually happens after editing on two devices (or two browsers) without ' +
          'syncing in between.</p>' +
          '<div class="gsync-conflict-times">' +
            'Drive copy last updated: <strong>' + esc(fmt(remote && remote.modifiedTime)) + '</strong><br>' +
            'This device last edited: <strong>' + esc(fmt(localStamp)) + '</strong>' +
          '</div>' +
          '<div class="gsync-conflict-diff"><div class="gc-diff-title">What\u2019s different</div>' + diffHtml + '</div>' +
          '<p>Choose which version to keep &mdash; the other will be overwritten:</p>' +
          '<div class="gsync-conflict-actions">' +
            '<button class="gc-drive">Use the Drive copy' +
              '<small>Replaces everything on this device with the Google Drive backup.</small></button>' +
            '<button class="gc-local">Keep this device' +
              '<small>Overwrites the Google Drive backup with this device\u2019s data.</small></button>' +
            '<button class="gc-later">Decide later' +
              '<small>Do nothing for now. Syncing stays paused until you choose.</small></button>' +
          '</div>' +
          '<div class="gsync-conflict-tip" style="margin-top:14px;margin-bottom:0">' +
            '<strong>Not sure?</strong> Choose &ldquo;Decide later&rdquo;, save a backup of this device first ' +
            '(Settings &rarr; Data Management &rarr; Export All Data), then sync again &mdash; with a backup ' +
            'file saved, either choice is safe.' +
          '</div>' +
        '</div>';
      function close(result) {
        document.removeEventListener('keydown', onKey);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        resolve(result);
      }
      function onKey(ev) {
        if (ev.key === 'Escape') { ev.preventDefault(); close(null); }
      }
      overlay.addEventListener('click', function(ev) { if (ev.target === overlay) close(null); });
      overlay.querySelector('.gc-drive').addEventListener('click', function() { close('drive'); });
      overlay.querySelector('.gc-local').addEventListener('click', function() { close('local'); });
      overlay.querySelector('.gc-later').addEventListener('click', function() { close(null); });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(overlay);
      overlay.querySelector('.gc-later').focus();
    });
  }

  // ── Sync logic ──

  function localArchive() {
    return fetch('/api/export').then(function(r) { return r.json(); });
  }

  function archiveIsEmpty(a) {
    var d = (a && a.data) || {};
    return !(d.log || []).length && !Object.keys(d.reports || {}).length &&
      !(d.propertyImages || []).length && !d.planUpdatedAt;
  }

  function importArchive(archive) {
    return fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archive: archive, mode: 'replace' })
    }).then(function(r) { return r.json(); }).then(function(j) {
      if (j.error) throw new Error(j.error);
    });
  }

  function currentLocalStamp() {
    return fetch('/api/data').then(function(r) { return r.json(); })
      .then(function(d) { return d.lastModifiedAt || ''; });
  }

  var syncing = false;

  // Public entry: wraps the sync with the activity indicator. Silent-mode
  // failures (e.g. Google can't mint a token without user interaction) hide
  // the indicator instead of flashing an error on every page load.
  function syncNow(interactive) {
    if (syncing) return Promise.resolve('Sync already in progress.');
    syncing = true;
    return getToken(interactive).then(function() {
      indicator('syncing', 'Syncing\u2026');
      return performSync(interactive);
    }).then(function(status) {
      syncing = false;
      if (/conflict/i.test(status)) indicator('error', 'Sync conflict');
      else indicator('ok', '\u2713 ' + (/up to date/i.test(status) ? 'Up to date' : 'Synced'));
      return status;
    }, function(err) {
      syncing = false;
      if (interactive) indicator('error', 'Sync failed');
      else indicator(null);
      throw err;
    });
  }

  // Resolves to a short status string. interactive=true may show Google
  // popups and conflict dialogs; false (auto-sync) never shows UI and defers
  // conflicts to the Settings page.
  function performSync(interactive) {
    var m = meta();
    var localStamp, archive, remote;

    // Archives are expensive — the local one base64s every photo into a
    // single JSON blob, the remote one is a full Drive download — so the
    // cheap change stamps decide first and an archive is only materialized
    // on the branches that actually need it. An up-to-date check builds and
    // downloads nothing; the Drive copy is only fetched pre-decision when a
    // real conflict needs the what's-different diff.
    function withLocalArchive(fn) {
      return localArchive().then(function(a) { archive = a; return fn(a); });
    }

    return getToken(interactive).then(function() {
      return currentLocalStamp();
    }).then(function(stamp) {
      localStamp = stamp;
      return findRemote();
    }).then(function(r) {
      remote = r;
      var localChanged = !m.lastSyncAt || localStamp !== m.localStamp;
      var remoteChanged = !!remote && (!m.fileId || remote.modifiedTime !== m.remoteModifiedTime);

      if (!remote) {
        return withLocalArchive(function(a) {
          if (archiveIsEmpty(a)) return finish('Nothing to sync yet — log something first.');
          return doUpload();
        });
      }
      if (remoteChanged && localChanged) {
        return withLocalArchive(function(a) {
          // Never been synced on this device + empty local = plain first download.
          if (!m.lastSyncAt && archiveIsEmpty(a)) return doDownload();
          function askUser(remoteArchive, conflicts) {
            var diff = null;
            if (remoteArchive) {
              try { diff = diffArchives(a, remoteArchive); } catch (e) { /* shown as not-comparable */ }
            }
            return showConflictDialog(remote, localStamp, diff, conflicts).then(function(choice) {
              if (choice === 'drive') return remoteArchive ? doImport(remoteArchive) : doDownload();
              if (choice === 'local') return doUpload();
              return 'Sync conflict — not resolved yet. Sync again when ready to choose.';
            });
          }
          return downloadRemote(remote.id).then(function(remoteArchive) {
            // Three-way merge against the last-synced snapshot: independent
            // changes from both devices combine without bothering the user.
            return loadBase(m.remoteModifiedTime).then(function(base) {
              var mergeResult = null;
              if (base) {
                try { mergeResult = mergeArchives(base, a, remoteArchive); } catch (e) { mergeResult = null; }
              }
              if (mergeResult && !mergeResult.conflicts.length) return doMerge(mergeResult.archive);
              return askUser(remoteArchive, mergeResult ? mergeResult.conflicts : null);
            });
          }, function() {
            return askUser(null, null);
          });
        });
      }
      if (remoteChanged) return doDownload();
      if (localChanged) return withLocalArchive(function() { return doUpload(); });
      return finish('Already up to date.');
    });

    function doUpload() {
      return uploadRemote(remote && remote.id, JSON.stringify(archive)).then(function(f) {
        return saveBase(archive, f.modifiedTime).then(function() {
          return finish('Uploaded to Google Drive.', f.id, f.modifiedTime, localStamp);
        });
      });
    }
    function doDownload() {
      return downloadRemote(remote.id).then(doImport);
    }
    function doImport(remoteArchive) {
      return importArchive(remoteArchive).then(currentLocalStamp).then(function(stamp) {
        return saveBase(remoteArchive, remote.modifiedTime).then(function() {
          // The page rendered from the pre-import data; refresh to show what
          // was just downloaded.
          setTimeout(function() { location.reload(); }, 700);
          return finish('Downloaded latest from Google Drive.', remote.id, remote.modifiedTime, stamp);
        });
      });
    }
    function doMerge(mergedArchive) {
      // Converge both sides on the merged result: import it here, upload it
      // to Drive, and make it the new base snapshot.
      return importArchive(mergedArchive).then(function() {
        return uploadRemote(remote.id, JSON.stringify(mergedArchive));
      }).then(function(f) {
        return currentLocalStamp().then(function(stamp) {
          return saveBase(mergedArchive, f.modifiedTime).then(function() {
            setTimeout(function() { location.reload(); }, 700);
            return finish('Merged changes from both devices.', f.id, f.modifiedTime, stamp);
          });
        });
      });
    }
    function finish(status, fileId, remoteTime, stamp) {
      var nm = meta();
      if (fileId) {
        nm.fileId = fileId;
        nm.remoteModifiedTime = remoteTime;
        nm.localStamp = stamp;
      } else {
        nm.localStamp = localStamp;
      }
      nm.lastSyncAt = new Date().toISOString();
      nm.lastStatus = status;
      setMeta(nm);
      if (!nm.email) {
        return fetchEmail().then(function(em) {
          if (em) { nm.email = em; setMeta(nm); }
          return status;
        });
      }
      return status;
    }
  }

  function disconnect() {
    var done = function() {
      clearCachedToken();
      localStorage.removeItem('gsync-meta');
      localStorage.removeItem('gsync-auto');
      clearBase();
    };
    if (accessToken && window.google && google.accounts) {
      return new Promise(function(resolve) {
        google.accounts.oauth2.revoke(accessToken, function() { done(); resolve(); });
      });
    }
    done();
    return Promise.resolve();
  }

  window.gsync = {
    isConfigured: function() { return !!clientId(); },
    clientId: clientId,
    setClientId: function(id) {
      id = String(id || '').trim();
      if (id) localStorage.setItem('gsync-client-id', id);
      else localStorage.removeItem('gsync-client-id');
      tokenClient = null;
      clearCachedToken();
    },
    meta: meta,
    syncNow: syncNow,
    disconnect: disconnect,
    _indicator: indicator,
    _conflictDialog: showConflictDialog,
    _diffArchives: diffArchives,
    _mergeArchives: mergeArchives,
    autoEnabled: function() { return localStorage.getItem('gsync-auto') === '1'; },
    setAuto: function(on) {
      if (on) localStorage.setItem('gsync-auto', '1');
      else localStorage.removeItem('gsync-auto');
    }
  };

  function autoSyncReady() {
    return window.gsync.autoEnabled() && clientId() && meta().lastSyncAt;
  }

  // Debounced auto-sync: every data write (saveData in store.js) emits
  // 'wm-data-changed'; sync fires 5 seconds after the last change settles.
  // Writes performed by the sync itself (download + import) are ignored.
  var DEBOUNCE_MS = 5000;
  var debounceTimer = null;
  window.addEventListener('wm-data-changed', function() {
    if (syncing || !autoSyncReady()) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      syncNow(false).catch(function() { /* silent by design */ });
    }, DEBOUNCE_MS);
  });

  // Auto-sync on open: pulls remote changes when the app starts, silently
  // (no popups). Every in-app navigation is a fresh page load, so without a
  // staleness threshold this would sync on every page change — only sync if
  // the last one is older than ON_OPEN_MIN_AGE_MS. (Local edits are still
  // pushed promptly by the debounced change sync above.)
  var ON_OPEN_MIN_AGE_MS = 5 * 60 * 1000;
  if (autoSyncReady()) {
    var last = Date.parse(meta().lastSyncAt) || 0;
    if (Date.now() - last > ON_OPEN_MIN_AGE_MS) {
      setTimeout(function() {
        syncNow(false).catch(function() { /* silent by design */ });
      }, 1500);
    }
  }
})();
