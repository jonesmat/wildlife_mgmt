// Optional Google Drive sync. The standard export archive (same format as
// the manual backup file) is stored in the user's Drive appDataFolder — a
// hidden, app-private area that only this app's OAuth client can see. OAuth
// runs entirely in the browser via Google Identity Services; there is no
// server and no tokens are stored (Google re-issues them per session).
//
// Requires a Google OAuth Client ID (Web application). Either hardcode it in
// DEFAULT_CLIENT_ID below for your deployment, or paste it in
// Settings → Google Sync (stored per-browser in localStorage).
(function() {
  'use strict';

  var DEFAULT_CLIENT_ID = '';
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

  // interactive=false must never show UI: it only succeeds when Google can
  // mint a token from an existing session + prior grant.
  function getToken(interactive) {
    if (accessToken && Date.now() < tokenExpires - 60000) return Promise.resolve(accessToken);
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
      if (r.status === 401) throw new Error('Google session expired — sync again to reconnect.');
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

  // Resolves to a short status string. interactive=true may show Google
  // popups and conflict dialogs; false (auto-sync) never shows UI and defers
  // conflicts to the Settings page.
  function syncNow(interactive) {
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
      accessToken = null;
      tokenExpires = 0;
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
      accessToken = null;
    },
    meta: meta,
    syncNow: syncNow,
    disconnect: disconnect,
    autoEnabled: function() { return localStorage.getItem('gsync-auto') === '1'; },
    setAuto: function(on) {
      if (on) localStorage.setItem('gsync-auto', '1');
      else localStorage.removeItem('gsync-auto');
    }
  };

  // Auto-sync: runs once per page load on pages that include this script,
  // silently (no popups). Skips quietly if Google can't mint a token without
  // user interaction; the Settings page surfaces any conflict.
  if (window.gsync.autoEnabled() && clientId() && meta().lastSyncAt) {
    setTimeout(function() {
      syncNow(false).catch(function() { /* silent by design */ });
    }, 1500);
  }
})();
