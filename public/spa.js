// Lightweight client-side router — turns the multi-page app into a SPA by
// soft-navigating between the existing pages instead of doing a full reload.
//
// Progressive enhancement: it only upgrades same-origin <a> link clicks (and
// the browser Back/Forward buttons). Anything it can't or shouldn't handle —
// or any failure mid-navigation — falls back to a normal full-page load, so
// the worst case is exactly today's behavior.
//
// How a soft navigation works:
//   1. fetch the target page's HTML
//   2. swap in its <body> content and its page-specific <head> bits (title +
//      <style>/<link>), leaving the shared library scripts (store.js,
//      google-sync.js, …) loaded once in the realm
//   3. re-execute the new page's own scripts so it initializes as usual
//
// The shared scripts must already be loaded for this to be seamless, so spa.js
// is included on every app page after them. Print and legal pages don't
// include it and are reached with a normal load.
(function() {
  'use strict';
  if (window.__spaRouter) return;
  window.__spaRouter = true;

  // Routes that are NOT part of the SPA (full standalone documents). Links to
  // these always do a normal load.
  var HARD = [/^\/plan-print\b/, /^\/report-print\b/, /^\/yearbook\b/, /^\/privacy\b/, /^\/terms\b/];

  // Page-specific <style> blocks (the ones written into each page's HTML) get
  // swapped on navigation. Runtime styles injected by shared scripts — dark
  // mode (theme.js), the sync pill, the help popup — carry an id and must
  // persist, so only id-less styles are tagged for swapping.
  function tagStyles(root) {
    (root || document.head).querySelectorAll('style:not([id]):not([data-spa])').forEach(function(s) {
      s.setAttribute('data-spa', '');
    });
  }
  tagStyles(document.head);

  // ── Progress bar (thin green line at the very top) ──
  var bar;
  function progress(on) {
    if (!bar) {
      var st = document.createElement('style');
      st.id = 'spa-bar-style';
      st.textContent =
        '#spa-bar{position:fixed;top:0;left:0;height:3px;width:0;z-index:2000;' +
          'background:#3a7a3a;box-shadow:0 0 8px rgba(58,122,58,0.6);' +
          'transition:width 0.2s ease,opacity 0.3s ease;opacity:0}' +
        '@media print{#spa-bar{display:none}}';
      document.head.appendChild(st);
      bar = document.createElement('div');
      bar.id = 'spa-bar';
      document.body.appendChild(bar);
    }
    if (on) { bar.style.opacity = '1'; bar.style.width = '70%'; }
    else { bar.style.width = '100%'; setTimeout(function() { bar.style.opacity = '0'; bar.style.width = '0'; }, 200); }
  }

  function isHard(pathname) {
    return HARD.some(function(re) { return re.test(pathname); });
  }

  function sameOrigin(url) {
    return url.protocol === location.protocol && url.host === location.host;
  }

  function shouldIntercept(a, ev) {
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download') || a.getAttribute('rel') === 'external' || a.hasAttribute('data-no-spa')) return false;
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return false; }
    if (!sameOrigin(url)) return false;
    if (isHard(url.pathname)) return false;
    // Pure in-page hash change on the current page: let the browser handle it.
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return false;
    return true;
  }

  document.addEventListener('click', function(ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || !shouldIntercept(a, ev)) return;
    ev.preventDefault();
    navigate(a.href, true);
  });

  window.addEventListener('popstate', function() {
    navigate(location.href, false);
  });

  // For elements that navigate via script (onclick="location.href=…") rather
  // than an <a>. Soft-navigates when the target is an in-app route; otherwise
  // does a normal navigation.
  window.spaGo = function(url) {
    var u;
    try { u = new URL(url, location.href); } catch (e) { location.assign(url); return; }
    if (!sameOrigin(u) || isHard(u.pathname)) { location.assign(url); return; }
    navigate(u.href, true);
  };

  var navToken = 0;

  function navigate(url, push) {
    var token = ++navToken;
    progress(true);
    fetch(url, { headers: { 'X-Requested-With': 'spa' }, credentials: 'same-origin' })
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function(html) {
        if (token !== navToken) return; // a newer navigation superseded this one
        var doc = new DOMParser().parseFromString(html, 'text/html');
        if (push) history.pushState({}, '', url);
        return swap(doc).then(function() {
          afterNavigate(url);
          progress(false);
        });
      })
      .catch(function() {
        // Anything unexpected: fall back to a real navigation.
        location.assign(url);
      });
  }

  function mergeHead(doc) {
    document.title = doc.title || document.title;
    // Drop the previous page's swapped-in inline styles (id'd runtime styles
    // for dark mode, the sync pill, help, etc. are left alone).
    document.head.querySelectorAll('style[data-spa]').forEach(function(n) { n.remove(); });
    // Re-apply the new page's <style> blocks and stylesheets in their authored
    // order: each is appended to the end of <head> as we walk the source, and
    // existing stylesheets are *moved* there too, so the cascade is preserved —
    // e.g. mobile.css must stay after the page's own styles to keep overriding
    // them on small screens.
    doc.head.querySelectorAll('style:not([id]), link[rel="stylesheet"]').forEach(function(node) {
      if (node.tagName === 'LINK') {
        var href = node.getAttribute('href');
        if (!href) return;
        var existing = document.head.querySelector('link[rel="stylesheet"][href="' + CSS.escape(href) + '"]');
        document.head.appendChild(existing || node.cloneNode(true)); // move existing, or add new
      } else {
        var c = document.createElement('style');
        c.setAttribute('data-spa', '');
        c.textContent = node.textContent;
        document.head.appendChild(c);
      }
    });
  }

  // Execute the swapped-in scripts in document order. <script src> are loaded
  // and awaited so later inline scripts that depend on them run after; inline
  // scripts run synchronously. Shared library sources already present in the
  // realm are skipped so store.js/google-sync.js/etc. aren't re-initialized.
  function runScripts(container) {
    var scripts = Array.prototype.slice.call(container.querySelectorAll('script'));
    return scripts.reduce(function(chain, old) {
      return chain.then(function() {
        var src = old.getAttribute('src');
        if (src && document.head.querySelector('script[src="' + CSS.escape(src) + '"]')) {
          return; // shared lib already loaded once — don't re-run
        }
        return new Promise(function(resolve) {
          var s = document.createElement('script');
          for (var i = 0; i < old.attributes.length; i++) {
            s.setAttribute(old.attributes[i].name, old.attributes[i].value);
          }
          s.textContent = old.textContent;
          if (src) { s.onload = s.onerror = function() { resolve(); }; }
          document.body.appendChild(s);
          if (!src) resolve();
        });
      });
    }, Promise.resolve());
  }

  function swap(doc) {
    mergeHead(doc);
    // Replace the body's content. Persistent singletons (the sync pill, the
    // help button, the progress bar) are re-created by their own code after
    // the swap, so clearing them here is fine.
    var newBody = doc.body;
    // Detach scripts from the markup we inject, then run them deliberately.
    var injected = document.createElement('div');
    injected.style.display = 'contents';
    while (newBody.firstChild) injected.appendChild(newBody.firstChild);
    document.body.innerHTML = '';
    document.body.appendChild(injected);
    // Move the progress bar back so it stays on top.
    if (bar) document.body.appendChild(bar);
    window.scrollTo(0, 0);
    return runScripts(injected);
  }

  // The hard page load already ran a sync check; soft navigations happen far
  // more often, so throttle the per-navigation check to avoid a Drive request
  // on every single click.
  var lastSyncCheck = Date.now();
  var SYNC_CHECK_MIN_GAP = 60 * 1000;

  function afterNavigate(url) {
    var u = new URL(url, location.href);
    // Honor a deep-link hash now that the new page has rendered.
    if (u.hash) {
      var el = document.getElementById(u.hash.slice(1));
      if (el && el.scrollIntoView) el.scrollIntoView();
    }
    if (window.gsync && typeof gsync.syncCheck === 'function' &&
        Date.now() - lastSyncCheck > SYNC_CHECK_MIN_GAP) {
      lastSyncCheck = Date.now();
      gsync.syncCheck();
    }
    // Re-evaluate the backup reminder (and re-attach it if the body swap
    // detached it). Cheap and silent for people already using Drive sync.
    if (window.gsync && typeof gsync.exportReminderCheck === 'function') {
      gsync.exportReminderCheck();
    }
  }
})();
