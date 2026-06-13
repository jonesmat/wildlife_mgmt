// Dark mode. The app's styles are hardcoded light, so dark mode inverts the
// whole canvas (filter on the root element keeps position:fixed/sticky
// working) and re-inverts photos, maps, and videos so they stay true-color.
// The preference is per-device (localStorage, not synced), like gsync-auto.
// Load this script in <head>, before the page renders, to avoid a light flash.
(function() {
  'use strict';

  var KEY = 'ui-theme';

  var style = document.createElement('style');
  style.id = 'theme-style'; // id marks it as a persistent runtime style the SPA router won't swap out
  style.textContent =
    'html.dark-mode { filter: invert(0.92) hue-rotate(180deg); background: #f0f2f5; }' +
    'html.dark-mode img, html.dark-mode video { filter: invert(1) hue-rotate(180deg); }' +
    '@media print {' +
      'html.dark-mode { filter: none; }' +
      'html.dark-mode img, html.dark-mode video { filter: none; }' +
    '}';
  document.head.appendChild(style);

  function apply(dark) {
    document.documentElement.classList.toggle('dark-mode', dark);
  }

  window.appTheme = {
    isDark: function() { return localStorage.getItem(KEY) === 'dark'; },
    set: function(dark) {
      if (dark) localStorage.setItem(KEY, 'dark');
      else localStorage.removeItem(KEY);
      apply(dark);
    }
  };

  apply(window.appTheme.isDark());
})();
