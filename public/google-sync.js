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
    return getToken(interactive).then(function() {
      return localArchive();
    }).then(function(a) {
      archive = a;
      localStamp = (a.data && a.data.lastModifiedAt) || '';
      return findRemote();
    }).then(function(r) {
      remote = r;
      var localChanged = !m.lastSyncAt || localStamp !== m.localStamp;
      var remoteChanged = !!remote && (!m.fileId || remote.modifiedTime !== m.remoteModifiedTime);

      if (!remote) {
        if (archiveIsEmpty(archive)) return finish('Nothing to sync yet — log something first.');
        return doUpload();
      }
      if (remoteChanged && localChanged) {
        // Never been synced on this device + empty local = plain first download.
        if (!m.lastSyncAt && archiveIsEmpty(archive)) return doDownload();
        if (!interactive) return 'Sync conflict — open Settings → Google Sync to resolve.';
        var msg = 'Both this device and the Drive copy have changes since the last sync.\n\n' +
          'Drive copy: last updated ' + new Date(remote.modifiedTime).toLocaleString() + '\n\n' +
          'Choose "Use Drive copy" to REPLACE this device\'s data with Drive, or Cancel to keep ' +
          'this device\'s data and overwrite the Drive copy with it.';
        return appConfirm(msg, 'Sync conflict', 'Use Drive copy').then(function(useDrive) {
          return useDrive ? doDownload() : doUpload();
        });
      }
      if (remoteChanged) return doDownload();
      if (localChanged) return doUpload();
      return finish('Already up to date.');
    });

    function doUpload() {
      return uploadRemote(remote && remote.id, JSON.stringify(archive)).then(function(f) {
        return finish('Uploaded to Google Drive.', f.id, f.modifiedTime, localStamp);
      });
    }
    function doDownload() {
      return downloadRemote(remote.id).then(importArchive).then(currentLocalStamp).then(function(stamp) {
        return finish('Downloaded latest from Google Drive.', remote.id, remote.modifiedTime, stamp);
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
  // (no popups). Skips quietly if Google can't mint a token without user
  // interaction; the Settings page surfaces any conflict.
  if (autoSyncReady()) {
    setTimeout(function() {
      syncNow(false).catch(function() { /* silent by design */ });
    }, 1500);
  }
})();
